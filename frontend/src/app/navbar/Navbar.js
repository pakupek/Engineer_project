"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { authService, getCurrentUser } from '../Services/auth';

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

  const getUserInitials = () => {
    if (!user) return 'U';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    
    if (user.username) {
      return user.username[0].toUpperCase();
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U';
  };

  // Funkcja do ręcznego wywołania aktualizacji (można wywołać z innych komponentów)
  const refreshAuthStatus = () => {
    checkAuthStatus();
  };

  // Eksport funkcji do globalnego dostępu
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.refreshNavbar = refreshAuthStatus;
    }
  }, []);
  
  return (
    <main>
      <section className="menu menu2 cid-uYaLNgWuYz" id="menu-5-uYaLNgWuYz">
        <nav className="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
          <div className="container">
            <div className="navbar-brand">
              <span className="navbar-logo">
                <a href="/home">
                  <img src="/images/logo.jpg" style={{ height: '4.3rem', borderRadius: '2rem' }} alt="GaraZero"/>
                </a>
              </span>
              <span className="navbar-caption-wrap">
                <a className="navbar-caption text-black display-4" href="/home">GaraZero</a>
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
                  <a className="nav-link link text-black display-4" href="/home">Strona główna</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link link text-black display-4" href="/discussion">Forum</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link link text-black display-4" href="/messages">Wiadomości</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link link text-black display-4" href="/marketplace">Ogłoszenia</a>
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
                      {user?.avatar ? (
                        <img 
                          src={user.avatar}  
                          alt="Avatar" 
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
                        />
                      ) : (
                        <span>{getUserInitials()}</span>
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
                    <a className="btn btn-primary display-4 login-btn" href="/login">Logowanie</a>
                    <a className="btn btn-primary display-4 register-btn" href="/register">Rejestracja</a>
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