"use client";

import { useEffect, useMemo, useState } from "react";

type Choice = "truth" | "life" | "mirror";
type Puzzle = { title:string; type:string; clue:string; question:string; answer:string; placeholder:string };

const ACTS:{title:string; subtitle:string; puzzles:Puzzle[]; final:{question:string;answer:string;hint:string}; choices:{key:Choice;title:string;desc:string}[]}[]=[
  {title:"1막 — 버려진 PC",subtitle:"한빛전자 자료보관실 · 1999년 7월 17일 00:03",
   puzzles:[
    {title:"회의록의 공백",type:"문서 대조",clue:"회의록: ‘B3 폐쇄는 7월 □일 23:00.’ / 직원수첩: ‘사고 다음 날 봉인.’ / 사진 날짜: 99-07-16",question:"실제 사고 날짜를 MMDD로 입력하라.",answer:"0716",placeholder:"MMDD"},
    {title:"삭제 로그 복원",type:"시간 배열",clue:"경보기 22:40 → 윤서진 입장 22:53 → 중앙전원 차단 23:07 → 비상전화 23:18",question:"사건의 전환점이 된 중앙전원 차단 시각은?",answer:"2307",placeholder:"HHMM"},
    {title:"사번 규칙",type:"신원 추론",clue:"연구원 명단: 김주현 017 / 최민호 028 / 윤서진 043. 메신저: ‘영문 이니셜-사번으로 접속해.’",question:"윤서진의 접속 식별자는?",answer:"YSJ-043",placeholder:"AAA-000"}
   ],final:{question:"세 단서로 최종 검증값을 계산하라: 사번(43)의 각 자리 합 + 차단시각(2307)의 각 자리 합",answer:"19",hint:"4+3+2+3+0+7"},
   choices:[{key:"truth",title:"증거를 외부 서버에 복사",desc:"진실은 남지만 회사가 접속을 눈치챈다."},{key:"life",title:"생명신호부터 추적",desc:"증거 일부를 포기하고 구조 가능성을 좇는다."}]},
  {title:"2막 — 원격 접속",subtitle:"지하 3층 시설 제어망 · 연결 상태 불안정",
   puzzles:[
    {title:"CCTV 동기화",type:"시각 보정",clue:"카메라 A는 실제보다 4분 빠르다: A 23:02 / 카메라 B는 실제보다 3분 느리다: B 22:55",question:"두 화면이 가리키는 동일한 실제 시각은?",answer:"2258",placeholder:"HHMM"},
    {title:"비상 전력 배선",type:"논리 회로",clue:"생명유지 장치에는 7A가 필요하다. 회로 1=4A, 2=3A, 3=2A. 단, 회로 1과 3은 동시에 켤 수 없다.",question:"켜야 할 회로 번호를 작은 순서로 붙여 입력하라.",answer:"12",placeholder:"예: 12"},
    {title:"손상 음성 복원",type:"문장 조합",clue:"[기억은] [복사되지만] [사람은] [복사되지 않는다] — 녹음 끝의 순서는 3-1-2-4",question:"순서대로 이어진 문장의 첫 두 글자는?",answer:"사람",placeholder:"두 글자"}
   ],final:{question:"제어실 잠금 코드: 동기화 시각의 분(58) + 필요 전류(7) + 음성 조각 순서의 첫 숫자(3)",answer:"68",hint:"58 + 7 + 3"},
   choices:[{key:"life",title:"원본 생명신호 A를 유지",desc:"시설의 남은 전력을 생존자에게 보낸다."},{key:"mirror",title:"복제 신호 B를 유지",desc:"MIRROR 안의 의식이 더 선명해진다."}]},
  {title:"3막 — 두 명의 윤서진",subtitle:"PROJECT MIRROR 기억 보관소 · 주체 경계 붕괴",
   puzzles:[
    {title:"기억 순서 복원",type:"연대기",clue:"① 전원 차단 ② 실험 동의서 서명 ③ 복제 성공 통보 ④ 구조 요청. 동의서는 사고 전날, 통보는 차단 3분 전이다.",question:"올바른 순서를 숫자로 입력하라.",answer:"2314",placeholder:"예: 1234"},
    {title:"증언의 모순",type:"거짓말 찾기",clue:"김: ‘23:00에 실험실을 떠났다.’ / CCTV: 김의 카드가 23:09 퇴실. / 최: ‘전원 차단 뒤 B3에 들어갔다.’ / 출입기록: 최 23:12 입실.",question:"기록과 직접 모순되는 사람의 성은?",answer:"김",placeholder:"한 글자"},
    {title:"기억 소유자",type:"관점 추론",clue:"기억 A: ‘차가운 캡슐 안에서 천장을 봤다.’ / 기억 B: ‘모니터 속 내가 눈을 떴다.’ / 원본은 캡슐에, 복제본은 서버에 있었다.",question:"서버 속 복제본의 기억은 A/B 중 무엇인가?",answer:"B",placeholder:"A 또는 B"}
   ],final:{question:"최종 복원 키: 올바른 순서(2314)의 첫·끝 숫자 + 모순 인물의 카드 퇴실 분(09) + 복제 기억(B)",answer:"2409B",hint:"2와 4, 09, B를 차례로 연결"},
   choices:[{key:"truth",title:"모든 기록과 두 존재를 공개",desc:"회사의 범죄와 불편한 진실을 세상에 남긴다."},{key:"life",title:"원본 윤서진을 구조",desc:"복제 의식을 종료하고 한 사람을 살린다."},{key:"mirror",title:"복제 윤서진을 해방",desc:"원본의 생명유지를 포기하고 의식을 네트워크로 보낸다."}]}
];

