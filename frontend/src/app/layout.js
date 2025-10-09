import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/web/assets/mobirise-icons2/mobirise2.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/parallax/jarallax.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/bootstrap/css/bootstrap.min.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/bootstrap/css/bootstrap-grid.min.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/bootstrap/css/bootstrap-reboot.min.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/dropdown/css/style.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/socicon/css/styles.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/animatecss/animate.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://ai.mobirise.com/assets/startm5/theme/css/style.css?v=m3frcrn2"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;700&display=swap"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;700&display=swap"
          />
        </noscript>
        <link
          rel="stylesheet"
          href="/css/additional.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
