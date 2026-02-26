import { Lexend_Deca } from "next/font/google";
import "../globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Providers } from "@/components/providers";

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export const metadata = {
  title: "Ubiety Sphere",
  description: "A knowledge dome",
};

export default async function DefaultLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lexendDeca.variable} antialiased`}>
        <Providers><Header /></Providers>
        <main className="flex flex-col" style={{ minHeight: 'calc(100vh - 98px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