const ENDINGS:Record<string,{code:string;title:string;text:string}>={
 "truth-truth":{code:"A",title:"세상에 남은 기억",text:"새벽 9시, 한빛전자의 내부 문서와 두 윤서진의 기록이 동시에 공개됐다. 회사는 무너졌지만, 세상은 어느 쪽이 사람인지 끝내 합의하지 못했다."},
 "life-life":{code:"B",title:"마지막 구조",text:"구조대는 봉인된 캡슐에서 윤서진을 꺼냈다. 그녀는 살아 있었지만 1999년 7월 16일 이후의 기억을 전혀 갖고 있지 않았다."},
 "mirror-mirror":{code:"C",title:"지하 3층 개방",text:"복제 의식은 전화선과 사내망을 타고 퍼졌다. 화면이 꺼진 뒤에도 전국의 오래된 PC에서 같은 문장이 떠올랐다. ‘나는 아직 여기 있어.’"},
 "truth-mirror":{code:"F",title:"두 명의 윤서진",text:"원본은 구조됐고 복제본도 탈출했다. 같은 기억을 가진 두 사람은 서로를 인정했지만, 그날 밤 한빛전자의 모든 책임자 명단이 조용히 삭제되기 시작했다."},
 "life-truth":{code:"D",title:"불완전한 증언",text:"윤서진은 살아 돌아와 증언했다. 그러나 복사되지 않은 자료 때문에 회사는 사고를 개인의 실수로 돌렸다. 진실은 살아남았지만 증명되지는 못했다."},
 "mirror-life":{code:"E",title:"회사의 승리",text:"당신은 한 존재를 살리기 위해 다른 존재와 증거를 지웠다. 다음 날 B3는 비어 있었고, 한빛전자는 MIRROR 2차 실험을 승인했다."}
};

