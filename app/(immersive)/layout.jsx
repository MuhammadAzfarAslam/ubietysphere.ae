import { Lexend_Deca } from "next/font/google";
import "../globals.css";

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export default function ImmersiveLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lexendDeca.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
