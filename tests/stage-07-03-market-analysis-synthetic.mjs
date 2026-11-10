// Stage 07.3: synthetic-only market checks. Node >=18: node tests/stage-07-03-market-analysis-synthetic.mjs
// No Bybit connection, trades, installed Skills runtime, or real market evidence.
import { readFileSync, existsSync } from "node:fs";
const skillText=readFileSync(new URL("../.agents/skills/market-analysis/SKILL.md",import.meta.url),"utf8");
const skillUrl=new URL("../.agents/skills/market-analysis/SKILL.md",import.meta.url);
const results=[];
function t(label,a,e){results.push({id:"MT"+String(results.length+1).padStart(2,"0"),label,a,e,ok:Object.is(a,e)});}
function verifyHeader(s){let lines=s.split("\n");let end=lines.indexOf("---",1);return lines[0]==="---"&&end>2&&lines[1]==="name: market-analysis"&&lines[2].startsWith("description: ")&&lines[2].length-13<=1024&&lines.slice(end+1).join("").length>0;}
function identity(v,r){return !v||!["exchange","symbol","category","settleCoin"].every(x=>v[x])?"INCOMPLETE":["exchange","symbol","category","settleCoin"].every(x=>v[x]===r[x])?"MATCH":"MISMATCH";}
function sample(klines,now,minutes,n){
 if(!klines?.length)return {result:"MISSING",closed:[]};
 let step=minutes*60000;
 let bars=klines.map(x=>({ts:Number(x[0]),o:Number(x[1]),h:Number(x[2]),l:Number(x[3]),c:Number(x[4]),v:Number(x[5]),q:Number(x[6])})).sort((a,b)=>a.ts-b.ts);
 if(bars.some(b=>![b.ts,b.o,b.h,b.l,b.c,b.v,b.q].every(Number.isFinite)||b.o<=0||b.c<=0||b.l<=0||b.h<=0||b.l>b.o||b.l>b.c||b.h<b.o||b.h<b.c||b.v<0||b.q<0))return {result:"BAD_OHLC",closed:[]};
 if(bars.some((b,i)=>b.ts%step!==0||(i&&b.ts===bars[i-1].ts)))return {result:"BAD_TIME",closed:[]};
 let closed=bars.filter(x=>x.ts+step<=now);
 if(!closed.length)return {result:"OPEN_ONLY",closed};
 if(closed.some((b,i)=>i&&b.ts-closed[i-1].ts!==step))return {result:"GAP",closed};
 if(closed.at(-1).ts!==Math.floor(now/step)*step-step)return {result:"LATEST_CLOSED_MISSING",closed};
 if(closed.length<n)return {result:"WARMUP_MISSING",closed};
 return {result:"CLOSED_SAMPLE_ONLY",closed};
}
function sma(a,n){return n<1||a.length<n?null:a.slice(-n).reduce((v,x)=>v+x,0)/n;}
function ema(a,n){if(n<1||a.length<n)return null;let v=sma(a.slice(0,n),n);for(let k=n;k<a.length;k++)v=v+(a[k]-v)*2/(n+1);return v;}
function rsi(a,n){if(n<1||a.length<n+1)return null;let up=0,down=0;for(let i=1;i<=n;i++){let d=a[i]-a[i-1];up+=Math.max(0,d);down+=Math.max(0,-d);}up/=n;down/=n;for(let i=n+1;i<a.length;i++){let d=a[i]-a[i-1];up=(up*(n-1)+Math.max(0,d))/n;down=(down*(n-1)+Math.max(0,-d))/n;}return up===0&&down===0?null:down===0?100:up===0?0:100-100/(1+up/down);}
function tr(x,p){return Math.max(x.h-x.l,Math.abs(x.h-p),Math.abs(x.l-p));}
function atr(a,n){if(a.length<n+1||n<1)return null;let values=a.slice(1).map((x,i)=>tr(x,a[i].c));let v=sma(values.slice(0,n),n);for(let k=n;k<values.length;k++)v=(v*(n-1)+values[k])/n;return v;}
function oi(a){return a.length<2?"ONE_POINT":a.some(x=>x.definition!==a[0].definition||x.unit!==a[0].unit||x.market!==a[0].market)?"INCOMPATIBLE":a.some((x,i)=>i>0&&x.time<=a[i-1].time)?"TIME_CONFLICT":"COMPARABLE_NOT_SIGNAL";}
function funding(r,u,int){return u==="fraction"&&int&&Number.isFinite(r)?r*100:null;}
function marketConclusion({price=false,closed=false,method=false,conflict=false}){return conflict?"UNVERIFIED":price&&closed&&method?"R2_CONDITIONAL_NOT_READY":"NEEDS_DATA";}
function btc(a,b){return a&&b&&a.from===b.from&&a.to===b.to&&a.interval===b.interval&&a.market===b.market?"COMPARABLE_NOT_PROOF":"NOT_CHECKED";}
const ms=60000,now=Date.parse("2026-10-19T12:00:00Z");
const bar=(i,o=10,h=11,l=9,c=10,v=3,q=30)=>[String(now+i*ms),String(o),String(h),String(l),String(c),String(v),String(q)];
const a=[bar(-3),bar(-2,10,11,9,10.5),bar(-1,10.5,11,10,10.8),bar(0,10.8,11,10,10.9)];
const req={exchange:"Bybit",symbol:"BTCUSDT",category:"linear",settleCoin:"USDT"};
t("valid basic frontmatter",verifyHeader(skillText),true);
t("positive triggers",skillText.includes("## When to use"),true);
t("negative triggers",skillText.includes("## When **not** to use"),true);
t("R1 coverage",skillText.includes("R1"),true);
t("R2 coverage",skillText.includes("R2"),true);
t("last expected closed candle",skillText.includes("last expected closed candle"),true);
t("EMA SMA RSI ATR methods",["EMA","SMA","RSI","ATR"].every(x=>skillText.includes(x)),true);
t("OI definition documented",skillText.includes("singleOpenInterest"),true);
t("news and tokenomics",skillText.includes("tokenomics"),true);
t("no trade READY",skillText.includes("Never assign"),true);
t("identity matched",identity(req,req),"MATCH");
t("spot not perpetual",identity({...req,category:"spot"},req),"MISMATCH");
t("USDC not USDT",identity({...req,settleCoin:"USDC"},req),"MISMATCH");
t("wrong symbol",identity({...req,symbol:"ETHUSDT"},req),"MISMATCH");
t("category unknown",identity({...req,category:null},req),"INCOMPLETE");
t("reversed Bybit row order sorted",sample(a.slice().reverse(),now+ms/2,1,3).closed[0].ts,now-3*ms);
t("incomplete current candle excluded",sample(a,now+ms/2,1,3).closed.length,3);
t("last 3 closed accepted for test sample",sample(a,now+ms/2,1,3).result,"CLOSED_SAMPLE_ONLY");
t("no data",sample([],now,1,1).result,"MISSING");
t("only open bar",sample([a.at(-1)],now+ms/2,1,1).result,"OPEN_ONLY");
t("missing latest closed bar",sample(a.slice(0,2),now+ms/2,1,2).result,"LATEST_CLOSED_MISSING");
t("insufficient warmup",sample(a,now+ms/2,1,15).result,"WARMUP_MISSING");
t("gap in candles",sample([a[0],a[2],a[3]],now+ms/2,1,2).result,"GAP");
t("duplicate candle",sample([a[0],a[1],a[1],a[2]],now+ms/2,1,2).result,"BAD_TIME");
t("misaligned candle",sample([a[0],bar(-1.5),a[2]],now+ms/2,1,2).result,"BAD_TIME");
t("invalid high",sample([a[0],a[1],bar(-1,10,9,8,10.8)],now+ms/2,1,2).result,"BAD_OHLC");
t("negative volume",sample([a[0],a[1],bar(-1,10,11,9,10,-3)],now+ms/2,1,2).result,"BAD_OHLC");
t("non-numeric close",sample([a[0],a[1],bar(-1,10,11,9,"notpriced")],now+ms/2,1,2).result,"BAD_OHLC");
t("exact bar boundary closed",sample(a.slice(0,3),now,1,3).result,"CLOSED_SAMPLE_ONLY");
t("later time invalidates last bar",sample(a.slice(0,3),now+ms,1,2).result,"LATEST_CLOSED_MISSING");
t("SMA missing data",sma([1,2],3),null);
t("SMA expected value",sma([1,2,3,4],3),3);
t("EMA missing seed",ema([1,2],3),null);
t("EMA seeded known value",ema([1,2,3,4],3),3);
t("EMA 1 tracks last",ema([1,2,3],1),3);
t("RSI insufficient closes",rsi([1,2,3],3),null);
t("RSI only upward",rsi([1,2,3,4,5],3),100);
t("RSI only downward",rsi([5,4,3,2,1],3),0);
t("RSI flat undefined",rsi([2,2,2,2,2],3),null);
t("TR with previous-close gap",tr({h:12,l:10},15),5);
t("ATR insufficient",atr([{h:2,l:1,c:1}],1),null);
t("ATR constant 2",atr([{h:10,l:9,c:10},{h:11,l:9,c:10},{h:11,l:9,c:10},{h:11,l:9,c:10}],2),2);
const o={value:100,time:1,definition:"both",unit:"BTC",market:"linear"};
t("OI one point no trend",oi([o]),"ONE_POINT");
t("OI mixed side definitions",oi([o,{...o,time:2,definition:"single"}]),"INCOMPATIBLE");
t("OI unit mismatch",oi([o,{...o,time:2,unit:"USD"}]),"INCOMPATIBLE");
t("OI timestamp conflict",oi([o,{...o,time:1}]),"TIME_CONFLICT");
t("OI comparable not directional signal",oi([o,{...o,time:2,value:110}]),"COMPARABLE_NOT_SIGNAL");
t("funding .001 fraction equals 0.1 percent",funding(.001,"fraction",true),.1);
t("funding without interval not usable",funding(.001,"fraction",false),null);
t("funding percent unit is different",funding(.1,"percent",true),null);
const b={from:0,to:100,interval:"1h",market:"linear"};
t("BTC matched windows",btc(b,b),"COMPARABLE_NOT_PROOF");
t("BTC mismatched timeframe",btc(b,{...b,interval:"4h"}),"NOT_CHECKED");
t("BTC missing",btc(b,null),"NOT_CHECKED");
t("R2 no candle",marketConclusion({price:true,method:true}),"NEEDS_DATA");
t("R2 no price",marketConclusion({closed:true,method:true}),"NEEDS_DATA");
t("R2 no methodology",marketConclusion({price:true,closed:true}),"NEEDS_DATA");
t("R2 conflict",marketConclusion({price:true,closed:true,method:true,conflict:true}),"UNVERIFIED");
t("R2 local evidence not READY",marketConclusion({price:true,closed:true,method:true}),"R2_CONDITIONAL_NOT_READY");
const links=[...skillText.matchAll(/\]\(([^)]+)\)/g)].map(x=>x[1]).filter(x=>!x.startsWith("http"));
t("at least ten internal policy links",links.length>=11,true);
t("data-verification sibling link exists",links.includes("../data-verification/SKILL.md"),true);
t("every relative link points to a checked-out file",links.every(x=>existsSync(new URL(x,skillUrl))),true);
const failed=results.filter(x=>!x.ok);
for(const x of failed)console.error("FAIL",x.id,x.label,JSON.stringify({actual:x.a,expected:x.e}));
console.log(JSON.stringify({kind:"SYNTHETIC_MARKET_ANALYSIS",total:results.length,passed:results.length-failed.length,failed:failed.length,realMarket:false,realSkillRuntime:false,tradeReady:false}));
if(failed.length)process.exitCode=1;
