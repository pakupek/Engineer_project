"use client";
import { useState, useEffect } from "react";
import { User, LogOut, Settings, Home, Loader2 } from "lucide-react";
import { authService, logout } from "../Services/auth";
import styles from "./Profile.module.css"
import UserVehicleSalesList from "./UserVehicleSalesList";

import DashboardLayout from "../DashboardLayout/page";

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
    <DashboardLayout onLogout={handleLogout} loading={loading}>{/* Main content */}
      <nav className={styles.sidebarNav}>
          <a href="/profile" className={`${styles.navLink} ${styles.active}`}>
            <Home size={20} /> <span>Dashboard</span>
          </a>
      </nav>

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
        {/* Sekcja z autami użytkownika */}
          <section className={styles.userSalesSection}>
            <UserVehicleSalesList />
          </section>
      </main>
    </DashboardLayout>
  );
}
