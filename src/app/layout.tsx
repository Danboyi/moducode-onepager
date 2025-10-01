import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moducode - Hire vetted remote tech talent from Africa",
  description: "Hire vetted remote tech talent from Africa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
