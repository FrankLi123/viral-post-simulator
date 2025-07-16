import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Post Simulator - Experience Going Viral",
  description: "A fun parody app that simulates the experience of your post going viral on social media. Watch fake metrics grow and feel the dopamine rush!",
  keywords: ["viral", "post", "simulator", "social media", "parody", "fun"],
  authors: [{ name: "Viral Post Sim" }],
  openGraph: {
    title: "Viral Post Simulator - Experience Going Viral",
    description: "Watch your post go viral with fake metrics and comments!",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
