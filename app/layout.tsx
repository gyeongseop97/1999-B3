import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "지하 3층 — 1999 미스터리", description: "버려진 회사 PC에서 지하 3층의 비밀을 추적하는 레트로 미스터리 게임" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
