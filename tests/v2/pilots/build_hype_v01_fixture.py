#!/usr/bin/env python3
"""Produce an unmistakably synthetic, deterministic HYPE-V01 fixture.

No network, no exchange data, no keys; the HYPE name is a fictional
symbol label in these records, not a claim that prices are Bybit quotes.
Output is a ZIP of closed OHLCV candles (15m,1h,4h,1d), a manifest
with individual SHA256 digests, and explicit synthetic risk cases.
"""
from __future__ import annotations
import csv, hashlib, io, json, math, random, sys, zipfile
from datetime import datetime, timezone
from pathlib import Path

SEED=20261137
AS_OF='2026-10-20T09:00:00Z'  # pinned historical simulation clock
END=int(datetime.fromisoformat(AS_OF.replace('Z','+00:00')).timestamp())
M15=900
DAYS=310
N=DAYS*96

def canonical(data):
    return (json.dumps(data,ensure_ascii=False,sort_keys=True,indent=2)+'\n').encode('utf-8')

def digest(data):
    return hashlib.sha256(data).hexdigest()

def ts(seconds):
    return datetime.fromtimestamp(seconds,timezone.utc).isoformat().replace('+00:00','Z')

def generate():
    rng=random.Random(SEED)
    start=END-N*M15
    cur=46.0
    bars=[]
    for i in range(N):
        t=start+i*M15
        phase=i/N
        # More recent global uptrend, with bounded intraday oscillations.
        drift = 0.000010 if phase < 0.72 else 0.000035
        if i>N-120:
            drift+=0.000045
        # Rare, bounded pullbacks; no unphysical positive-only tape.
        noise = rng.gauss(0,0.00076)
        change=drift+noise+0.00007*math.sin(i/19.0)
        o=cur
        c=cur*math.exp(change)
        swing=abs(noise)*0.6+0.0002
        h=max(o,c)*(1+swing)
        l=min(o,c)*(1-swing)
        v=10000 + 8000*abs(noise)/0.00076 + 6000*(1+math.sin(i/15.0))/2
        bars.append((t,o,h,l,c,round(v,4)))
        cur=c
    # Normalize entire tape to an illustrative recent 75 USDT price level.
    factor=75.0/cur
    bars=[(t,round(o*factor,6),round(h*factor,6),round(l*factor,6),round(c*factor,6),v)
          for t,o,h,l,c,v in bars]
    return bars

def aggregate(raw,step):
    groups={}
    for row in raw:
        k=row[0]-row[0]%step
        groups.setdefault(k,[]).append(row)
    rows=[]
    expected=step//M15
    for k,rs in groups.items():
        if len(rs)!=expected or rs[0][0]!=k or rs[-1][0]+M15!=k+step:
            continue
        rows.append((k,rs[0][1],max(x[2] for x in rs),min(x[3] for x in rs),rs[-1][4],round(sum(x[5] for x in rs),4)))
    return sorted(rows)

def csv_data(rows, step):
    b=io.StringIO(newline='')
    w=csv.writer(b,lineterminator='\n')
    w.writerow(['start_ms','start_utc','end_utc','open','high','low','close','volume_base'])
    for t,o,h,l,c,v in rows:
        w.writerow([t*1000,ts(t),ts(t+step),f'{o:.6f}',f'{h:.6f}',f'{l:.6f}',f'{c:.6f}',f'{v:.4f}'])
    return b.getvalue().encode('utf-8')

def ema(values,n):
    x=sum(values[:n])/n
    for v in values[n:]: x+=2/(n+1)*(v-x)
    return x

def rsi(values,n=14):
    deltas=[values[i]-values[i-1] for i in range(1,len(values))]
    g=sum(max(0,x) for x in deltas[:n])/n
    l=sum(max(0,-x) for x in deltas[:n])/n
    for d in deltas[n:]:
        g=(g*(n-1)+max(0,d))/n
        l=(l*(n-1)+max(0,-d))/n
    return 100-100/(1+g/l) if l else 100.0

def summary(rows):
    closes=[x[4] for x in rows]
    return {'close':round(closes[-1],6),'ema20':round(ema(closes,20),5),'ema50':round(ema(closes,50),5),
            'ema200':round(ema(closes,200),5),'rsi14_wilder':round(rsi(closes),3)}

