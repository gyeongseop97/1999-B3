"use client";

import { useEffect, useRef, useState } from "react";

type AppId = "computer" | "mail" | "chat" | "photos" | "secret" | "trash" | "case" | "ending";
type Pos = { x: number; y: number };

const apps: { id: AppId; label: string; icon: string }[] = [
  { id: "computer", label: "내 컴퓨터", icon: "🖥️" }, { id: "mail", label: "메일", icon: "✉️" },
  { id: "chat", label: "사내메신저", icon: "💬" }, { id: "photos", label: "사진", icon: "🖼️" },
  { id: "secret", label: "기밀자료", icon: "🔒" }, { id: "trash", label: "휴지통", icon: "🗑️" },
];

const titles: Record<AppId, string> = { computer: "내 컴퓨터", mail: "한빛전자 메일", chat: "HanTalk 2.1", photos: "사진", secret: "기밀자료", trash: "휴지통", case: "사건 기록", ending: "PROJECT B3 — 진실" };

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [open, setOpen] = useState<AppId[]>([]);
  const [minimized, setMinimized] = useState<AppId[]>([]);
  const [active, setActive] = useState<AppId | null>(null);
  const [positions, setPositions] = useState<Partial<Record<AppId, Pos>>>({});
  const [startOpen, setStartOpen] = useState(false);
  const [readMinutes, setReadMinutes] = useState(false);
  const [readMail, setReadMail] = useState(false);
  const [restored, setRestored] = useState(false);
  const [readRecovered, setReadRecovered] = useState(false);
  const [readChat, setReadChat] = useState(false);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [ended, setEnded] = useState(false);
  const [clock, setClock] = useState("");
  const drag = useRef<{ id: AppId; dx: number; dy: number } | null>(null);

  useEffect(() => { const t = setTimeout(() => setBooted(true), 1700); return () => clearTimeout(t); }, []);
  useEffect(() => { const tick = () => setClock(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })); tick(); const t = setInterval(tick, 30000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const move = (e: MouseEvent) => { if (!drag.current) return; setPositions(p => ({ ...p, [drag.current!.id]: { x: Math.max(0, e.clientX - drag.current!.dx), y: Math.max(0, e.clientY - drag.current!.dy) } })); };
    const up = () => { drag.current = null; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  const launch = (id: AppId) => { if (id === "chat") setReadChat(true); setOpen(o => o.includes(id) ? o : [...o, id]); setMinimized(m => m.filter(x => x !== id)); setActive(id); setStartOpen(false); };
  const close = (id: AppId) => { setOpen(o => o.filter(x => x !== id)); setMinimized(m => m.filter(x => x !== id)); setActive(a => a === id ? null : a); };
  const minimize = (id: AppId) => { setMinimized(m => [...m, id]); setActive(null); };
  const beginDrag = (e: React.MouseEvent, id: AppId) => { const el = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect(); drag.current = { id, dx: e.clientX - el.left, dy: e.clientY - el.top }; setActive(id); };
  const progress = [readMinutes, readMail, restored && readRecovered, readChat, unlocked, ended];

  const content = (id: AppId) => {
    if (id === "computer") return <div className="explorer"><aside><b>폴더</b><span>▾ 내 컴퓨터</span><span>　▸ C:</span></aside><main><div className="path">C:\업무\1999</div><button className="file" onDoubleClick={() => setReadMinutes(true)} onClick={() => setReadMinutes(true)}><span>📄</span> B3_회의록.txt</button><button className="file"><span>📊</span> 재고현황.xls</button>{restored && <button className="file" onClick={() => setReadRecovered(true)}><span>📄</span> 경비일지_복구.txt</button>}{readMinutes && <Doc title="B3 구역 폐쇄 회의록 / 1999.07.12" text={<>참석: 박상무, 김과장, 최주임<br/><br/>1. 지하 3층 실험 구역을 <mark>7월 16일 23:00</mark>부로 영구 폐쇄한다.<br/>2. ‘MIRROR’ 관련 기록은 보안실로 이관한다.<br/>3. 폐쇄 사유는 전기 설비 고장으로 통일한다.<br/><br/>※ 김과장: 이건 설비 문제가 아닙니다. 아직 사람이 안에 있습니다.</>} />}{readRecovered && <Doc title="경비일지_복구.txt" text={<>07/16　22:40 — B3 화물승강기 작동<br/>07/16　22:53 — 연구원 윤서진, 단독 입장<br/>07/16　23:07 — 중앙전원 차단<br/>07/16　23:18 — 내부 비상전화 3회. 상부 지시로 응답하지 않음.<br/><br/><b>삭제 지시자: 박상무</b></>} />}</main></div>;
    if (id === "mail") return <div className="mail"><div className="mail-list"><b>받은 편지함 (3)</b><button onClick={() => setReadMail(true)}><strong>최주임</strong><span>암호 바뀌었습니다</span><small>07/15</small></button><button><strong>총무팀</strong><span>하계휴가 안내</span><small>07/09</small></button><button><strong>김과장</strong><span>회신: 회의록</span><small>07/12</small></button></div><div className="mail-body">{readMail ? <><h3>암호 바뀌었습니다</h3><p>보낸 사람: 최민호 주임<br/>받는 사람: 김도현 과장</p><hr/><p>과장님, 보안 폴더 암호는 이번에도 <b>‘그날’의 월과 일을 네 자리로</b> 붙였습니다.</p><p>우리 회사 표기는 늘 <mark>월 먼저, 일 나중(MMDD)</mark>인 거 아시죠. 날짜는 회의록에 있습니다.</p><p>메신저에도 남겨둘게요. — 최</p></> : <div className="empty">확인할 메일을 선택하십시오.</div>}</div></div>;
    if (id === "trash") return <div className="trash"><div className="toolbar">파일　편집　보기　도움말</div><div className="trash-file"><span>📄</span><b>경비일지_삭제됨.txt</b><small>삭제: 1999-07-17 08:12</small>{!restored ? <button onClick={() => setRestored(true)}>↩ 원래 위치로 복원</button> : <em>복원됨 — C:\업무\1999</em>}</div><p className="status">개체 1개</p></div>;
    if (id === "chat") return <div className="chat"><aside><b>접속자</b><span>● 최민호</span><span className="offline">● 김도현 (자리비움)</span><span className="offline">● 윤서진 (오프라인)</span></aside><main><h3>김도현 ↔ 최민호 / 대화 기록</h3><div className="log" onClick={() => setReadChat(true)}><p><time>07/15 18:02</time> 최민호: 폴더 암호 메일로 보냈습니다.</p><p><time>07/15 18:03</time> 김도현: 폐쇄 날짜 맞지?</p><p><time>07/15 18:03</time> 최민호: 네. <mark>월 두 자리 + 일 두 자리</mark>요.</p><p><time>07/15 18:04</time> 김도현: 윤 연구원 건은?</p><p><time>07/15 18:05</time> 최민호: 경비일지를 지웠지만 휴지통은 안 비웠습니다. 복구해 보세요.</p><p><time>07/15 18:06</time> 최민호: 제가 사라지면 B3는 사고가 아니었던 겁니다.</p></div></main></div>;
    if (id === "photos") return <div className="photos"><div className="photo"><div className="b3">B3<br/><span>관계자 외 출입금지</span></div></div><p>IMG_0716_2241.JPG</p><small>화물승강기 앞. 촬영자 미상.</small></div>;
    if (id === "secret") return unlocked ? <div className="secret-doc"><div className="classified">대외비 / PROJECT MIRROR</div><h2>피험자 사고 최종 보고서</h2><p>1999년 7월 16일, 지하 3층 신경동조 실험 중 피험자 윤서진 연구원이 의식을 잃었다. 경영진은 구조 요청을 묵살하고 23:07 중앙전원을 차단했다.</p><p>실험은 타인의 기억을 영상으로 복제하는 데 성공했으나, 피험자의 뇌 활동 없이는 데이터를 유지할 수 없었다. 회사는 연구원을 장치에 연결한 채 B3를 봉인했다.</p><p><b>이 PC는 1999년 7월 16일 22:41, 윤서진이 마지막 증거를 외부로 복사하기 위해 사용했다.</b></p><button className="primary" onClick={() => { setEnded(true); launch("ending"); }}>증거를 외부로 전송한다</button></div> : <form className="password" onSubmit={e => { e.preventDefault(); if (password === "0716") { setUnlocked(true); setError(false); } else setError(true); }}><div className="lock-big">🔐</div><h3>암호로 보호된 폴더</h3><p>암호 힌트: “그날 / MMDD”</p><input autoFocus maxLength={4} value={password} onChange={e => setPassword(e.target.value.replace(/\D/g, ""))} placeholder="암호 4자리"/><button>확인</button>{error && <span className="error">암호가 올바르지 않습니다.</span>}</form>;
    if (id === "case") return <div className="case"><h2>수사 진행</h2>{["파일 탐색기에서 회의록 발견", "메일에서 암호 규칙 확인", "휴지통에서 경비일지 복구·열람", "메신저 로그에서 순서 확인", "기밀자료 암호 해제", "진실 문서 전송"].map((x,i)=><div className={progress[i]?"done":""} key={x}><span>{progress[i]?"✓":"□"}</span>{x}</div>)}<p>{progress.filter(Boolean).length} / 6 단서 완료</p></div>;
    return <div className="ending"><p>1999.07.17　00:03:19</p><h1>전송 완료</h1><div className="signal">▮▮▮▮▮▮▮▮▮▮ 100%</div><p>PROJECT MIRROR의 보고서와 경비 기록이 외부 통신망으로 전송되었다.</p><p>27년 동안 버려진 PC가 마지막으로 해야 했던 일을, 당신이 끝냈다.</p><hr/><h3>그러나 모니터를 끄기 직전—</h3><p className="last">지하 3층에서 접속 신호가 감지되었습니다.</p><button onClick={() => location.reload()}>처음부터 다시 시작</button></div>;
  };

  if (!booted) return <div className="boot"><div className="boot-logo">HANBIT<span>98</span></div><p>한빛전자 네트워크에 로그온하는 중...</p><div className="bootbar"><i/></div></div>;
  return <div className="screen" onMouseDown={() => { setStartOpen(false); }}>
    <div className="scanlines"/><header><span>HANBIT ELECTRONICS</span><b>워크스테이션 03-17</b></header>
    <div className="icons">{apps.map(a=><button key={a.id} onDoubleClick={() => launch(a.id)} onClick={() => launch(a.id)}><span>{a.icon}</span>{a.label}</button>)}</div>
    <button className="case-shortcut" onClick={() => launch("case")}><span>📋</span>사건 기록 <b>{progress.filter(Boolean).length}/6</b></button>
    {open.map((id, idx) => !minimized.includes(id) && <section key={id} className={`window ${active===id?"active":""} ${id==="ending"?"ending-window":""}`} style={{ left: positions[id]?.x ?? 150 + idx*25, top: positions[id]?.y ?? 60 + idx*22, zIndex: active===id?50:10+idx }} onMouseDown={e => { e.stopPropagation(); setActive(id); }}><div className="titlebar" onMouseDown={e => beginDrag(e,id)}><span>{id==="ending"?"⚠️":"▣"}　{titles[id]}</span><div><button onClick={() => minimize(id)}>_</button><button onClick={() => close(id)}>×</button></div></div><div className="window-body">{content(id)}</div></section>)}
    {startOpen && <div className="start-menu" onMouseDown={e=>e.stopPropagation()}><div className="side">HANBIT 98</div><div>{apps.slice(0,4).map(a=><button key={a.id} onClick={()=>launch(a.id)}><span>{a.icon}</span>{a.label}</button>)}<hr/><button onClick={()=>launch("case")}><span>📋</span>사건 기록</button><button><span>⏻</span>시스템 종료...</button></div></div>}
    <footer><button className="start" onMouseDown={e=>e.stopPropagation()} onClick={()=>setStartOpen(v=>!v)}><span>▰</span> 시작</button><div className="tasks">{open.filter(id=>id!=="ending").map(id=><button className={active===id&&!minimized.includes(id)?"pressed":""} key={id} onClick={()=> minimized.includes(id)?launch(id):setActive(id)}>▣ {titles[id]}</button>)}</div><div className="tray">🔊　{clock}</div></footer>
  </div>;
}

function Doc({title,text}:{title:string;text:React.ReactNode}) { return <div className="doc"><div><b>{title}</b><button aria-label="문서 닫기" onClick={e=>(e.currentTarget.parentElement!.parentElement!.style.display="none")}>×</button></div><article>{text}</article></div>; }
