import type { Metadata } from "next";
import "./globals.css";
import "./intro-fix.css";

export const metadata: Metadata = { title: "지하 3층 — 1999 미스터리", description: "버려진 회사 PC에서 지하 3층의 비밀을 추적하는 레트로 미스터리 게임", openGraph:{title:"지하 3층 — 1999 미스터리",description:"1999년, 버려진 PC가 켜졌다",images:["/b3-intro.png"]}, twitter:{card:"summary_large_image",title:"지하 3층 — 1999 미스터리",description:"1999년, 버려진 PC가 켜졌다",images:["/b3-intro.png"]} };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
