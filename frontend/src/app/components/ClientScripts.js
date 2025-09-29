"use client";

import { useEffect } from "react";

export default function ClientScripts() {
  useEffect(() => {
    const scripts = [
      "https://ai.mobirise.com/assets/startm5/parallax/jarallax.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/bootstrap/js/bootstrap.bundle.min.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/dropdown/js/navbar-dropdown.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/masonry/masonry.pkgd.min.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/imagesloaded/imagesloaded.pkgd.min.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/scrollgallery/scroll-gallery.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/smoothscroll/smooth-scroll.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/ytplayer/index.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/theme/js/script.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/startm5/formoid/formoid.min.js?v=m3frcrn2",
      "https://ai.mobirise.com/assets/preview.js",
    ];

    scripts.forEach(src => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });

    // Mobirise hidden input
    const animationInput = document.createElement("input");
    animationInput.setAttribute("name", "animation");
    animationInput.setAttribute("type", "hidden");
    document.body.appendChild(animationInput);

    if (window.initMenu) {
      window.initMenu();
    }

    if (window.initFooter) {
      window.initFooter();
    }
    
  }, []);

  return null;
}
