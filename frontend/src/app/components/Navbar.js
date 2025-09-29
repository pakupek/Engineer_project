// components/Navbar.js
"use client";

export default function Navbar() {
  return (
    <main>
      <section className="menu menu2 cid-uYaLNgWuYz" data-once="menu" id="menu-5-uYaLNgWuYz">
        <nav className="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
          <div className="container">
            <div className="navbar-brand">
              <span className="navbar-logo">
                <a href="/home">
                  <img src="https://proxy.electricblaze.com/?u&#x3D;https%3A%2F%2Fimages.unsplash.com%2Fphoto-1517213830215-ad88cda1f131%3Fixid%3DM3w0Mzc5fDB8MXxzZWFyY2h8MjZ8fGNhciUyMGNvbW11bml0eXxlbnwwfDB8fHwxNzU5MTMxOTU0fDA%26ixlib%3Drb-4.1.0%26auto%3Dformat%26fit%3Dcrop%26w%3D1200%26q%3D50&amp;e&#x3D;1762560000&amp;s&#x3D;7VBik08FXhMY8xd81D_5a2IHp_9J83hAJqG5TK0p9EQ" style={{ height: '4.3rem' }}/>
                </a>
              </span>
              <span className="navbar-caption-wrap">
                <a className="navbar-caption text-black display-4" href="/home">GaraZero</a>
              </span>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
              data-bs-toggle="collapse" data-target="#navbarSupportedContent"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarNavAltMarkup" aria-expanded="false"
              aria-label="Toggle navigation">
              <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            
              <ul className="navbar-nav" data-app-modern-menu="true">
                <li className="nav-item">
                  <a className="nav-link link text-black display-4" href="/discussion">Forum</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link link text-black display-4" href="/messages"
                    aria-expanded="false">Wiadomości</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link link text-black display-4" href="/login">Zaloguj się</a>
                </li>
              </ul>
              <div className="navbar-buttons mbr-section-btn">
                <a className="btn btn-primary display-4" href="/register">Dołącz teraz</a>
              </div>
            
          </div>
        </nav>
      </section>
    </main>
  );
}