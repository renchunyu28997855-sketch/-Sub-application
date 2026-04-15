import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "供应链管理系统",
  description: "智能分析供应链风险，优化库存管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body