"use client";
import { useState, useEffect } from "react";
import { User, LogOut, Settings, Home, Loader2 } from "lucide-react";
import { authService, logout } from "../services/auth";
import styles from "./Profile.module.css";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    } catch (error) {
      console.error("Błąd ładowania profilu:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // wywołujemy funkcję logout z serwisu
      logout();
    } catch (error) {
      console.error("Błąd podczas wylogowania:", error);
    } finally {
      setLoading(false);
    }
  };

  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <User className={styles.sidebarIcon} />
          <h2 className={styles.sidebarTitle}>Panel Użytkownika</h2>
        </div>

        <nav className={styles.sidebarNav}>
          <a href="/profile" className={`${styles.navLink} ${styles.active}`}>
            <Home size={20} /> <span>Dashboard</span>
          </a>
          <a href="/EditProfile" className={styles.navLink}>
            <Settings size={20} /> <span>Edytuj profil</span>
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Wylogowywanie...
            </>
          ) : (
            <>
              <LogOut size={20} /> Wyloguj się
            </>
          )}
        </button>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        <h1 className={styles.mainTitle}>
          Witaj, {user.first_name} 👋
        </h1>

        {/* Statystyki */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Liczba logowań</h3>
            <p className={styles.statValue}>
              {user.login_count ?? 14}
            </p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Ostatnia aktywność</h3>
            <p className={styles.statValueGray}>
              {user.last_login ?? "brak danych"}
            </p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Konto utworzono</h3>
            <p className={styles.statValueGray}>
              {user.created_at ?? "nieznane"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
