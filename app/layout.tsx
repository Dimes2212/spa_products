import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Products SPA",
  description: "MVP: Next + React + TS + Zustand",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="container">
          <header className="header">
            <Link href="/products"><strong>Products</strong></Link>
            <nav>
              <Link href="/products"><button>Список</button></Link>
              <Link href="/create-product"><button className="primary">+ Create</button></Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
