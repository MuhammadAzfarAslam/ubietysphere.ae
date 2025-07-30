import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend', // optional: for use in Tailwind
});

export const metadata = {
  title: "Ubiety Sphere",
  description: "A knowledge dome",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.variable} antialiased`}
      >
        <Header session={session} />
        <main className="flex flex-col" style={{ minHeight: 'calc(100vh - 98px)' }}>
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
