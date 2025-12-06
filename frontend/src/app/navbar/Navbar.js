"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { authService, getCurrentUser } from '../Services/auth';
import Image from "next/image";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Nasłuchuj zmian autoryzacji (np. po zalogowaniu)
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    // Dodaj event listener dla zmian autoryzacji
    window.addEventListener('authChange', handleAuthChange);
    
    // Zamknij dropdown przy kliknięciu na zewnątrz
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Jeśli błąd, ustaw jako niezalogowany
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setIsDropdownOpen(false);
    
    // Wywołaj event aby inne komponenty wiedziały o wylogowaniu
    window.dispatchEvent(new Event('authChange'));
    
    // Przekierowanie po wylogowaniu
    window.location.href = '/home';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };


  // Funkcja do ręcznego wywołania aktualizacji
  const refreshAuthStatus = () => {
    checkAuthStatus();
  };

  // Eksport funkcji do globalnego dostępu
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.refreshNavbar = refreshAuthStatus;
    }
  }, [refreshAuthStatus]);

  
  return (
    <main>
      <section className="menu menu2 cid-uYaLNgWuYz" id="menu-5-uYaLNgWuYz">
        <nav className="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
          <div className="container">
            <div className="navbar-brand">
              <span className="navbar-logo">
                <Link href="/home">
                  <Image
                    src="/images/logo.jpg"
                    alt="GaraZero"
                    width={69}
                    height={69}
                    style={{ borderRadius: '2rem' }}
                  />
                </Link>
              </span>
              <span className="navbar-caption-wrap">
                <Link className="navbar-caption text-black display-4" href="/home">GaraZero</Link>
              </span>
            </div>
            
            <button className="navbar-toggler" type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation">
              <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav nav-dropdown nav-right me-auto" data-app-modern-menu="true">
                <li className="nav-item">
                  <Link className="nav-link link text-black display-4" href="/home">Strona główna</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link link text-black display-4" href="/Forum">Forum</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link link text-black display-4" href="/messages">Wiadomości</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link link text-black display-4" href="/marketplace">Ogłoszenia</Link>
                </li>
              </ul>

              <div className="navbar-buttons mbr-section-btn">
                {isAuthenticated ? (
                  // Dla zalogowanych użytkowników - avatar z dropdown
                  <div className="user-menu position-relative" ref={dropdownRef}>
                    {/* Avatar */}
                    <button
                      className="avatar-btn"
                      onClick={toggleDropdown}
                      onMouseEnter={() => setIsDropdownOpen(true)}
                    >
                      {user ? (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                      ) : (
                        <img
                          src="/default-avatar.png"
                          alt="Default Avatar"
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                      )}
                    </button>


                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div 
                        className="user-dropdown"
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        {/* Nagłówek z informacjami użytkownika */}
                        <div className="dropdown-header">
                          <div className="user-name">{user?.first_name && user?.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user?.username || user?.email || 'Użytkownik'}
                          </div>
                          <div className="user-email">{user?.email}</div>
                        </div>

                        {/* Link do profilu */}
                        <Link 
                          href="/profile" 
                          className="dropdown-item"
                          onClick={closeDropdown}
                        >
                          <span className="dropdown-item-icon">👤</span>
                          Mój profil
                        </Link>

                        {/* Link do ustawień */}
                        <Link 
                          href="/settings" 
                          className="dropdown-item"
                          onClick={closeDropdown}
                        >
                          <span className="dropdown-item-icon">⚙️</span>
                          Ustawienia
                        </Link>

                        {/* Separator */}
                        <div className="dropdown-divider"></div>

                        {/* Przycisk wylogowania */}
                        <button
                          onClick={handleLogout}
                          className="dropdown-item logout-btn"
                        >
                          <span className="dropdown-item-icon">🚪</span>
                          Wyloguj się
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Dla niezalogowanych użytkowników - przyciski logowania i rejestracji
                  <div className="auth-buttons">
                    <Link className="btn btn-primary display-4 login-btn" href="/login">Logowanie</Link>
                    <Link className="btn btn-primary display-4 register-btn" href="/register">Rejestracja</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </section>
    </main>
  );
}