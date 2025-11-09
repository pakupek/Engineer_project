import ClientScripts from "../components/ClientScripts";
import AutomotiveNewsSection from "./AutomotiveNews/AutomotiveNewsSection";

export default function HomePage() {
  return (
    <main>
      {/* -------- Sekcja Hero Page ----------*/}
      <section className="header16 cid-uYaLNgXEi0 mbr-fullscreen mbr-parallax-background" id="hero-17-uYaLNgXEi0">
        <div className="mbr-overlay" style={{ opacity: 0.3, backgroundColor:' rgb(0, 0, 0)'}}></div>
        <div className="container-fluid">
          <div className="row">
            <div className="content-wrap col-12 col-md-10">
              <h1 className="mbr-section-title mbr-fonts-style mbr-white mb-4 display-1">
                <strong>GaraZero: Twoje Centrum Motoryzacji</strong>
              </h1>
              <p className="mbr-fonts-style mbr-text mbr-white mb-4 display-7">Dołącz do naszej społeczności pasjonatów motoryzacji i dziel się swoją pasją!</p>
              <div className="mbr-section-btn"><a className="btn btn-white-outline display-7" href="#">Zacznij</a></div>
            </div>
          </div>
        </div>
      </section>

      {/* -------- Sekcja Counter -----------*/}
      <section className="features10 cid-uXZuRd8TLc" id="metrics-2-uXZuRd8TLc">
        <div className="container">
          <div className="row justify-content-center">
            <div className="item features-without-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-title mbr-fonts-style display-1 mb-3">
                    <strong>100K+</strong>
                  </p>
                  <p className="card-text mbr-fonts-style mb-3 display-7">
                    Aktywnych Użytkowników
                  </p>            
                </div>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-title mbr-fonts-style display-1 mb-3">
                    <strong>50K+</strong>
                  </p>
                  <p className="card-text mbr-fonts-style mb-3 display-7">
                    Tematów Dyskusji
                  </p>            
                </div>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-title mbr-fonts-style display-1 mb-3">
                    <strong>1M+</strong>
                  </p>
                  <p className="card-text mbr-fonts-style mb-3 display-7">
                    Udostępnionych Zdjęć
                  </p>            
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* ----- Sekcja Tematów Motoryzacyjnych ------------*/}
      <AutomotiveNewsSection></AutomotiveNewsSection>

      
      {/* ---------- Sekcja Najczęściej zadawane pytania -------------*/}
      <section className="list05 cid-uXZuRd96hI" id="faq-3-uXZuRd96hI">
        <div className="container">
            <div className="col-12 mb-5 content-head">
                <h3 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                    <strong>Najczęściej Zadawane Pytania</strong>
                </h3>   
            </div>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="item features-without-image col-12 active">
                        <div className="item-wrapper">
                            <h5 className="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Jak zacząć?</strong></h5>
                            <p className="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Zarejestruj się na naszej stronie, aby dołączyć do dyskusji i dzielić się swoją pasją.
                            </p>
                        </div>
                    </div>
                    <div className="item features-without-image col-12">
                        <div className="item-wrapper">
                            <h5 className="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Czy są jakieś opłaty?</strong></h5>
                            <p className="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Rejestracja i podstawowe korzystanie z forum są całkowicie darmowe.
                            </p>
                        </div>
                    </div>
                    <div className="item features-without-image col-12">
                        <div className="item-wrapper">
                            <h5 className="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Jakie tematy poruszamy?</strong></h5>
                            <p className="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Omawiamy wszystko, co związane z samochodami: od nowości, przez klasyki, po techniczne aspekty.
                            </p>
                        </div>
                    </div>
                      <div className="item features-without-image col-12">
                        <div className="item-wrapper">
                            <h5 className="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Czy mogę sprzedać auto?</strong></h5>
                            <p className="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Posiadamy specjalną sekcję do ogłoszeń motoryzacyjnych.
                            </p>
                        </div>
                    </div>
                      <div className="item features-without-image col-12">
                        <div className="item-wrapper">
                            <h5 className="mbr-card-title mbr-fonts-style mt-0 mb-3 display-5">
                                <strong>Jak zgłosić problem?</strong></h5>
                            <p className="mbr-text mbr-fonts-style mt-0 mb-3 display-7">
                                Skontaktuj się z administracją poprzez formularz kontaktowy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ---------- Sekcja Nasz Zespół -----------*/}
      <section className="people03 cid-uXZuRd9XKy" id="team-1-uXZuRd9XKy">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 content-head">
              <div className="mbr-section-head mb-5">
                <h4 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                  <strong>Nasz Zespół</strong>
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="item features-image col-12 col-md-6 col-lg-3">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1541881856704-3c4b2896c0f8%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;IRFojKPMrLZwj9QltnE9v4FyCOxsDUjhxbKQSJBuwb4"/>
                </div>
                <div className="item-content align-left">
                  <h6 className="item-subtitle mbr-fonts-style display-5">
                    <strong>Krzysztof</strong></h6>
                  <p className="mbr-text mbr-fonts-style display-7">Administrator</p>
                </div>
              </div>
            </div>
            <div className="item features-image col-12 col-md-6 col-lg-3">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1636624498233-0c3c5ab4186e%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;rTpe4XhkeXPA0dkbU5yd9nx70QELeBArHeo1bLUpggc"/>
                </div>
                <div className="item-content align-left">
                  <h6 className="item-subtitle mbr-fonts-style display-5">
                    <strong>Anna</strong></h6>
                  <p className="mbr-text mbr-fonts-style display-7">Moderator</p>
                </div>
              </div>
            </div>
            <div className="item features-image col-12 col-md-6 col-lg-3">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1626899798511-c3eaacb02846%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;0Ur5K5NA4Bf4_elvfod-A4a9_BHSMSno_RgqsCtSe3s"/>
                </div>
                <div className="item-content align-left">
                  <h6 className="item-subtitle mbr-fonts-style display-5">
                    <strong>Marek</strong></h6>
                  <p className="mbr-text mbr-fonts-style display-7">Wsparcie Techniczne</p>
                </div>
              </div>
            </div>
            <div className="item features-image col-12 col-md-6 col-lg-3">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1589571739149-47ed80eae6ba%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;4xhPALmYJbA0N6x8zMF0bh_StCQxiZL2x4VyStEBP74"/>
                </div>
                <div className="item-content align-left">
                  <h6 className="item-subtitle mbr-fonts-style display-5">
                    <strong>Katarzyna</strong>
                  </h6>
                  <p className="mbr-text mbr-fonts-style display-7">Redaktor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Sekcja Opinie ------------*/}
      <section className="people04 cid-uXZuRd9MlR" id="testimonials-3-uXZuRd9MlR">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div className="col-12 mb-0 content-head">
              <h3 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                <strong>Opinie</strong>
              </h3>	
            </div>
          </div>
          <div className="row mbr-masonry" data-masonry="{&quot;percentPosition&quot;: true }">
            <div className="item features-without-image col-12 col-md-6 col-lg-4 active">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-text mbr-fonts-style display-7">
                    Niesamowite miejsce dla każdego fana motoryzacji! Znajdziesz tu wszystko, czego potrzebujesz.
                  </p>
                  <div className="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1519866663826-7e1967cb3eec%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;M89WK7IZdyI65nh5g9r1R1_F3DGShhYz9K9neDre9ko" data-slide-to="0" data-bs-slide-to="0"/>
                  </div>
                  <h5 className="card-title mbr-fonts-style display-7">
                    <strong>Jan Kowalski</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-text mbr-fonts-style display-7">
                    Świetna społeczność i mnóstwo fachowej wiedzy. Polecam każdemu miłośnikowi czterech kółek.
                  </p>
                  <div className="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1692558588242-57cec1e32bba%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;yZodbPrdh7c6WlSdCu8LFPnPv9G_9v_E-kvvfna_EiA" data-slide-to="1" data-bs-slide-to="1"/>
                  </div>
                  <h5 className="card-title mbr-fonts-style display-7">
                    <strong>Anna Nowak</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-text mbr-fonts-style display-7">
                    Znalazłem tu odpowiedzi na wszystkie moje pytania dotyczące tuningu.
                  </p>
                  <div className="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1492288991661-058aa541ff43%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;S2nF4I7YDevvRgrPa2RBjEUsHrIbZfRrFFKB4GcG0mc" data-slide-to="2" data-bs-slide-to="2"/>
                  </div>
                  <h5 className="card-title mbr-fonts-style display-7">
                    <strong>Piotr Wiśniewski</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-text mbr-fonts-style display-7">
                    Najlepsze forum motoryzacyjne w Polsce! Atmosfera jest fantastyczna.
                  </p>
                  <div className="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1592669546196-bb70d4f16dd7%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;6gzAF1UOoM7z_jo79zyBAvyNW_gmUU4yboFPGnOOdwk" data-slide-to="3" data-bs-slide-to="3"/>
                  </div>
                  <h5 className="card-title mbr-fonts-style display-7">
                    <strong>Katarzyna Jankowska</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-text mbr-fonts-style display-7">
                    Dzięki tej stronie poznałem wielu ludzi z podobnymi pasjami.
                  </p>
                  <div className="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1557684387-08927d28c72a%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;WzNS6dlp_WB7s_0UTQKv_a-56gb83AYqkoPZqeL-1xQ" data-slide-to="4" data-bs-slide-to="4"/>
                  </div>
                  <h5 className="card-title mbr-fonts-style display-7">
                    <strong>Marek Lewandowski</strong>
                  </h5>
                </div>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="card-box align-left">
                  <p className="card-text mbr-fonts-style display-7">
                    Profesjonalne porady i gorące dyskusje o najnowszych modelach aut.
                  </p>
                  <div className="img-wrapper mt-4 mb-3">
                    <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1593878934638-c280c318675d%3Fauto%3Dformat%26fit%3Dcrop%26w%3D600%26h%3D600%26q%3D80&amp;e&#x3D;1762560000&amp;s&#x3D;zMKxodeQleco9HRnIdKrs_EzWicUqJkjkXvW4xzi0v0" data-slide-to="5" data-bs-slide-to="5"/>
                  </div>
                  <h5 className="card-title mbr-fonts-style display-7">
                    <strong>Ewa Zielińska</strong>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------- Sekcja Dołącz do Nas -------------*/}
      <section className="header14 cid-uXZuRd9Tgq" id="call-to-action-10-uXZuRd9Tgq">
        <div className="container">
          <div className="row justify-content-center">
            <div className="card col-12 col-md-12 col-lg-10">
              <div className="card-wrapper">
                <div className="card-box align-center">
                  <h1 className="card-title mbr-fonts-style mb-4 display-1">
                    <strong>Dołącz do Nas!</strong>
                  </h1>
                  <p className="mbr-text mbr-fonts-style mb-4 display-7">
                    Zarejestruj się już dziś i stań się częścią naszej motoryzacyjnej rodziny.
                  </p>
                  <div className="mbr-section-btn mt-4">
                    <a className="btn btn-primary display-7" href="/register">
                      Zarejestruj Się
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------- Sekcja Formularz Kontaktowy -----------*/}
      <section className="header18 cid-uXZuRd9ToS mbr-fullscreen" data-bg-video="https://www.youtube.com/watch?v=J4t4pMZBXZg&t=2134s?autoplay=1&loop=1&playlist=CFE1VxLvA0o&t=20&mute=1&playsinline=1&controls=0&showinfo=0&autohide=1&allowfullscreen=true&mode=transparent" id="video-5-uXZuRd9ToS"
      >
        {/* Nakładka przyciemniająca */}
        <div
          className="mbr-overlay"
          style={{ opacity: 0.3, backgroundColor: "rgb(0, 0, 0)" }}
        ></div>

        {/* Formularz */}
        <div className="container-fluid2">
          <div className="form-overlay">
            <h3 className="form-title">
              <strong>Masz jakieś pytania?</strong>
            </h3>
            <p className="form-subtitle">Napisz do nas już teraz!</p>

            <form
              action="https://mobirise.eu/"
              method="POST"
              className="contact-form"
              data-form-title="Contact Form"
            >
              <div className="form-row">
                <input type="text" name="name" placeholder="Imię" required />
                <input type="email" name="email" placeholder="Email" required />
              </div>

              <textarea
                name="message"
                placeholder="Wiadomość"
                required
              ></textarea>

              <button type="submit" className="btn-submit">
                Wyślij
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --------- Sekcja Galeria ----------*/}
      <section className="gallery4 cid-uXZuRd95m6" id="gallery-12-uXZuRd95m6">
        <div className="container-fluid gallery-wrapper">
          <div className="grid-container">
            <div className="grid-container-1" style={{transform: "translate3d(-200px, 0px, 0px)"}}>
              <div className="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1758445048963-c8682c897428%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MTV8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;S2q1DvYJtPmdvC-sbluz_nmsjLgWR4W-rFBcqIT4n2o"/>
              </div>
              <div className="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1747842915877-b3ae5f45049f%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MXx8Y2FyJTIwY29tbXVuaXR5fGVufDB8MHx8fDE3NTg5Njc1MzV8MA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;rYJ7V84tWCEx7l14mHOM6b8EmKPBMjUo2J-BbNxPR5Q"/>
              </div>
              <div className="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1701789903841-d6395d23d1ae%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8N3x8Y2FyJTIwY29tbXVuaXR5fGVufDB8MHx8fDE3NTg5Njc1MzV8MA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;ppfiIdpeHYCmVoMEcuRhoCwe67z_9gWqXwbkK2BUqWQ"/>
              </div>
              <div className="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1666801360592-d367662f4822%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MjB8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;LqBINwgcHCq7fIXXBxZoOHF4Glmls9yZgi9_JIitOuk"/>
              </div>
            </div>
            <div className="grid-container-2" style={{transform: "translate3d(-70px, 0px, 0px)"}}>
              <div className="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1758620322904-a03ae6bdd1d4%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8Mjh8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;3WMHaDMgNkRBtIoeyUfCtrrj3AJwL-fgbIMU4tmk52w"/>
              </div>
              <div className="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1690310456640-90d64e9f7b18%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MTJ8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;quBvE1gHVe1a2A9rPW4NZ0I_FScoAyOb9kJMjV0QbvU"/>
              </div>
              <div className="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1758354973754-2921e70dee51%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MTF8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;VnHtLTgUcW9XJyArLdXBf3-ZXtRrtWqJKPfis9LoR0g"/>
              </div>
              <div className="grid-item">
                <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1597506292378-3aa2963570a4%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8Mjl8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU4OTY3NTM1fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;uBpGXKAQwME4xRAoht-2X5Mmlgpqy47kMmo8ttFNAQY"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------ Sekcja Stopka ------------*/}
      <section className="footer3 cid-uXZuRdagkn" id="footer-6-uXZuRdagkn">
        <div className="container">
          <div className="row">
            <div className="col-12 mt-4">
              <p className="mbr-fonts-style copyright display-7">
                Wszelkie prawa zastrzeżone © 2025 GaraZero
              </p>
            </div>
          </div>
        </div>
      </section>
      <ClientScripts/>
    </main>  
  );
}