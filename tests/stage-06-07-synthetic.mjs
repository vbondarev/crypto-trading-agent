// Synthetic only: not a trading engine, Bybit replica, or proof of READY.
// Node.js >=18: node tests/stage-06-07-synthetic.mjs
// All prices, money amounts, MMR and model evidence flags below are hypothetical.
const mergeFixture = function mergeFixture(base,change){return {...base,...change,evidence:{...base.evidence,...(change.evidence||{})},portfolio:{...base.portfolio,...(change.portfolio||{})}}};
const getOrderIdentity = function getOrderIdentity(o){return o.id==null||o.id===""?null:[o.account,o.symbol,o.slot,o.id].join("|");};
const normalizeOrders = function normalizeOrders(rows){const ids=new Map(),items=[],issues=[];for(const o of rows){const k=getOrderIdentity(o);if(!k){issues.push("ORDER_ID_UNKNOWN");items.push(o);continue;}const old=ids.get(k);if(old){if(old.qty!==o.qty||old.state!==o.state||old.side!==o.side)issues.push("ORDER_ID_CONFLICT");continue;}ids.set(k,o);items.push(o);}return {items,issues};};
const normalizePositions = function normalizePositions(rows){const ids=new Set(),items=[],issues=[];for(const p of rows){const k=[p.account,p.symbol,p.slot].join("|");if(ids.has(k)){issues.push("POSITION_SLOT_DUPLICATED");continue;}ids.add(k);items.push(p);}return {items,issues};};
const stressPnl = function stressPnl(f,s,os){let profit=0;const fx=f.fxUsdPerQuote;for(const p of f.positions){if(!Object.hasOwn(s.marks,p.symbol))return null;profit+=(p.side==="Long"?1:-1)*p.qty*(s.marks[p.symbol]-p.mark)*fx;}for(const o of os){if(!s.fillIds.includes(o.id)||["CANCELLED_CONFIRMED","FILLED"].includes(o.state))continue;if(!Object.hasOwn(s.marks,o.symbol))return null;profit+=(o.side==="Long"?1:-1)*o.qty*(s.marks[o.symbol]-o.price)*fx;}return {pnlUsd:profit,lossUsd:Math.max(0,-profit+s.extraCostsUsd)};};
const review = function review(f){
 const hard=[],unverified=[],missing=[],trace={};
 if(f.h04)hard.push("ACTIVE_H04");
 if(f.incompatible)hard.push("INCOMPATIBLE_PLATFORM_MODE");
 if(f.conflict)unverified.push("CONFLICT_P01_P02_OWNER");
 if(!f.evidence.p02)missing.push("MISSING_P02");
 if(!f.evidence.t02)missing.push("MISSING_T02");
 if(!f.evidence.mark)missing.push("MISSING_MARK");
 if(!f.evidence.instrument)missing.push("MISSING_INSTRUMENT");
 if(f.ageT02Min>5||f.ageMarkMin>2||f.eventSinceSnapshot)missing.push("STALE_T02_MARK_OR_EVENT");
 if(!(f.fxUsdPerQuote>0))missing.push("FX_UNIT_UNVERIFIED");
 if(!f.portfolio||!(f.portfolio.equityUsd>0))missing.push("EQUITY_UNVERIFIED");
 const orders=normalizeOrders(f.orders),positions=normalizePositions(f.positions);
 unverified.push(...orders.issues,...positions.issues);
 const eq=f.portfolio?.equityUsd;
 trace.uniqueOrders=orders.items.length;
 trace.positionSlots=positions.items.filter(p=>p.qty>0).length;
 // Unknown purpose is conservatively counted as a future opening commitment,
 // while retaining UNVERIFIED status until the order can be classified.
 const futureOpenOrders=orders.items.filter(o=>!["CANCELLED_CONFIRMED","FILLED"].includes(o.state)&&o.purpose!=="OUT");
 const projectedKeys=new Set(positions.items.filter(p=>p.qty>0).map(p=>[p.account,p.symbol,p.slot].join("|")));
 for(const o of futureOpenOrders) projectedKeys.add([o.account,o.symbol,o.slot].join("|"));
 trace.projectedPositionSlots=projectedKeys.size;
 if(orders.items.some(o=>!["IN","OUT"].includes(o.purpose)))unverified.push("UNKNOWN_ORDER_PURPOSE");
 trace.requiredReserveUsd=orders.items.filter(o=>!["CANCELLED_CONFIRMED","FILLED"].includes(o.state)&&o.purpose!=="OUT").reduce((n,o)=>n+o.imUsd,0)+f.portfolio.futureBufferUsd;
 trace.projectedMarginUsd=f.portfolio.initialMarginUsd+f.portfolio.marginBufferUsd+orders.items.filter(o=>!["CANCELLED_CONFIRMED","FILLED"].includes(o.state)&&o.purpose!=="OUT"&&!o.accountedInBaseIm).reduce((n,o)=>n+o.imUsd,0);
 trace.marginRatio=eq>0?trace.projectedMarginUsd/eq:null;
 if(f.leverage>5)hard.push("FR031_LEVERAGE_5X");
 if(trace.projectedPositionSlots>3)hard.push("FR033_POSITION_COUNT_3");
 if(eq>0&&trace.marginRatio>.30+1e-9)hard.push("FR029_MARGIN_30_PERCENT");
 if(f.allocatedReserveUsd+1e-9<trace.requiredReserveUsd)hard.push("FR034_FUTURE_RESERVE");
 if(!f.evidence.ownership)unverified.push("OWNERSHIP_NOT_CONFIRMED");
 if(!f.evidence.cross)unverified.push("RV02_CROSS_UNVERIFIED");
 if(!f.evidence.shortBound)unverified.push("RV03_SHORT_BOUND_UNVERIFIED");
 if(!f.evidence.liqDistance)unverified.push("FR032_LIQ_DISTANCE_UNVERIFIED");
 else if(f.liqDistance<.15-1e-9)hard.push("FR032_LIQ_DISTANCE_15_PERCENT");
 if(!f.evidence.finiteGrid)unverified.push("FUTURE_REENTRY_NOT_BOUNDED");
 if(!Array.isArray(f.stresses)||f.stresses.length<4)missing.push("FOUR_STRESSES_REQUIRED");
 trace.stresses=[];
 if(f.fxUsdPerQuote>0&&f.stresses){for(const s of f.stresses){const v=stressPnl(f,s,orders.items);if(!v){missing.push("STRESS_MARK_MISSING");continue;}trace.stresses.push({name:s.name,...v});if(eq>0&&v.lossUsd>eq*.05+1e-9)hard.push("FR030_BOT_LOSS:"+s.name);if(s.mmr===undefined)unverified.push("ACCOUNT_MMR_UNKNOWN:"+s.name);else if(s.mmr>=1)hard.push("ACCOUNT_MMR_100_PERCENT:"+s.name);}}
 trace.maxStressLossUsd=trace.stresses.length?Math.max(...trace.stresses.map(x=>x.lossUsd)):null;
 const uniq=a=>[...new Set(a)];
 return {status:hard.length?"REJECTED":unverified.length?"UNVERIFIED":missing.length?"NEEDS_DATA":"LOCAL_POLICY_PASS_NOT_READY",hard:uniq(hard),unverified:uniq(unverified),missing:uniq(missing),trace};
};
const look = function look(o,path){let cur=o;for(const key of path.split(".")){cur=cur?.[key];}return cur};
const testOne = function testOne(base,caseDef){const r=review(mergeFixture(base,caseDef.patch));const v=look(r,caseDef.path);const passed=caseDef.contains?Array.isArray(v)&&v.includes(caseDef.expected):typeof v==="number"&&typeof caseDef.expected==="number"?Math.abs(v-caseDef.expected)<1e-9:Object.is(v,caseDef.expected);return {id:caseDef.id,subject:caseDef.subject,passed,expected:caseDef.expected,actual:v};};
const base = {
  "evidence": {
    "p02": true,
    "t02": true,
    "mark": true,
    "instrument": true,
    "ownership": true,
    "cross": true,
    "shortBound": true,
    "liqDistance": true,
    "finiteGrid": true
  },
  "portfolio": {
    "equityUsd": 1000,
    "initialMarginUsd": 100,
    "marginBufferUsd": 10,
    "futureBufferUsd": 10
  },
  "leverage": 3,
  "allocatedReserveUsd": 100,
  "liqDistance": 0.2,
  "fxUsdPerQuote": 1,
  "ageT02Min": 1,
  "ageMarkMin": 1,
  "eventSinceSnapshot": false,
  "h04": false,
  "incompatible": false,
  "conflict": false,
  "positions": [
    {
      "account": "A",
      "symbol": "AAAUSDT",
      "slot": 2,
      "side": "Short",
      "qty": 2,
      "mark": 100
    }
  ],
  "orders": [
    {
      "account": "A",
      "symbol": "AAAUSDT",
      "slot": 2,
      "id": "i1",
      "side": "Short",
      "qty": 1,
      "price": 110,
      "imUsd": 20,
      "state": "ACTIVE",
      "purpose": "IN",
      "accountedInBaseIm": true
    },
    {
      "account": "A",
      "symbol": "AAAUSDT",
      "slot": 2,
      "id": "i2",
      "side": "Short",
      "qty": 1,
      "price": 120,
      "imUsd": 20,
      "state": "VIRTUAL",
      "purpose": "IN",
      "accountedInBaseIm": false
    }
  ],
  "stresses": [
    {
      "name": "S1_ADVERSE_UP",
      "marks": {
        "AAAUSDT": 104
      },
      "fillIds": [],
      "extraCostsUsd": 3,
      "mmr": 0.2
    },
    {
      "name": "S2_ALL_IN",
      "marks": {
        "AAAUSDT": 110
      },
      "fillIds": [
        "i1",
        "i2"
      ],
      "extraCostsUsd": 3,
      "mmr": 0.4
    },
    {
      "name": "S3_GAP",
      "marks": {
        "AAAUSDT": 112
      },
      "fillIds": [],
      "extraCostsUsd": 5,
      "mmr": 0.5
    },
    {
      "name": "S4_OTHER_COSTS",
      "marks": {
        "AAAUSDT": 105
      },
      "fillIds": [
        "i1"
      ],
      "extraCostsUsd": 7,
      "mmr": 0.31
    }
  ]
};
const cases = [
  {
    "id": "R01",
    "subject": "base synthetic is never live READY",
    "patch": {},
    "path": "status",
    "expected": "LOCAL_POLICY_PASS_NOT_READY",
    "contains": false
  },
  {
    "id": "R02",
    "subject": "margin occupied active does not double count",
    "patch": {},
    "path": "trace.projectedMarginUsd",
    "expected": 130,
    "contains": false
  },
  {
    "id": "R03",
    "subject": "reserve all active plus virtual",
    "patch": {},
    "path": "trace.requiredReserveUsd",
    "expected": 50,
    "contains": false
  },
  {
    "id": "R04",
    "subject": "one position slot",
    "patch": {},
    "path": "trace.positionSlots",
    "expected": 1,
    "contains": false
  },
  {
    "id": "R05",
    "subject": "two distinct future IN",
    "patch": {},
    "path": "trace.uniqueOrders",
    "expected": 2,
    "contains": false
  },
  {
    "id": "R06",
    "subject": "margin exact threshold 30%",
    "patch": {
      "portfolio": {
        "initialMarginUsd": 270
      }
    },
    "path": "trace.marginRatio",
    "expected": 0.3,
    "contains": false
  },
  {
    "id": "R07",
    "subject": "margin 31% blocked",
    "patch": {
      "portfolio": {
        "initialMarginUsd": 280
      }
    },
    "path": "hard",
    "expected": "FR029_MARGIN_30_PERCENT",
    "contains": true
  },
  {
    "id": "R08",
    "subject": "leverage >5 blocked",
    "patch": {
      "leverage": 6
    },
    "path": "hard",
    "expected": "FR031_LEVERAGE_5X",
    "contains": true
  },
  {
    "id": "R09",
    "subject": "leverage ==5 not alone blocked",
    "patch": {
      "leverage": 5
    },
    "path": "status",
    "expected": "LOCAL_POLICY_PASS_NOT_READY",
    "contains": false
  },
  {
    "id": "R10",
    "subject": "reserve 49 below 50 blocked",
    "patch": {
      "allocatedReserveUsd": 49
    },
    "path": "hard",
    "expected": "FR034_FUTURE_RESERVE",
    "contains": true
  },
  {
    "id": "R11",
    "subject": "reserve 50 sufficient",
    "patch": {
      "allocatedReserveUsd": 50
    },
    "path": "status",
    "expected": "LOCAL_POLICY_PASS_NOT_READY",
    "contains": false
  },
  {
    "id": "R12",
    "subject": "four exchange position slots",
    "patch": {
      "positions": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "side": "Short",
          "qty": 2,
          "mark": 100
        },
        {
          "account": "A",
          "symbol": "BBBUSDT",
          "slot": 0,
          "side": "Long",
          "qty": 1,
          "mark": 10
        },
        {
          "account": "A",
          "symbol": "CCCUSDT",
          "slot": 0,
          "side": "Long",
          "qty": 1,
          "mark": 10
        },
        {
          "account": "A",
          "symbol": "DDDUSDT",
          "slot": 0,
          "side": "Long",
          "qty": 1,
          "mark": 10
        }
      ]
    },
    "path": "hard",
    "expected": "FR033_POSITION_COUNT_3",
    "contains": true
  },
  {
    "id": "R13",
    "subject": "missing actual form",
    "patch": {
      "evidence": {
        "p02": false
      }
    },
    "path": "missing",
    "expected": "MISSING_P02",
    "contains": true
  },
  {
    "id": "R14",
    "subject": "missing full T02",
    "patch": {
      "evidence": {
        "t02": false
      }
    },
    "path": "missing",
    "expected": "MISSING_T02",
    "contains": true
  },
  {
    "id": "R15",
    "subject": "missing Mark",
    "patch": {
      "evidence": {
        "mark": false
      }
    },
    "path": "missing",
    "expected": "MISSING_MARK",
    "contains": true
  },
  {
    "id": "R16",
    "subject": "T02 >5 minutes",
    "patch": {
      "ageT02Min": 6
    },
    "path": "missing",
    "expected": "STALE_T02_MARK_OR_EVENT",
    "contains": true
  },
  {
    "id": "R17",
    "subject": "Mark >2 minutes",
    "patch": {
      "ageMarkMin": 2.0166666666666666
    },
    "path": "missing",
    "expected": "STALE_T02_MARK_OR_EVENT",
    "contains": true
  },
  {
    "id": "R18",
    "subject": "event invalidates fresh snapshot",
    "patch": {
      "eventSinceSnapshot": true
    },
    "path": "missing",
    "expected": "STALE_T02_MARK_OR_EVENT",
    "contains": true
  },
  {
    "id": "R19",
    "subject": "instrument unavailable",
    "patch": {
      "evidence": {
        "instrument": false
      }
    },
    "path": "missing",
    "expected": "MISSING_INSTRUMENT",
    "contains": true
  },
  {
    "id": "R20",
    "subject": "FX needed between quote and equity",
    "patch": {
      "fxUsdPerQuote": null
    },
    "path": "missing",
    "expected": "FX_UNIT_UNVERIFIED",
    "contains": true
  },
  {
    "id": "R21",
    "subject": "H04 alone blocks",
    "patch": {
      "h04": true,
      "evidence": {
        "p02": false
      }
    },
    "path": "status",
    "expected": "REJECTED",
    "contains": false
  },
  {
    "id": "R22",
    "subject": "documented incompatible mode",
    "patch": {
      "incompatible": true
    },
    "path": "status",
    "expected": "REJECTED",
    "contains": false
  },
  {
    "id": "R23",
    "subject": "conflict means unverifiable",
    "patch": {
      "conflict": true
    },
    "path": "status",
    "expected": "UNVERIFIED",
    "contains": false
  },
  {
    "id": "R24",
    "subject": "ownership unknown",
    "patch": {
      "evidence": {
        "ownership": false
      }
    },
    "path": "unverified",
    "expected": "OWNERSHIP_NOT_CONFIRMED",
    "contains": true
  },
  {
    "id": "R25",
    "subject": "Cross not provable",
    "patch": {
      "evidence": {
        "cross": false
      }
    },
    "path": "unverified",
    "expected": "RV02_CROSS_UNVERIFIED",
    "contains": true
  },
  {
    "id": "R26",
    "subject": "Short upper bound unknown",
    "patch": {
      "evidence": {
        "shortBound": false
      }
    },
    "path": "unverified",
    "expected": "RV03_SHORT_BOUND_UNVERIFIED",
    "contains": true
  },
  {
    "id": "R27",
    "subject": "liq buffer unverifiable",
    "patch": {
      "evidence": {
        "liqDistance": false
      }
    },
    "path": "unverified",
    "expected": "FR032_LIQ_DISTANCE_UNVERIFIED",
    "contains": true
  },
  {
    "id": "R28",
    "subject": "liq buffer 14% rejected",
    "patch": {
      "liqDistance": 0.14
    },
    "path": "hard",
    "expected": "FR032_LIQ_DISTANCE_15_PERCENT",
    "contains": true
  },
  {
    "id": "R29",
    "subject": "liq buffer 15% accepted arithmetically",
    "patch": {
      "liqDistance": 0.15
    },
    "path": "status",
    "expected": "LOCAL_POLICY_PASS_NOT_READY",
    "contains": false
  },
  {
    "id": "R30",
    "subject": "future cycles unbounded",
    "patch": {
      "evidence": {
        "finiteGrid": false
      }
    },
    "path": "unverified",
    "expected": "FUTURE_REENTRY_NOT_BOUNDED",
    "contains": true
  },
  {
    "id": "R31",
    "subject": "4 stress groups mandatory",
    "patch": {
      "stresses": [
        {
          "name": "S1_ADVERSE_UP",
          "marks": {
            "AAAUSDT": 104
          },
          "fillIds": [],
          "extraCostsUsd": 3,
          "mmr": 0.2
        },
        {
          "name": "S2_ALL_IN",
          "marks": {
            "AAAUSDT": 110
          },
          "fillIds": [
            "i1",
            "i2"
          ],
          "extraCostsUsd": 3,
          "mmr": 0.4
        },
        {
          "name": "S3_GAP",
          "marks": {
            "AAAUSDT": 112
          },
          "fillIds": [],
          "extraCostsUsd": 5,
          "mmr": 0.5
        }
      ]
    },
    "path": "missing",
    "expected": "FOUR_STRESSES_REQUIRED",
    "contains": true
  },
  {
    "id": "R32",
    "subject": "scenario lacks mark",
    "patch": {
      "stresses": [
        {
          "name": "S1_ADVERSE_UP",
          "marks": {
            "AAAUSDT": 104
          },
          "fillIds": [],
          "extraCostsUsd": 3,
          "mmr": 0.2
        },
        {
          "name": "S2_ALL_IN",
          "marks": {
            "AAAUSDT": 110
          },
          "fillIds": [
            "i1",
            "i2"
          ],
          "extraCostsUsd": 3,
          "mmr": 0.4
        },
        {
          "name": "S3_GAP",
          "marks": {
            "AAAUSDT": 112
          },
          "fillIds": [],
          "extraCostsUsd": 5,
          "mmr": 0.5
        },
        {
          "name": "S4_OTHER_COSTS",
          "marks": {},
          "fillIds": [
            "i1"
          ],
          "extraCostsUsd": 7,
          "mmr": 0.31
        }
      ]
    },
    "path": "missing",
    "expected": "STRESS_MARK_MISSING",
    "contains": true
  },
  {
    "id": "R33",
    "subject": "MMR not supplied",
    "patch": {
      "stresses": [
        {
          "name": "S1_ADVERSE_UP",
          "marks": {
            "AAAUSDT": 104
          },
          "fillIds": [],
          "extraCostsUsd": 3,
          "mmr": 0.2
        },
        {
          "name": "S2_ALL_IN",
          "marks": {
            "AAAUSDT": 110
          },
          "fillIds": [
            "i1",
            "i2"
          ],
          "extraCostsUsd": 3
        },
        {
          "name": "S3_GAP",
          "marks": {
            "AAAUSDT": 112
          },
          "fillIds": [],
          "extraCostsUsd": 5,
          "mmr": 0.5
        },
        {
          "name": "S4_OTHER_COSTS",
          "marks": {
            "AAAUSDT": 105
          },
          "fillIds": [
            "i1"
          ],
          "extraCostsUsd": 7,
          "mmr": 0.31
        }
      ]
    },
    "path": "unverified",
    "expected": "ACCOUNT_MMR_UNKNOWN:S2_ALL_IN",
    "contains": true
  },
  {
    "id": "R34",
    "subject": "MMR stress reaches 100%",
    "patch": {
      "stresses": [
        {
          "name": "S1_ADVERSE_UP",
          "marks": {
            "AAAUSDT": 104
          },
          "fillIds": [],
          "extraCostsUsd": 3,
          "mmr": 0.2
        },
        {
          "name": "S2_ALL_IN",
          "marks": {
            "AAAUSDT": 110
          },
          "fillIds": [
            "i1",
            "i2"
          ],
          "extraCostsUsd": 3,
          "mmr": 1
        },
        {
          "name": "S3_GAP",
          "marks": {
            "AAAUSDT": 112
          },
          "fillIds": [],
          "extraCostsUsd": 5,
          "mmr": 0.5
        },
        {
          "name": "S4_OTHER_COSTS",
          "marks": {
            "AAAUSDT": 105
          },
          "fillIds": [
            "i1"
          ],
          "extraCostsUsd": 7,
          "mmr": 0.31
        }
      ]
    },
    "path": "hard",
    "expected": "ACCOUNT_MMR_100_PERCENT:S2_ALL_IN",
    "contains": true
  },
  {
    "id": "R35",
    "subject": "stop gap pushes loss >5%",
    "patch": {
      "stresses": [
        {
          "name": "S1_ADVERSE_UP",
          "marks": {
            "AAAUSDT": 104
          },
          "fillIds": [],
          "extraCostsUsd": 3,
          "mmr": 0.2
        },
        {
          "name": "S2_ALL_IN",
          "marks": {
            "AAAUSDT": 110
          },
          "fillIds": [
            "i1",
            "i2"
          ],
          "extraCostsUsd": 3,
          "mmr": 0.4
        },
        {
          "name": "S3_GAP",
          "marks": {
            "AAAUSDT": 128
          },
          "fillIds": [],
          "extraCostsUsd": 5,
          "mmr": 0.5
        },
        {
          "name": "S4_OTHER_COSTS",
          "marks": {
            "AAAUSDT": 105
          },
          "fillIds": [
            "i1"
          ],
          "extraCostsUsd": 7,
          "mmr": 0.31
        }
      ]
    },
    "path": "hard",
    "expected": "FR030_BOT_LOSS:S3_GAP",
    "contains": true
  },
  {
    "id": "R36",
    "subject": "all fills push loss >5%",
    "patch": {
      "stresses": [
        {
          "name": "S1_ADVERSE_UP",
          "marks": {
            "AAAUSDT": 104
          },
          "fillIds": [],
          "extraCostsUsd": 3,
          "mmr": 0.2
        },
        {
          "name": "S2_ALL_IN",
          "marks": {
            "AAAUSDT": 130
          },
          "fillIds": [
            "i1",
            "i2"
          ],
          "extraCostsUsd": 3,
          "mmr": 0.4
        },
        {
          "name": "S3_GAP",
          "marks": {
            "AAAUSDT": 112
          },
          "fillIds": [],
          "extraCostsUsd": 5,
          "mmr": 0.5
        },
        {
          "name": "S4_OTHER_COSTS",
          "marks": {
            "AAAUSDT": 105
          },
          "fillIds": [
            "i1"
          ],
          "extraCostsUsd": 7,
          "mmr": 0.31
        }
      ]
    },
    "path": "hard",
    "expected": "FR030_BOT_LOSS:S2_ALL_IN",
    "contains": true
  },
  {
    "id": "R37",
    "subject": "less baseline short qty",
    "patch": {
      "positions": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "side": "Short",
          "qty": 1,
          "mark": 100
        }
      ]
    },
    "path": "status",
    "expected": "LOCAL_POLICY_PASS_NOT_READY",
    "contains": false
  },
  {
    "id": "R38",
    "subject": "confirmed cancellation reduces reserve",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "CANCELLED_CONFIRMED",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "trace.requiredReserveUsd",
    "expected": 30,
    "contains": false
  },
  {
    "id": "R39",
    "subject": "confirmed cancellation removes incremental IM",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "CANCELLED_CONFIRMED",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "trace.projectedMarginUsd",
    "expected": 110,
    "contains": false
  },
  {
    "id": "R40",
    "subject": "conditional order still requires reserve",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "CONDITIONAL",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "trace.requiredReserveUsd",
    "expected": 50,
    "contains": false
  },
  {
    "id": "R41",
    "subject": "active IN already accounted in base IM",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        }
      ]
    },
    "path": "trace.projectedMarginUsd",
    "expected": 110,
    "contains": false
  },
  {
    "id": "R42",
    "subject": "extra future level adds forecast margin",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i3",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 10,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "trace.projectedMarginUsd",
    "expected": 140,
    "contains": false
  },
  {
    "id": "R43",
    "subject": "duplicate exchange order no extra IM",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "trace.projectedMarginUsd",
    "expected": 130,
    "contains": false
  },
  {
    "id": "R44",
    "subject": "duplicate exchange order no extra reserve",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "trace.requiredReserveUsd",
    "expected": 50,
    "contains": false
  },
  {
    "id": "R45",
    "subject": "two IDs same price must remain separate",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i3",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "trace.uniqueOrders",
    "expected": 3,
    "contains": false
  },
  {
    "id": "R46",
    "subject": "unknown order ID unverified",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": null,
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "unverified",
    "expected": "ORDER_ID_UNKNOWN",
    "contains": true
  },
  {
    "id": "R47",
    "subject": "same order ID conflicting qty unverified",
    "patch": {
      "orders": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i1",
          "side": "Short",
          "qty": 1,
          "price": 110,
          "imUsd": 20,
          "state": "ACTIVE",
          "accountedInBaseIm": true
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 1,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "id": "i2",
          "side": "Short",
          "qty": 3,
          "price": 120,
          "imUsd": 20,
          "state": "VIRTUAL",
          "accountedInBaseIm": false
        }
      ]
    },
    "path": "unverified",
    "expected": "ORDER_ID_CONFLICT",
    "contains": true
  },
  {
    "id": "R48",
    "subject": "repeated position slot is not double count",
    "patch": {
      "positions": [
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "side": "Short",
          "qty": 2,
          "mark": 100
        },
        {
          "account": "A",
          "symbol": "AAAUSDT",
          "slot": 2,
          "side": "Short",
          "qty": 2,
          "mark": 100
        }
      ]
    },
    "path": "unverified",
    "expected": "POSITION_SLOT_DUPLICATED",
    "contains": true
  },
  {
    "id": "R49",
    "subject": "hard leverage wins over missing FX",
    "patch": {
      "leverage": 6,
      "fxUsdPerQuote": null
    },
    "path": "status",
    "expected": "REJECTED",
    "contains": false
  },
  {
    "id": "R50",
    "subject": "Cross unknown outranks missing P02",
    "patch": {
      "evidence": {
        "cross": false,
        "p02": false
      }
    },
    "path": "status",
    "expected": "UNVERIFIED",
    "contains": false
  },
  {
    "id": "R51",
    "subject": "missing P02 only needs data",
    "patch": {
      "evidence": {
        "p02": false
      }
    },
    "path": "status",
    "expected": "NEEDS_DATA",
    "contains": false
  },
  {
    "id": "R52",
    "subject": "H04 wins over unknown Short bound",
    "patch": {
      "h04": true,
      "evidence": {
        "shortBound": false
      }
    },
    "path": "status",
    "expected": "REJECTED",
    "contains": false
  },
  {
    "id": "R53",
    "subject": "adverse S1 losses include costs",
    "patch": {},
    "path": "trace.stresses.0.lossUsd",
    "expected": 11,
    "contains": false
  },
  {
    "id": "R54",
    "subject": "all fills favorable relative 120 level",
    "patch": {},
    "path": "trace.stresses.1.lossUsd",
    "expected": 13,
    "contains": false
  },
  {
    "id": "R55",
    "subject": "gap shock S3 loss",
    "patch": {},
    "path": "trace.stresses.2.lossUsd",
    "expected": 29,
    "contains": false
  },
  {
    "id": "R56",
    "subject": "max loss from 4 scenarios",
    "patch": {},
    "path": "trace.maxStressLossUsd",
    "expected": 29,
    "contains": false
  },
  {
    "id": "R57",
    "subject": "exact 5pct stress bound no > violation",
    "patch": {
      "stresses": [
        {
          "name": "S1_ADVERSE_UP",
          "marks": {
            "AAAUSDT": 104
          },
          "fillIds": [],
          "extraCostsUsd": 3,
          "mmr": 0.2
        },
        {
          "name": "S2_ALL_IN",
          "marks": {
            "AAAUSDT": 110
          },
          "fillIds": [
            "i1",
            "i2"
          ],
          "extraCostsUsd": 3,
          "mmr": 0.4
        },
        {
          "name": "S3_GAP",
          "marks": {
            "AAAUSDT": 122.5
          },
          "fillIds": [],
          "extraCostsUsd": 5,
          "mmr": 0.5
        },
        {
          "name": "S4_OTHER_COSTS",
          "marks": {
            "AAAUSDT": 105
          },
          "fillIds": [
            "i1"
          ],
          "extraCostsUsd": 7,
          "mmr": 0.31
        }
      ]
    },
    "path": "status",
    "expected": "LOCAL_POLICY_PASS_NOT_READY",
    "contains": false
  }
];