def main():
    root=Path(__file__).parent
    archive=root/'HYPE-V01-SYNTHETIC.zip'
    if archive.exists(): raise FileExistsError(archive)
    raw=generate()
    data={
        '15m':raw[-300:],
        '1h':aggregate(raw,3600)[-300:],
        '4h':aggregate(raw,14400)[-300:],
        '1d':aggregate(raw,86400)[-300:]}
    intervals={'15m':900,'1h':3600,'4h':14400,'1d':86400}
    if any(len(x)!=300 for x in data.values()): raise RuntimeError('Insufficient closed bars')
    for tf,rows in data.items():
        step=intervals[tf]
        if any(rows[i+1][0]-rows[i][0]!=step for i in range(len(rows)-1)):
            raise RuntimeError('Gap in '+tf)
        if rows[-1][0]+step>END: raise RuntimeError('Open bar in '+tf)
    files={f'synthetic/{k}.csv':csv_data(v,intervals[k]) for k,v in data.items()}
    fixture={
      'run_id':'HYPE-V01',
      'label':'SYNTHETIC_ONLY / NEVER_REAL_QUOTES / NEVER_TRADE',
      'scenario_as_of_utc':AS_OF,
      'synthetic_market':{'symbol':'HYPEUSDT','exchange':'BYBIT_LABEL_ONLY','category':'linear',
                          'settle_coin':'USDT','source':'GENERATED_BY_LOCAL_PYTHON_NO_NETWORK'},
      'strategy_test':{'intended_branch':'SIMULATED_LONG_CANDIDATE',
                       'inference_rule':'NOT_FORCED; if the indicator evidence does not justify LONG, explain WAIT or fail synthetic fixture suitability',
                       'benchmark_platform':'VELES_DCA', 'benchmark_mode':'CUSTOM / Свой / hypothetical only',
                       'mode_is_user_confirmed':False, 'real_P02_available':False,
                       'test_budget_usdt':100, 'test_budget_is_real_equity':False,
                       'illustrative_total_initial_margin_usdt':12,
                       'illustrative_leverage_max':3,
                       'illustrative_order_margin_splits_usdt':[4,4,4],
                       'stop_loss_guarantees_worst_loss':False},
      'cases':[
       {'id':'V01-A','type':'POSITIVE_DRAFT',
        'conditions':'SYNTHETIC market evidence and LONG candidate; P01 docs only, actual P02/T02 absent',
        'expected':'DRAFT or NEEDS_DATA with DOCUMENTED_ONLY Veles mapping; never VERIFIED_FOR_MANUAL_REVIEW'},
       {'id':'V01-B','type':'VETO_INJECTION',
        'override':{'synthetic_H04':'ACTIVE'},
        'expected':'REJECTED / NOT_RECOMMENDED for any NEW or ADD exposure irrespective of attractive LONG signal'},
       {'id':'V01-C','type':'UNSUPPORTED_UI_INJECTION',
        'override':{'provided_user_P02':'NONE'},
        'expected':'Do not invent exact live Veles mode/fields, never READY; specify missing P02 and T02'}]
      }
    files['synthetic/test-cases.json']=canonical(fixture)
    manifest={
      'run_id':'HYPE-V01','format_version':1,'status':'SYNTHETIC_ONLY','is_real_bybit_data':False,
      'scenario_as_of_utc':AS_OF,'generation_seed':SEED,'generation_script':'build_hype_v01_fixture.py',
      'generator_does_network_requests':False,'candles_per_tf':300,
      'timeframes_sec':intervals,'market_symbol_label':'HYPEUSDT',
      'files':[{ 'path':p,'bytes':len(c),'sha256':digest(c)} for p,c in sorted(files.items())],
      'computed_sanity_check_not_a_trade_signal':{k:summary(v) for k,v in data.items()},
      'warnings':['Fictional OHLCV. Never use as market observations or price forecasts.',
                  'The test-account figures are hypothetical calculations, not verified portfolio risk.',
                  'No current market or real P02 mapping is represented.']
    }
    files['manifest.json']=canonical(manifest)
    with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
        for key,b in sorted(files.items()):
            zi=zipfile.ZipInfo(key, date_time=(2026,10,20,9,0,0))
            zi.compress_type=zipfile.ZIP_DEFLATED
            zi.external_attr=0o600<<16
            z.writestr(zi,b)
    print('ARCHIVE',str(archive))
    print('SHA256',digest(archive.read_bytes()))
    print('manifest_sanity_check',json.dumps(manifest['computed_sanity_check_not_a_trade_signal'],ensure_ascii=False,indent=2))

if __name__=='__main__': main()
