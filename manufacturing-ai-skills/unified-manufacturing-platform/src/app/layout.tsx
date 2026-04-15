import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "制造技能平台",
  description: "智能制造技能平台 - 碳排放计算、能源优化、设备监控等",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
