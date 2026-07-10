import type { Metadata } from "next";
import { Fira_Sans, Fragment_Mono, Space_Mono } from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
  variable: "--font-fira",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ZAKE©2026",
  description: "AI Founder & Storyteller © 2026",
};

const themeInit = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((!t||t==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${firaSans.variable} ${fragmentMono.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="h-full overflow-hidden bg-b1 text-l1 font-sans">
        {children}
      </body>
    </html>
  );
}
