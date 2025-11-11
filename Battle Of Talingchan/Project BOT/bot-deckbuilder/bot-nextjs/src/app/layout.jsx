import { Inter } from "next/font/google";
import "./globals.css"; // <--- Import CSS ที่เราย้ายมา
import { Providers } from "./providers"; // <--- Import Providers ของเรา

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Battle Of Talingchan - Deck Builder",
  description: "สร้างเด็ค Battle Of Talingchan ของคุณ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/*
          Providers ของเรา (Google, DnD)
          จะห่อหุ้มทุกหน้าในแอป (children)
        */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}