import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "供应链规划助手",
  description: "智能分析供应链需求，提供采购策略与需求预测方案",
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
