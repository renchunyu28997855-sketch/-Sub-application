import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "磨损检测分析系统",
  description: "智能分析设备磨损情况，评估寿命并提供维护建议",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
