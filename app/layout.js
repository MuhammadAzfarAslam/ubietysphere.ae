import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend', // optional: for use in Tailwind
});

export const metadata = {
  title: "Ubiety Sphere",
  description: "A knowledge dome",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.variable} antialiased`}
      >
        <Header />
        <main className="flex flex-col min-h-screen">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
