'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const section = document.getElementById('menu-5-uXZuRd8pjg');
    if (section) {
      section.setAttribute('once', 'menu');
    }
  }, []);

  return (
    <main>
      <section class="menu menu2 cid-uXZuRd8pjg" once="menu" id="menu-5-uXZuRd8pjg">
        <nav class="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
          <div class="container">
            <div class="navbar-brand">
              <span className="navbar-logo">
                <a href="https://mobiri.se">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1701789831874-8cd82165113e%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8NXx8Y2FyJTIwY29tbXVuaXR5fGVufDB8MHx8fDE3NTg5Njc1MzV8MA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;TR9ev2TA5QsTjR3HfIzv5ZY9Xmq2IierL3QwPV_Uc2s" style={{ height: "4.3rem" }}/>
                </a>
              </span>
              <span class="navbar-caption-wrap">
                <a class="navbar-caption text-black display-4" href="https://mobiri.se">AutoMania</a>
              </span>
            </div>
            <button class="navbar-toggler" type="button" data-toggle="collapse"
              data-bs-toggle="collapse" data-target="#navbarSupportedContent"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarNavAltMarkup" aria-expanded="false"
              aria-label="Toggle navigation">
              <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav nav-dropdown" data-app-modern-menu="true">
                <li class="nav-item">
                  <a class="nav-link link text-black display-4" href="#">Forum</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link link text-black display-4" href="#"
                    aria-expanded="false">Giełda</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link link text-black display-4" href="#">Klub</a>
                </li>
              </ul>
              <div class="navbar-buttons mbr-section-btn">
                <a class="btn btn-primary display-4" href="https://mobiri.se">Dołącz Teraz</a>
              </div>
            </div>
          </div>
        </nav>
      </section>

      <section class="header18 cid-uXZuRd8QXl mbr-fullscreen" data-bg-video="https://www.youtube.com/embed/Sai-BP-ft1Y?autoplay&#x3D;1&amp;loop&#x3D;1&amp;playlist&#x3D;Sai-BP-ft1Y&amp;t&#x3D;20&amp;mute&#x3D;1&amp;playsinline&#x3D;1&amp;controls&#x3D;0&amp;showinfo&#x3D;0&amp;autohide&#x3D;1&amp;allowfullscreen&#x3D;true&amp;mode&#x3D;transparent" id="hero-15-uXZuRd8QXl">
        <div class="mbr-overlay" style={{opacity: 0.3, backgroundColor:" rgb(0, 0, 0)"}}></div>
        <div class="container-fluid">
          <div class="row">
            <div class="content-wrap col-12 col-md-8">
              <h1
                class="mbr-section-title mbr-fonts-style mbr-white mb-4 display-1 animate__animated animate__delay-1s animate__fadeInUp">
                <strong>Świat Motoryzacji</strong>
              </h1>
              <p class="mbr-fonts-style mbr-text mbr-white mb-4 display-7 animate__animated animate__delay-1s animate__fadeInUp">Twoje miejsce spotkań z pasjonatami czterech kółek. Dziel się wiedzą i emocjami!</p>
              <div class="mbr-section-btn">
                <a class="btn btn-white-outline display-7 animate__animated animate__delay-1s animate__fadeInUp" href="#">Zacznij</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="features10 cid-uXZuRd8TLc" id="metrics-2-uXZuRd8TLc">
        <div class="container">
          <div class="row justify-content-center">
            <div class="item features-without-image col-12 col-md-6 col-lg-4">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-title mbr-fonts-style display-1 mb-3">
                    <strong>100K+</strong>
                  </p>
                  <p class="card-text mbr-fonts-style mb-3 display-7">
                    Aktywnych Użytkowników
                  </p>            
                </div>
              </div>
            </div>
            <div class="item features-without-image col-12 col-md-6 col-lg-4">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-title mbr-fonts-style display-1 mb-3">
                    <strong>50K+</strong>
                  </p>
                  <p class="card-text mbr-fonts-style mb-3 display-7">
                    Tematów Dyskusji
                  </p>            
                </div>
              </div>
            </div>
            <div class="item features-without-image col-12 col-md-6 col-lg-4">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-title mbr-fonts-style display-1 mb-3">
                    <strong>1M+</strong>
                  </p>
                  <p class="card-text mbr-fonts-style mb-3 display-7">
                    Udostępnionych Zdjęć
                  </p>            
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="image02 cid-uXZuRd8mMk mbr-fullscreen mbr-parallax-background" id="image-13-uXZuRd8mMk">
        <div class="container">
            <div class="row"></div>
        </div>
      </section>

      <section class="news08 cid-uXZuRd8YdW" id="blog-5-uXZuRd8YdW">
        <div class="container">
          <div class="row justify-content-center mb-5">
            <div class="col-12 content-head">
              <div class="mbr-section-head">
                <h4 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2" >
                  <strong>Gorące Tematy Motoryzacji</strong>
                </h4>
                
              </div>
            </div>
          </div>
          <div class="row">
            <div class="item features-image col-12 col-md-6 col-lg-6 active">
              <div class="item-wrapper">
                <div class="item-img mb-3">
                  <img alt="Mobirise Website Builder" title="" data-slide-to="0" data-bs-slide-to="0" src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1758354973020-4d76f42e104e%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MTR8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;deXt_ShecB338qiC4EfQzEoxrOGHYbnzJ8FfgiX3az8"/>
                </div>
                <div class="item-content align-left">
                  <h5 class="item-title mbr-fonts-style mt-0 mb-3 display-7" >2025-09-26</h5>
                  <h6 class="item-subtitle mbr-fonts-style mb-3 display-5" >
                    <strong>Nowości ze świata aut</strong>
                  </h6>
                  <p class="mbr-text mbr-fonts-style mb-3 display-7" >Najnowsze premiery i zapowiedzi ze świata motoryzacji. Bądź na bieżąco z trendami.</p>
                  
                </div>
              </div>
            </div><div class="item features-image col-12 col-md-6 col-lg-6">
              <div class="item-wrapper">
                <div class="item-img mb-3">
                  <img alt="Mobirise Website Builder" title="" data-slide-to="1" data-bs-slide-to="1" src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1517213830215-ad88cda1f131%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MjZ8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;8peCzKNqjUQplz1ZcmQihFSAAS6uiufmUGYo_A9mo2k"/>
                </div>
                <div class="item-content align-left">
                  <h5 class="item-title mbr-fonts-style mt-0 mb-3 display-7" >2025-09-25</h5>
                  <h6 class="item-subtitle mbr-fonts-style mb-3 display-5" >
                    <strong>Porady ekspertów</strong>
                  </h6>
                  <p class="mbr-text mbr-fonts-style mb-3 display-7" >Praktyczne wskazówki dotyczące konserwacji i napraw Twojego pojazdu.</p>
                  
                </div>
              </div>
            </div><div class="item features-image col-12 col-md-6 col-lg-6">
              <div class="item-wrapper">
                <div class="item-img mb-3">
                  <img alt="Mobirise Website Builder" title="" data-slide-to="2" data-bs-slide-to="3" src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1671613653711-3f74665835d1%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MjF8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;uqHryE2wfG9mxA2L29OJ6ZE0KMxWjpIBbl5VPr8QGc8"/>
                </div>
                <div class="item-content align-left">
                  <h5 class="item-title mbr-fonts-style mt-0 mb-3 display-7" >2025-09-24</h5>
                  <h6 class="item-subtitle mbr-fonts-style mb-3 display-5" >
                    <strong>Testy drogowe</strong>
                  </h6>
                  <p class="mbr-text mbr-fonts-style mb-3 display-7" >Szczegółowe recenzje najnowszych modeli samochodów.</p>
                  
                </div>
              </div>
            </div><div class="item features-image col-12 col-md-6 col-lg-6">
              <div class="item-wrapper">
                <div class="item-img mb-3">
                  <img alt="Mobirise Website Builder" title="" data-slide-to="3" data-bs-slide-to="4" src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1550252308-87f004632e0a%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MTB8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;88qQ9nNZhEYi8yLrLFObn5msyXb7bpKlT_At-uJJ8Zk"/>
                </div>
                <div class="item-content align-left">
                  <h5 class="item-title mbr-fonts-style mt-0 mb-3 display-7" >2025-09-23</h5>
                  <h6 class="item-subtitle mbr-fonts-style mb-3 display-5" >
                    <strong>Historia motoryzacji</strong>
                  </h6>
                  <p class="mbr-text mbr-fonts-style mb-3 display-7" >Cofnij się w czasie i poznaj legendarne samochody.</p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="gallery10 cid-uXZuRd9czH" id="features-69-uXZuRd9czH">
        <div class="container-fluid">
            <div class="loop-container">
              <div class="item display-1" data-linewords="
                Społeczność Pasjonatów *
                Wymiana Wiedzy i Doświadczeń *" 
              data-direction="-1" data-speed="0.05">
              </div>
              <div class="item display-1" data-linewords="
                Społeczność Pasjonatów *
                Wymiana Wiedzy i Doświadczeń *" 
              data-direction="-1" data-speed="0.05">
              </div>
            </div>   
        </div>
      </section>

      <section class="list05 cid-uXZuRd96hI" id="faq-3-uXZuRd96hI">
        <div class="container">
            <div class="col-12 mb-5 content-head">
                <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                    <strong>Najczęściej Zadawane Pytania</strong>
                </h3>   
            </div>
            <div class="row justify-content-center">
                <div class="col-12 col-lg-8">
                    <div class="item features-without-image col-12 active">
                        <div class="item-wrapper">
                            <h5 class="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Jak zacząć?</strong></h5>
                            <p class="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Zarejestruj się na naszej stronie, aby dołączyć do dyskusji i dzielić się swoją pasją.
                            </p>
                        </div>
                    </div>
                    <div class="item features-without-image col-12">
                        <div class="item-wrapper">
                            <h5 class="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Czy są jakieś opłaty?</strong></h5>
                            <p class="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Rejestracja i podstawowe korzystanie z forum są całkowicie darmowe.
                            </p>
                        </div>
                    </div>
                    <div class="item features-without-image col-12">
                        <div class="item-wrapper">
                            <h5 class="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Jakie tematy poruszamy?</strong></h5>
                            <p class="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Omawiamy wszystko, co związane z samochodami: od nowości, przez klasyki, po techniczne aspekty.
                            </p>
                        </div>
                    </div>
                      <div class="item features-without-image col-12">
                        <div class="item-wrapper">
                            <h5 class="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Czy mogę sprzedać auto?</strong></h5>
                            <p class="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Posiadamy specjalną sekcję do ogłoszeń motoryzacyjnych.
                            </p>
                        </div>
                    </div>
                      <div class="item features-without-image col-12">
                        <div class="item-wrapper">
                            <h5 class="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Jak zgłosić problem?</strong></h5>
                            <p class="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Skontaktuj się z administracją poprzez formularz kontaktowy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section class="people03 cid-uXZuRd9XKy" id="team-1-uXZuRd9XKy">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <div class="col-12 content-head">
              <div class="mbr-section-head mb-5">
                <h4 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                  <strong>Nasz Zespół</strong>
                </h4>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="item features-image col-12 col-md-6 col-lg-3">
              <div class="item-wrapper">
                <div class="item-img mb-3">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1541881856704-3c4b2896c0f8%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;IRFojKPMrLZwj9QltnE9v4FyCOxsDUjhxbKQSJBuwb4"/>
                </div>
                <div class="item-content align-left">
                  <h6 class="item-subtitle mbr-fonts-style display-5">
                    <strong>Krzysztof</strong></h6>
                  <p class="mbr-text mbr-fonts-style display-7">Administrator</p>
                </div>
              </div>
            </div>
            <div class="item features-image col-12 col-md-6 col-lg-3">
              <div class="item-wrapper">
                <div class="item-img mb-3">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1636624498233-0c3c5ab4186e%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;rTpe4XhkeXPA0dkbU5yd9nx70QELeBArHeo1bLUpggc"/>
                </div>
                <div class="item-content align-left">
                  <h6 class="item-subtitle mbr-fonts-style display-5">
                    <strong>Anna</strong></h6>
                  <p class="mbr-text mbr-fonts-style display-7">Moderator</p>
                </div>
              </div>
            </div>
            <div class="item features-image col-12 col-md-6 col-lg-3">
              <div class="item-wrapper">
                <div class="item-img mb-3">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1626899798511-c3eaacb02846%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;0Ur5K5NA4Bf4_elvfod-A4a9_BHSMSno_RgqsCtSe3s"/>
                </div>
                <div class="item-content align-left">
                  <h6 class="item-subtitle mbr-fonts-style display-5">
                    <strong>Marek</strong></h6>
                  <p class="mbr-text mbr-fonts-style display-7">Wsparcie Techniczne</p>
                </div>
              </div>
            </div>
            <div class="item features-image col-12 col-md-6 col-lg-3">
              <div class="item-wrapper">
                <div class="item-img mb-3">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1589571739149-47ed80eae6ba%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;4xhPALmYJbA0N6x8zMF0bh_StCQxiZL2x4VyStEBP74"/>
                </div>
                <div class="item-content align-left">
                  <h6 class="item-subtitle mbr-fonts-style display-5">
                    <strong>Katarzyna</strong>
                  </h6>
                  <p class="mbr-text mbr-fonts-style display-7">Redaktor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="people04 cid-uXZuRd9MlR" id="testimonials-3-uXZuRd9MlR">
        <div class="container">
          <div class="row mb-5 justify-content-center">
            <div class="col-12 mb-0 content-head">
              <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                <strong>Opinie</strong>
              </h3>	
            </div>
          </div>
          <div class="row mbr-masonry" data-masonry="{&quot;percentPosition&quot;: true }">
            <div class="item features-without-image col-12 col-md-6 col-lg-4 active">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-text mbr-fonts-style display-7">
                    Niesamowite miejsce dla każdego fana motoryzacji! Znajdziesz tu wszystko, czego potrzebujesz.
                  </p>
                  <div class="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1519866663826-7e1967cb3eec%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;M89WK7IZdyI65nh5g9r1R1_F3DGShhYz9K9neDre9ko" data-slide-to="0" data-bs-slide-to="0"/>
                  </div>
                  <h5 class="card-title mbr-fonts-style display-7">
                    <strong>Jan Kowalski</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div class="item features-without-image col-12 col-md-6 col-lg-4">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-text mbr-fonts-style display-7">
                    Świetna społeczność i mnóstwo fachowej wiedzy. Polecam każdemu miłośnikowi czterech kółek.
                  </p>
                  <div class="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1692558588242-57cec1e32bba%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;yZodbPrdh7c6WlSdCu8LFPnPv9G_9v_E-kvvfna_EiA" data-slide-to="1" data-bs-slide-to="1"/>
                  </div>
                  <h5 class="card-title mbr-fonts-style display-7">
                    <strong>Anna Nowak</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div class="item features-without-image col-12 col-md-6 col-lg-4">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-text mbr-fonts-style display-7">
                    Znalazłem tu odpowiedzi na wszystkie moje pytania dotyczące tuningu.
                  </p>
                  <div class="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1492288991661-058aa541ff43%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;S2nF4I7YDevvRgrPa2RBjEUsHrIbZfRrFFKB4GcG0mc" data-slide-to="2" data-bs-slide-to="2"/>
                  </div>
                  <h5 class="card-title mbr-fonts-style display-7">
                    <strong>Piotr Wiśniewski</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div class="item features-without-image col-12 col-md-6 col-lg-4">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-text mbr-fonts-style display-7">
                    Najlepsze forum motoryzacyjne w Polsce! Atmosfera jest fantastyczna.
                  </p>
                  <div class="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1592669546196-bb70d4f16dd7%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;6gzAF1UOoM7z_jo79zyBAvyNW_gmUU4yboFPGnOOdwk" data-slide-to="3" data-bs-slide-to="3"/>
                  </div>
                  <h5 class="card-title mbr-fonts-style display-7">
                    <strong>Katarzyna Jankowska</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div class="item features-without-image col-12 col-md-6 col-lg-4">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-text mbr-fonts-style display-7">
                    Dzięki tej stronie poznałem wielu ludzi z podobnymi pasjami.
                  </p>
                  <div class="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1557684387-08927d28c72a%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;WzNS6dlp_WB7s_0UTQKv_a-56gb83AYqkoPZqeL-1xQ" data-slide-to="4" data-bs-slide-to="4"/>
                  </div>
                  <h5 class="card-title mbr-fonts-style display-7">
                    <strong>Marek Lewandowski</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div class="item features-without-image col-12 col-md-6 col-lg-4">
              <div class="item-wrapper">
                <div class="card-box align-left">
                  <p class="card-text mbr-fonts-style display-7">
                    Profesjonalne porady i gorące dyskusje o najnowszych modelach aut.
                  </p>
                  <div class="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1593878934638-c280c318675d%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;zMKxodeQleco9HRnIdKrs_EzWicUqJkjkXvW4xzi0v0" data-slide-to="5" data-bs-slide-to="5"/>
                  </div>
                  <h5 class="card-title mbr-fonts-style display-7">
                    <strong>Ewa Zielińska</strong>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="header14 cid-uXZuRd9Tgq" id="call-to-action-10-uXZuRd9Tgq">
        <div class="container">
          <div class="row justify-content-center">
            <div class="card col-12 col-md-12 col-lg-10">
              <div class="card-wrapper">
                <div class="card-box align-center">
                  <h1 class="card-title mbr-fonts-style mb-4 display-1">
                    <strong>Dołącz do Nas!</strong>
                  </h1>
                  <p class="mbr-text mbr-fonts-style mb-4 display-7">
                    Zarejestruj się już dziś i stań się częścią naszej motoryzacyjnej rodziny.
                              </p>
                  <div class="mbr-section-btn mt-4">
                                  <a class="btn btn-primary display-7" href="#">
                                      Zarejestruj Się
                                  </a>
                              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="header18 cid-uXZuRd9ToS mbr-fullscreen" data-bg-video="https://www.youtube.com/embed/CFE1VxLvA0o?autoplay&#x3D;1&amp;loop&#x3D;1&amp;playlist&#x3D;CFE1VxLvA0o&amp;t&#x3D;20&amp;mute&#x3D;1&amp;playsinline&#x3D;1&amp;controls&#x3D;0&amp;showinfo&#x3D;0&amp;autohide&#x3D;1&amp;allowfullscreen&#x3D;true&amp;mode&#x3D;transparent" id="video-5-uXZuRd9ToS">
        <div class="mbr-overlay" style={{ opacity: 0.3, backgroundColor: "rgb(0, 0, 0)" }}></div>
        <div class="container-fluid">
          <div class="row">
          </div>
        </div>
      </section>

      <section class="gallery4 cid-uXZuRd95m6" id="gallery-12-uXZuRd95m6">
        <div class="container-fluid gallery-wrapper">
          <div class="grid-container">
            <div class="grid-container-1" style={{transform: "translate3d(-200px, 0px, 0px)"}}>
              <div class="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1758445048963-c8682c897428%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MTV8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;S2q1DvYJtPmdvC-sbluz_nmsjLgWR4W-rFBcqIT4n2o"/>
              </div>
              <div class="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1747842915877-b3ae5f45049f%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MXx8Y2FyJTIwY29tbXVuaXR5fGVufDB8MHx8fDE3NTg5Njc1MzV8MA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;rYJ7V84tWCEx7l14mHOM6b8EmKPBMjUo2J-BbNxPR5Q"/>
              </div>
              <div class="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1701789903841-d6395d23d1ae%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8N3x8Y2FyJTIwY29tbXVuaXR5fGVufDB8MHx8fDE3NTg5Njc1MzV8MA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;ppfiIdpeHYCmVoMEcuRhoCwe67z_9gWqXwbkK2BUqWQ"/>
              </div>
              <div class="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1666801360592-d367662f4822%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MjB8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;LqBINwgcHCq7fIXXBxZoOHF4Glmls9yZgi9_JIitOuk"/>
              </div>
            </div>
            <div class="grid-container-2" style={{transform: "translate3d(-70px, 0px, 0px)"}}>
              <div class="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1758620322904-a03ae6bdd1d4%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8Mjh8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;3WMHaDMgNkRBtIoeyUfCtrrj3AJwL-fgbIMU4tmk52w"/>
              </div>
              <div class="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1690310456640-90d64e9f7b18%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MTJ8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;quBvE1gHVe1a2A9rPW4NZ0I_FScoAyOb9kJMjV0QbvU"/>
              </div>
              <div class="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1758354973754-2921e70dee51%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MTF8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;VnHtLTgUcW9XJyArLdXBf3-ZXtRrtWqJKPfis9LoR0g"/>
              </div>
              <div class="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1597506292378-3aa2963570a4%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8Mjl8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;uBpGXKAQwME4xRAoht-2X5Mmlgpqy47kMmo8ttFNAQY"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="social4 cid-uXZuRd9Aqj" id="follow-us-1-uXZuRd9Aqj">
        <div class="container">
            <div class="media-container-row">
                <div class="col-12">
                    <h3 class="mbr-section-title align-center mb-5 mbr-fonts-style display-2">
                        <strong>Śledź Naszą Społeczność</strong>
                    </h3>
                    <div class="social-list align-center">
                        <a class="iconfont-wrapper bg-facebook m-2 " target="_blank" href="#">
                            <span class="socicon-facebook socicon"></span>
                        </a>
                        <a class="iconfont-wrapper bg-twitter m-2" href="#" target="_blank">
                            <span class="socicon-twitter socicon"></span>
                        </a>
                        <a class="iconfont-wrapper bg-instagram m-2" href="#" target="_blank">
                            <span class="socicon-instagram socicon"></span>
                        </a>
                        <a class="iconfont-wrapper bg-tiktok m-2" href="#" target="_blank">
                            <span class="socicon-tiktok socicon"></span>
                        </a>                   
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section class="form5 cid-uXZuRd9AkP" id="contact-form-2-uXZuRd9AkP">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 content-head">
                    <div class="mbr-section-head mb-5">
                        <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                            <strong>Dołącz do Dyskusji</strong>
                        </h3>                    
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-8 mx-auto mbr-form" data-form-type="formoid">
                    <form action="https://mobirise.eu/" method="POST" class="mbr-form form-with-styler" data-form-title="Form Name"><input type="hidden" name="email" data-form-email="true" value=""/>
                        <div class="row">
                            <div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Thanks for filling out the form!</div>
                            <div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">
                                Oops...! some problem!
                            </div>
                        </div>
                        <div class="dragArea row">
                            <div class="col-md col-sm-12 form-group mb-3" data-for="name">
                                <input type="text" name="name" placeholder="Imię" data-form-field="name" class="form-control" value="" id="name-form02-0"/>
                            </div>
                            <div class="col-md col-sm-12 form-group mb-3" data-for="email">
                                <input type="email" name="email" placeholder="Email" data-form-field="email" class="form-control" value="" id="email-form02-0"/>
                            </div>
                            <div class="col-12 form-group mb-3" data-for="textarea">
                                <textarea name="textarea" placeholder="Wiadomość" data-form-field="textarea" class="form-control" id="textarea-form02-0"></textarea>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 align-center mbr-section-btn"><button type="submit" class="btn btn-primary display-7">Wyślij</button></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </section>

      <section class="contacts4 map1 cid-uXZuRdaRni" id="contacts-3-uXZuRdaRni">
        <div class="main_wrapper">
          <div class="b_wrapper">
            <div class="container-fluid">
              <div class="row justify-content-start">
                <div class="col-md-5 col-lg-4 item-wrapper">
                  <h5 class="cardTitle mbr-fonts-style mb-2 display-5">
                      <strong>Kontakt</strong>
                  </h5>
                  <ul class="list mbr-fonts-style display-7">
                    <li class="mbr-text item-wrap">Telefon: <a href="tel:555-123-4567" class="text-black">555-123-4567</a></li>
                    <li class="mbr-text item-wrap">WhatsApp: <a href="tel:555-123-4567" class="text-black">555-123-4567</a></li>
                    <li class="mbr-text item-wrap">Email: <a href="mailto:kontakt@moto-forum.pl" class="text-black">kontakt@moto-forum.pl</a></li>
                    <li class="mbr-text item-wrap">Adres: ul. Wyścigowa 1, 00-001 Warszawa</li>
                    <li class="mbr-text item-wrap">Godziny Otwarcia: Pon-Pt: 9:00 - 18:00, Sob: 10:00 - 14:00</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
              <div class="google-map"><iframe frameBorder="0" style={{ border: 0 }} src="https://www.google.com/maps/embed/v1/place?key&#x3D;AIzaSyCt1265A4qvZy9HKUeA8J15AOC4SrCyZe4&amp;q&#x3D;Sok%C3%B3%C5%82ka%20Poland" allowFullScreen=""></iframe></div>
        </div>
      </section>

      <section class="footer3 cid-uXZuRdagkn" once="footers" id="footer-6-uXZuRdagkn">
        <div class="container">
            <div class="row">
                <div class="row-links">
                    <ul class="header-menu">
                    <li class="header-menu-item mbr-fonts-style display-5">
                        <a href="#" class="text-white">O nas</a>
                      </li><li class="header-menu-item mbr-fonts-style display-5">
                        <a href="#" class="text-white">Regulamin</a>
                      </li><li class="header-menu-item mbr-fonts-style display-5">
                        <a href="#" class="text-white">Prywatność</a>
                      </li><li class="header-menu-item mbr-fonts-style display-5">
                        <a href="#" class="text-white">Reklama</a>
                      </li></ul>
                  </div>
                <div class="col-12 mt-4">
                    <p class="mbr-fonts-style copyright display-7">
                        Wszelkie prawa zastrzeżone © 2025 Moto-Forum
                    </p>
                </div>
            </div>
        </div>
      </section>
    </main>  
  )
}
