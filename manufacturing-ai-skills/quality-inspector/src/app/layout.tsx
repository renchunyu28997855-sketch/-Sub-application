import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 质量检测系统",
  description: "智能分析产品质量，识别缺陷并提供检测建议",
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
