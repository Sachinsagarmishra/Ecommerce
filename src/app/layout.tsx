import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern eCommerce Store",
  description: "Next.js + Supabase eCommerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        {/* We only show Navbar on non-admin routes typically, but for simplicity here we keep it or handle it in child layouts */}
        {/* We'll check if the path starts with /admin in a client component or just keep it simple for now */}
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
