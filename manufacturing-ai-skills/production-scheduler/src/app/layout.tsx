import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "生产排程调度系统",
  description: "智能生产排程与调度优化系统",
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
