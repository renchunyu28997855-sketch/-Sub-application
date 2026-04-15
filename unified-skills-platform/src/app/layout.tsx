import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 技能平台",
  description: "AI 技能平台 - 商业、数据、设计、教育、生活、职业、写作",
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
