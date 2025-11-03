import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Internetowa historia pojazdów",
  description:
    "Odkryj jak szybkie i proste może być prowadzenie dokumentacji samochodu.",
  icons: {
    icon: "https://ai.mobirise.com/assets/startm5/images/logo5.png?v=m3frcrn2",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />

        {/* CSS */}
        <link rel="stylesheet" href="/css/mobirise2.css" />

        <link
          rel="stylesheet"
          href="/css/jarallax.css"
        />
        <link
          rel="stylesheet"
          href="/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="/css/bootstrap-grid.min.css"
        />
        <link
          rel="stylesheet"
          href="/css/bootstrap-reboot.min.css"
        />
        <link
          rel="stylesheet"
          href="/css/style.css"
        />
        <link
          rel="stylesheet"
          href="/css/styles.css"
        />
        <link
          rel="stylesheet"
          href="/css/animate.css"
        />
        <link
          rel="stylesheet"
          href="/css/style2.css"
        />
        <link
          rel="stylesheet"
          href="/css/css2.css"
        />
        
        <link
          rel="stylesheet"
          href="/css/additional.css"
        />
      </head>
      <body className={inter.variable}>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
