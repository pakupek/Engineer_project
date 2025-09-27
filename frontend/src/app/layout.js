import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}) {
  return (
    <html lang="pl">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="generator"
          content="Mobirise AI v0.01, ai.mobirise.com"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />

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
          href="https://ai-builder.mobirise.com/api/v2/themes/startm5-next/additional.css?v=0Tg50PK5XtpL3E-AsAXeYA"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <script src="https://ai.mobirise.com/assets/startm5/parallax/jarallax.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/bootstrap/js/bootstrap.bundle.min.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/dropdown/js/navbar-dropdown.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/masonry/masonry.pkgd.min.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/imagesloaded/imagesloaded.pkgd.min.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/scrollgallery/scroll-gallery.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/smoothscroll/smooth-scroll.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/ytplayer/index.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/theme/js/script.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/startm5/formoid/formoid.min.js?v=m3frcrn2"></script>
        <script src="https://ai.mobirise.com/assets/preview.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var animationInput = document.createElement('input');
                animationInput.setAttribute('name', 'animation');
                animationInput.setAttribute('type', 'hidden');
                document.body.append(animationInput);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
