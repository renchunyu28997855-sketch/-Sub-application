import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "润滑咨询系统",
  description: "智能润滑方案推荐、油品选择与维护周期建议",
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
