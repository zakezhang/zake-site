import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* Self-hosted (src/fonts) so builds never depend on fonts.googleapis.com
   and visitors behind slow routes load type from our own origin. */
const firaSans = localFont({
  variable: "--font-fira",
  src: [
    { path: "../fonts/fira-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/fira-sans-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/fira-sans-700.woff2", weight: "700", style: "normal" },
  ],
});

const fragmentMono = localFont({
  variable: "--font-fragment",
  src: [{ path: "../fonts/fragment-mono-400.woff2", weight: "400", style: "normal" }],
});

const spaceMono = localFont({
  variable: "--font-space",
  src: [
    { path: "../fonts/space-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/space-mono-700.woff2", weight: "700", style: "normal" },
  ],
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
