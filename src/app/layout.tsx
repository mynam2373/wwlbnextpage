import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { AlternateModeProvider } from "./providers/AlternateModeProvider";

const devSessionId = process.env.NODE_ENV === "development" ? String(process.pid) : undefined;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What We Left Behind",
  description: "Explora el mundo, los personajes y la historia de Vesteria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AlternateModeProvider devSessionId={devSessionId}>{children}</AlternateModeProvider>
      </body>
    </html>
  );
}