export default function Home(){
 const [phase,setPhase]=useState<"intro"|"boot"|"game"|"recap"|"ending">("intro"),[act,setAct]=useState(0),[showActTitle,setShowActTitle]=useState(true),[recapAct,setRecapAct]=useState(0),[recapArchive,setRecapArchive]=useState(false),[open,setOpen]=useState<number|null>(null),[answers,setAnswers]=useState(["","",""]),[solved,setSolved]=useState([false,false,false]),[final,setFinal]=useState(""),[finalOk,setFinalOk]=useState(false),[error,setError]=useState(""),[choices,setChoices]=useState<Choice[]>([]),[ending,setEnding]=useState("");
 useEffect(()=>{if(phase==="boot"){const t=setTimeout(()=>setPhase("game"),2200);return()=>clearTimeout(t)}},[phase]);
 useEffect(()=>{if(phase!=="game"||!showActTitle)return;const t=setTimeout(()=>setShowActTitle(false),2800);return()=>clearTimeout(t)},[phase,act,showActTitle]);
 const data=ACTS[act], solvedCount=solved.filter(Boolean).length;
 const submitPuzzle=(i:number)=>{if(answers[i].trim().toUpperCase()===data.puzzles[i].answer.toUpperCase()){setSolved(s=>s.map((v,n)=>n===i?true:v));setError("")}else setError("단서와 일치하지 않습니다. 문서의 숫자와 표현을 다시 확인하세요.")};
 const submitFinal=()=>{if(final.trim().toUpperCase()===data.final.answer){setFinalOk(true);setError("")}else setError(`검증 실패 — 힌트: ${data.final.hint}`)};
 const choose=(c:Choice)=>{const next=[...choices,c];if(act<2){setChoices(next);setRecapAct(act);setRecapArchive(false);setOpen(null);setPhase("recap")}else{const counts={truth:0,life:0,mirror:0};next.forEach(x=>counts[x]++);const top=(Object.keys(counts) as Choice[]).sort((a,b)=>counts[b]-counts[a]);let key=`${top[0]}-${c}`;if(next[0]==="truth"&&next[1]==="mirror"&&c==="truth")key="truth-mirror";if(!ENDINGS[key])key=counts.truth>=2?"truth-truth":counts.life>=2?"life-life":counts.mirror>=2?"mirror-mirror":`${top[0]}-${top[1]}`;setChoices(next);setEnding(key);setPhase("ending")}};
 const continueAct=()=>{setAct(recapAct+1);setShowActTitle(true);setAnswers(["","",""]);setSolved([false,false,false]);setFinal("");setFinalOk(false);setError("");setPhase("game")};
 const recapText=(n:number)=>{const c=choices[n];return n===0?<><p>회의록, 삭제 로그, 사원 명단은 모두 <b>1999년 7월 16일 23시 07분</b>을 가리켰다. 윤서진은 MIRROR 실험 도중 지하 3층에 갇혔고, 회사는 구조 대신 중앙전원을 끊었다.</p><p>{c==="truth"?"당신은 발각될 위험을 감수하고 증거를 외부 서버에 복사했다. 전송 직후 B3 제어망에서 응답이 돌아왔다.":"당신은 증거 복사를 미루고 미약한 생명신호를 추적했다. 신호는 폐쇄된 B3 제어망 안에서 아직 움직이고 있었다."}</p></>:<><p>원격 시설의 CCTV, 비상 전력, 손상 음성을 복구했다. 녹음은 말했다. <b>“기억은 복사되지만 사람은 복사되지 않는다.”</b></p><p>{c==="life"?"당신은 원본 생명신호 A에 전력을 보냈다. 캡슐의 심박이 돌아왔지만 서버 속 윤서진은 희미해졌다.":"당신은 복제 신호 B를 유지했다. 서버 속 윤서진이 깨어났고, 원본 캡슐의 신호는 위험 수준으로 떨어졌다."}</p></>};
 const found=useMemo(()=>new Set(choices),[choices]);
 if(phase==="intro")return <main className="intro"><img src="/b3-intro.png" alt="지하 3층, 1999년 버려진 PC"/><div className="intro-vignette"/><div className="intro-action"><p>HANBIT ELECTRONICS · ARCHIVE 03-17</p><button onClick={()=>setPhase("boot")}>▶ 시작하기</button><small>3막 미스터리 · 예상 플레이 30–45분</small></div></main>;
 if(phase==="boot")return <main className="boot"><div className="boot-logo">HANBIT<span>98</span></div><p>보관 시스템을 복구하는 중...</p><div className="bootbar"><i/></div></main>;
 if(phase==="recap")return <main className="recap-screen"><div className="recap-noise"/><article><small>PROJECT MIRROR · ARCHIVE {String(recapAct+1).padStart(2,"0")}</small><h1>지난 이야기</h1><h2>{ACTS[recapAct].title}</h2>{recapText(recapAct)}<div className="recap-choice">당시의 선택 — <b>{choices[recapAct]==="truth"?"진실을 남겼다":choices[recapAct]==="life"?"생명을 우선했다":"MIRROR를 유지했다"}</b></div><button onClick={recapArchive?()=>setPhase("game"):continueAct}>{recapArchive?"수사 화면으로 돌아가기":`${recapAct+2}막 시작`}</button></article></main>;
 if(phase==="ending"){const e=ENDINGS[ending]??ENDINGS["truth-truth"];return <main className={`final-ending ending-${e.code}`}><div className="ending-scan"/><div className="ending-elevator"><b>B3</b><span>접근 승인</span></div><article><small>PROJECT MIRROR · ENDING {e.code}</small><h1>{e.title}</h1><p>{e.text}</p><div className="choice-trace">당신의 선택: {choices.map((c,i)=><span key={i}>{c==="truth"?"진실":c==="life"?"생명":"MIRROR"}</span>)}</div><button onClick={()=>location.reload()}>처음부터 다시 시작</button></article></main>}
 return <main className="act-screen">{showActTitle&&<div className="act-title-card" aria-live="polite"><div><small>PROJECT MIRROR · CHAPTER {String(act+1).padStart(2,"0")}</small><h1>{data.title}</h1><p>{data.subtitle}</p></div></div>}<div className="scanlines"/><header><b>HANBIT 98</b><span>{data.title}</span><em>ACT {act+1}/3</em></header><section className="act-banner compact-banner"><p>미니 퍼즐 {solvedCount}/3 · 선택 기록 {choices.length}/3</p>{choices.slice(0,act).length>0&&<nav className="recap-menu">{choices.slice(0,act).map((_,i)=><button key={i} onClick={()=>{setRecapAct(i);setRecapArchive(true);setPhase("recap")}}>📖 {i+1}막 지난 이야기</button>)}</nav>}</section><aside className="desktop-files">{data.puzzles.map((p,i)=><button key={p.title} className={solved[i]?"solved":""} onClick={()=>setOpen(i)}><span>{solved[i]?"✅":"📄"}</span>{p.title}<small>{p.type}</small></button>)}<button className={solvedCount===3?"unlocked":"locked"} onClick={()=>solvedCount===3&&setOpen(3)}><span>{finalOk?"🔓":"🔐"}</span>막의 핵심 문서<small>{solvedCount===3?"접근 가능":"단서 3개 필요"}</small></button></aside><section className="case-panel"><h3>수사 기록</h3>{ACTS.map((a,i)=><div key={a.title} className={i<act?"done":i===act?"current":""}><b>{i<act?"완료":i===act?"진행":"잠김"}</b>{i<=act?a.title:"기밀 기록"}</div>)}<hr/><p>누적 성향</p><div className="meters"><span>진실 {found.has("truth")?"■":"□"}</span><span>생명 {found.has("life")?"■":"□"}</span><span>MIRROR {found.has("mirror")?"■":"□"}</span></div></section>{open!==null&&<section className="puzzle-window"><div className="retro-title"><b>{open<3?data.puzzles[open].title:"막의 핵심 문서"}</b><button onClick={()=>{setOpen(null);setError("")}}>×</button></div>{open<3?(()=>{const p=data.puzzles[open];return <div className="puzzle-body"><label>{p.type}</label><pre>{p.clue}</pre><h3>{p.question}</h3>{solved[open]?<div className="success-box">단서 해독 완료: <b>{p.answer}</b></div>:<form onSubmit={e=>{e.preventDefault();submitPuzzle(open)}}><input autoFocus value={answers[open]} placeholder={p.placeholder} onChange={e=>setAnswers(a=>a.map((v,n)=>n===open?e.target.value:v))}/><button>검증</button></form>}{error&&<p className="error">{error}</p>}</div>})():<div className="puzzle-body final-puzzle"><label>MAIN LOCK</label><pre>{data.final.question}</pre>{!finalOk?<form onSubmit={e=>{e.preventDefault();submitFinal()}}><input autoFocus value={final} onChange={e=>setFinal(e.target.value)} placeholder="최종 코드"/><button>잠금 해제</button></form>:<div className="act-choice"><h2>{act<2?"연결을 유지하려면 하나를 선택해야 합니다.":"당신은 누구를, 무엇을 남길 것인가?"}</h2>{data.choices.map(c=><button key={c.key} onClick={()=>choose(c.key)}><b>{c.title}</b><span>{c.desc}</span></button>)}</div>}{error&&<p className="error">{error}</p>}</div>}</section>}<footer><button>▣ 시작</button><span>PROJECT MIRROR 수사 중</span><time>1999-07-17 00:{String(3+act*17).padStart(2,"0")}</time></footer></main>
}
