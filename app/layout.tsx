import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./intro-fix.css";
import "./acts.css";
import "./recap.css";
import "./overrides.css";
import "./act-title.css";
import "./mobile.css";
import "./detective.css";
import "./ending-polish.css";
import "./narrative.css";
import "./evidence-images.css";

export const metadata: Metadata = {
  title: "지하 3층 — 1999 미스터리",
  description: "버려진 회사 PC에서 세 개의 막과 여섯 개의 엔딩을 추적하는 레트로 미스터리 게임",
  openGraph:{title:"지하 3층 — 1999 미스터리",description:"1999년, 버려진 PC가 켜졌다.",images:["/b3-intro.png"]},
  twitter:{card:"summary_large_image",title:"지하 3층 — 1999 미스터리",description:"1999년, 버려진 PC가 켜졌다.",images:["/b3-intro.png"]}
};
export const viewport: Viewport = {width:"device-width",initialScale:1,maximumScale:1,userScalable:false,viewportFit:"cover"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
