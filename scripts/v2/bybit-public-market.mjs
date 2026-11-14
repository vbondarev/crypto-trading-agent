#!/usr/bin/env node
/*
 Crypto Trading Agent v2 — read-only public Bybit V5 collector, NOT ACTIVE.
 Node.js >=18. No credentials or account endpoints. No third-party dependencies.
 Usage:
 node scripts/v2/bybit-public-market.mjs --self-test
 node scripts/v2/bybit-public-market.mjs --symbol HYPEUSDT --out <folder-outside-repo>
 */
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const BASE='https://api.bybit.com', CATEGORY='linear';
const FRAMES=Object.freeze({'15':900000,'60':3600000,'240':14400000,'D':86400000});
const MIN_BARS=250, LIMIT=300, CLOSE_GRACE_MS=10000, MAX_CLOCK_SKEW_MS=300000;
const must=(condition,code)=>{if(!condition)throw Error(code);};
const decimal=x=>typeof x==='string'&&/^(0|[1-9]\d*)(\.\d+)?$/.test(x)&&Number.isFinite(Number(x));
const positive=x=>decimal(x)&&Number(x)>0;
const validSymbol=s=>{const v=String(s||'').toUpperCase();must(/^[A-Z0-9]{2,24}USDT$/.test(v),'INVALID_USDT_SYMBOL');return v;};
const ms=x=>{const v=Number(x);must(Number.isSafeInteger(v)&&v>=1500000000000&&v<9000000000000,'BAD_SERVER_TIME');return v;};
const expected=(server,frame)=>Math.floor((server-CLOSE_GRACE_MS)/frame)*frame-frame;
const endpoint=(path,query={})=>{
  must(['/v5/market/time','/v5/market/tickers','/v5/market/instruments-info','/v5/market/kline'].includes(path),'ENDPOINT_NOT_ALLOWED');
  const u=new URL(path,BASE);for(const [k,v] of Object.entries(query))u.searchParams.set(k,String(v));return u.toString();
};
function envelope(j,kind){
  must(j&&j.retCode===0,kind+'_BYBIT_RETCODE_ERROR');
  must(j.result&&typeof j.result==='object',kind+'_RESULT_MISSING');
  return ms(j.time);
}
function serverTime(j){
  const stamp=envelope(j,'TIME');
  must(Math.abs(Number(j.result.timeSecond)*1000-stamp)<3000,'SERVER_TIME_CONFLICT');
  return stamp;
}
function instrument(j,symbol){
  envelope(j,'INSTRUMENT');
  const r=j.result;
  must(r.category===CATEGORY&&Array.isArray(r.list)&&r.list.length===1,'INSTRUMENT_MARKET_OR_COUNT');
  const x=r.list[0];
  must(x.symbol===symbol&&x.quoteCoin==='USDT'&&x.settleCoin==='USDT'&&x.status==='Trading','INSTRUMENT_IDENTITY_OR_STATUS');
  return {status:'INSTRUMENT_VERIFIED_IN_RESPONSE',symbol,contractType:x.contractType??null};
}
function ticker(j,symbol){
  const stamp=envelope(j,'TICKER'),r=j.result;
  must(r.category===CATEGORY&&Array.isArray(r.list)&&r.list.length===1,'TICKER_MARKET_OR_COUNT');
  const x=r.list[0];must(x.symbol===symbol,'TICKER_SYMBOL_MISMATCH');
  for(const name of ['markPrice','lastPrice','indexPrice'])must(positive(x[name]),'TICKER_BAD_'+name);
  return {status:'TICKER_VERIFIED_IN_RESPONSE',symbol,markPrice:x.markPrice,lastPrice:x.lastPrice,
    indexPrice:x.indexPrice,openInterest:decimal(x.openInterest)?x.openInterest:null,
    fundingRate:typeof x.fundingRate==='string'?x.fundingRate:null,
    response_time_ms:stamp,observation:'BYBIT_RESPONSE_TIME_PROXY_NOT_FIELD_TIME'};
}
function candles(j,interval,symbol){
  const stamp=envelope(j,'KLINE'),frame=FRAMES[interval],r=j.result;
  must(frame&&r.category===CATEGORY&&r.symbol===symbol&&Array.isArray(r.list),'KLINE_MARKET_MISMATCH');
  must(r.list.length>0&&r.list.length<=1000,'KLINE_ROW_COUNT');
  const rows=r.list.map((v,i)=>{
    must(Array.isArray(v)&&v.length===7,'KLINE_ROW_SHAPE_'+i);
    const start=Number(v[0]);
    must(Number.isSafeInteger(start)&&start>0&&start%frame===0,'KLINE_START_INVALID_'+i);
    for(let n=1;n<=6;n++)must(decimal(v[n]),'KLINE_BAD_DECIMAL_'+i+'_'+n);
    const [o,h,l,c]=v.slice(1,5).map(Number);
    must(o>0&&h>0&&l>0&&c>0&&h>=Math.max(o,l,c)&&l<=Math.min(o,c),'KLINE_BAD_OHLC_'+i);
    return start;
  });
  for(let i=1;i<rows.length;i++)must(rows[i-1]>rows[i],'KLINE_ORDER_OR_DUPLICATE');
  const usable=rows.filter(start=>start+frame<=stamp-CLOSE_GRACE_MS).reverse();
  let gaps=0;for(let i=1;i<usable.length;i++)if(usable[i]-usable[i-1]!==frame)gaps++;
  const last=usable.at(-1)??null,expectedStart=expected(stamp,frame);
  return {interval,source:'BYBIT_LINEAR_TRADE_KLINE',response_time_ms:stamp,
    raw_rows:rows.length,time_eligible_rows:usable.length,excluded_recent_or_open:rows.length-usable.length,
    latest_time_eligible_start_ms:last,expected_latest_start_ms:expectedStart,
    contiguous:gaps===0,gap_count:gaps,min_closed_bars:MIN_BARS,
    finalization:'TIME_ELAPSED_ONLY_EXCHANGE_FINALITY_NOT_INDEPENDENTLY_PROVEN',
    status:usable.length>=MIN_BARS&&gaps===0&&last===expectedStart?
      'DATA_READY_FOR_TECHNICAL_REVIEW_WITH_FINALIZATION_CAVEAT':'NEEDS_DATA'};
}
async function readPublic(url,transport=fetch){
  let resp;const started=new Date().toISOString();
  try{resp=await transport(url,{method:'GET',headers:{Accept:'application/json'},redirect:'error',
    signal:AbortSignal.timeout(16000)});}
  catch(e){throw Error('PUBLIC_NETWORK_UNAVAILABLE_'+(e?.cause?.code??e?.name??'ERROR'));}
  must(resp.ok,'PUBLIC_HTTP_STATUS_'+resp.status);
  const raw=await resp.text();must(raw.length>0&&raw.length<3000000,'PUBLIC_HTTP_BODY_INVALID');
  let j;try{j=JSON.parse(raw);}catch{throw Error('PUBLIC_HTTP_NOT_JSON');}
  envelope(j,'HTTP');
  return {j,raw,transport:{url,requested_utc:started,received_utc:new Date().toISOString(),status:resp.status}};
}
async function collect({symbol='HYPEUSDT',out,transport=fetch,now=()=>Date.now()}){
  symbol=validSymbol(symbol);must(typeof out==='string'&&out.trim(),'OUTPUT_DIRECTORY_REQUIRED');
  const dir=resolve(out);await mkdir(dir,{recursive:true});
  const manifest={schema:'crypto-trading-agent/v2/bybit-public-market-v1',symbol,category:CATEGORY,origin:BASE,
    collected_utc:new Date(now()).toISOString(),no_keys:true,no_account_access:true,no_trade:true,
    datasets:{},errors:[],quality:'NEEDS_DATA',readiness:'NO_TRADE_READY',
    disclaimer:'Time elapsed does not independently prove Bybit bar finalization or trading readiness.'};
  const requests=[
    ['time','/v5/market/time',{}],
    ['instruments','/v5/market/instruments-info',{category:CATEGORY,symbol}],
    ['ticker','/v5/market/tickers',{category:CATEGORY,symbol}],
    ...Object.keys(FRAMES).map(interval=>['kline-'+interval,'/v5/market/kline',{category:CATEGORY,symbol,interval,limit:LIMIT}])
  ];
  for(const [name,path,query] of requests){
    const url=endpoint(path,query);
    try{
      const {j,raw,transport:meta}=await readPublic(url,transport);
      let result;
      if(name==='time'){
        const server=serverTime(j),skew=now()-server;
        must(Math.abs(skew)<=MAX_CLOCK_SKEW_MS,'CLOCK_CONFLICT');
        result={status:'BYBIT_TIME_OBSERVED',server_time_ms:server,client_skew_ms:skew};
      }else if(name==='instruments')result=instrument(j,symbol);
      else if(name==='ticker')result=ticker(j,symbol);
      else result=candles(j,name.substring(6),symbol);
      const filename='bybit-'+name+'.json';
      await writeFile(join(dir,filename),raw,'utf8');
      manifest.datasets[name]={...meta,file:filename,result};
    }catch(e){
      manifest.errors.push({dataset:name,error:String(e.message||e).slice(0,180)});
      manifest.datasets[name]={url,status:'ACCESS_UNAVAILABLE_OR_INVALID'};
      break; // no silent fallback to spot, third-party quotes, or synthetic values
    }
  }
  const needed=['time','instruments','ticker',...Object.keys(FRAMES).map(v=>'kline-'+v)];
  const complete=!manifest.errors.length&&needed.every(v=>manifest.datasets[v]?.result)&&
    Object.keys(FRAMES).every(v=>manifest.datasets['kline-'+v].result.status===
      'DATA_READY_FOR_TECHNICAL_REVIEW_WITH_FINALIZATION_CAVEAT');
  manifest.quality=complete?'PUBLIC_DATA_READY_FOR_TECHNICAL_REVIEW_WITH_FINALIZATION_CAVEAT':'NEEDS_DATA';
  await writeFile(join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n','utf8');
  return {dir,manifest};
}
async function selfTest(){
  const t=Date.parse('2026-11-14T12:13:00Z'),sym='HYPEUSDT';
  const pack=(result)=>({retCode:0,retMsg:'OK',time:t,result});
  const ist=pack({category:'linear',list:[{symbol:sym,status:'Trading',quoteCoin:'USDT',settleCoin:'USDT'}]});
  const tick=pack({category:'linear',list:[{symbol:sym,markPrice:'32.5',lastPrice:'32.6',indexPrice:'32.7'}]});
  const bar=interval=>{const size=FRAMES[interval],last=expected(t,size);
    return pack({category:'linear',symbol:sym,list:Array.from({length:301},(_,i)=>
      [String(last+size-i*size),'32','33','31','32','100','3200'])});};
  assert.equal(validSymbol('hypeusdt'),sym);
  assert.throws(()=>validSymbol('../secret'));
  assert.equal(serverTime(pack({timeSecond:String(Math.floor(t/1000))})),t);
  assert.equal(instrument(ist,sym).symbol,sym);
  assert.throws(()=>instrument({...ist,result:{category:'spot',list:ist.result.list}},sym));
  assert.equal(ticker(tick,sym).markPrice,'32.5');
  assert.throws(()=>ticker({...tick,result:{category:'spot',list:tick.result.list}},sym));
  assert.throws(()=>envelope({...tick,retCode:10006},'TEST'));
  for(const interval of Object.keys(FRAMES)){
    const v=candles(bar(interval),interval,sym);
    assert.equal(v.time_eligible_rows,300);
    assert.equal(v.excluded_recent_or_open,1);
    assert.equal(v.status,'DATA_READY_FOR_TECHNICAL_REVIEW_WITH_FINALIZATION_CAVEAT');
  }
  const broken=bar('60');broken.result.list.splice(16,1);
  assert.equal(candles(broken,'60',sym).status,'NEEDS_DATA');
  const dup=bar('15');dup.result.list[2][0]=dup.result.list[1][0];
  assert.throws(()=>candles(dup,'15',sym));
  const bad=bar('240');bad.result.list[0][2]='1';
  assert.throws(()=>candles(bad,'240',sym));
  const table=new Map([
    [endpoint('/v5/market/time'),pack({timeSecond:String(Math.floor(t/1000))})],
    [endpoint('/v5/market/instruments-info',{category:CATEGORY,symbol:sym}),ist],
    [endpoint('/v5/market/tickers',{category:CATEGORY,symbol:sym}),tick],
    ...Object.keys(FRAMES).map(v=>[endpoint('/v5/market/kline',{category:CATEGORY,symbol:sym,interval:v,limit:LIMIT}),bar(v)])
  ]);
  const transport=async url=>({ok:true,status:200,text:async()=>JSON.stringify(table.get(url))});
  const dir=await mkdtemp(join(tmpdir(),'bybit-v2-synthetic-'));
  try{
    const result=await collect({symbol:sym,out:dir,transport,now:()=>t});
    assert.equal(result.manifest.quality,'PUBLIC_DATA_READY_FOR_TECHNICAL_REVIEW_WITH_FINALIZATION_CAVEAT');
    assert.equal(result.manifest.readiness,'NO_TRADE_READY');
    assert.equal(result.manifest.errors.length,0);
    const saved=JSON.parse(await readFile(join(dir,'manifest.json'),'utf8'));
    assert.equal(saved.datasets['kline-60'].result.time_eligible_rows,300);
  }finally{await rm(dir,{recursive:true,force:true});}
  console.log('SELF_TEST_PASS: simulated data only; no real Bybit API was reached.');
}
async function main(){
  const argv=process.argv.slice(2);
  if(argv.includes('--self-test'))return selfTest();
  if(argv.includes('--help')||argv.length===0){
    console.log('node scripts/v2/bybit-public-market.mjs --self-test | --symbol HYPEUSDT --out <folder>');
    return;
  }
  let symbol='HYPEUSDT',out;
  for(let i=0;i<argv.length;i++){
    if(argv[i]==='--symbol')symbol=argv[++i];
    else if(argv[i]==='--out')out=argv[++i];
    else throw Error('UNKNOWN_ARGUMENT_'+argv[i]);
  }
  const {dir,manifest}=await collect({symbol,out});
  console.log('EXPORT_DIR='+dir);
  console.log('QUALITY='+manifest.quality+' / '+manifest.readiness);
  if(manifest.errors.length){console.error(JSON.stringify(manifest.errors));process.exitCode=2;}
  else if(manifest.quality.startsWith('NEEDS_DATA'))process.exitCode=3;
}
main().catch(e=>{console.error('ERROR: '+e.message);process.exitCode=1;});