// Added at step 06.8 after independent regression review of the source.
const regressionCases=[
 {id:"R58",subject:"filled order is not future reserve",patch:{orders:[{...base.orders[0],state:"FILLED"}]},path:"trace.requiredReserveUsd",expected:10,contains:false},
 {id:"R59",subject:"filled order not incremental IM",patch:{orders:[{...base.orders[1],state:"FILLED"}]},path:"trace.projectedMarginUsd",expected:110,contains:false},
 {id:"R60",subject:"three new future symbols plus one present slot exceeds FR033",patch:{orders:[...base.orders,...["BBB","CCC","DDD"].map((x,i)=>({...base.orders[1],symbol:x+"USDT",id:"more"+i}))]},path:"hard",expected:"FR033_POSITION_COUNT_3",contains:true},
 {id:"R61",subject:"future new symbol is projected",patch:{orders:[...base.orders,{...base.orders[1],symbol:"BBBUSDT",id:"new1"}]},path:"trace.projectedPositionSlots",expected:2,contains:false},
 {id:"R62",subject:"undefined order id reported unverified",patch:{orders:[...base.orders,{...base.orders[1],id:undefined}]},path:"unverified",expected:"ORDER_ID_UNKNOWN",contains:true},
 {id:"R63",subject:"OUT cannot count as new position",patch:{orders:[...base.orders,{...base.orders[1],symbol:"BBBUSDT",id:"out1",purpose:"OUT"}]},path:"trace.projectedPositionSlots",expected:1,contains:false},
 {id:"R64",subject:"unknown order purpose is unverified",patch:{orders:[...base.orders,{...base.orders[1],id:"unknown1",purpose:undefined}]},path:"unverified",expected:"UNKNOWN_ORDER_PURPOSE",contains:true}
];
cases.push(...regressionCases);

const results = cases.map(x=>testOne(base,x));
const failures = results.filter(x=>!x.passed);
for(const f of failures) console.error("FAIL",f.id,f.subject,JSON.stringify({expected:f.expected,actual:f.actual}));
console.log(JSON.stringify({kind:"SYNTHETIC_LOCAL_ONLY",total:results.length,passed:results.length-failures.length,failed:failures.length,realReady:false},null,2));
if(failures.length) process.exitCode=1;
