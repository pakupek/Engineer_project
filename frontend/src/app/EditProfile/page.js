"use client";
import { useState, useEffect } from "react";
import { User, LogOut, Settings, Home, Loader2 } from "lucide-react";
import { authService, logout } from "../services/auth";
import styles from "./EditProfile.module.css";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
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
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone_number || "",
        password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) delete dataToUpdate.password;
      await authService.updateProfile(dataToUpdate);
      setMessage("✅ Profil został zaktualizowany!");
      await loadProfile();
    } catch (error) {
      console.error("Błąd aktualizacji profilu:", error);
      setMessage("❌ Błąd aktualizacji profilu");
    } finally {
      setLoading(false);
    }
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
      <div className="ep-center-screen">
        <Loader2 className="ep-loader" />
      </div>
    );
  }

  return (
    <div className={styles.epPage}>
      <aside className={styles.epSidebar}>
        <div className={styles.epSidebarHeader}>
          <User className={styles.epIcon} />
          <h2 className={styles.epTitle}>Panel Użytkownika</h2>
        </div>

        <nav className={styles.epNav}>
          <a href="/profile" className={styles.epNavLink}>
            <Home size={18} /> 
            <span>Dashboard</span>
          </a>
          <a href="/editProfile" className={`${styles.epNavLink} ${styles.active}`}>
            <Settings size={18} /> 
            <span>Edytuj profil</span>
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className={styles.epLogoutBtn}
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

      <main className={styles.epMain}>
        <h1 className={styles.epHeading}>Witaj, {user.username} 👋</h1>

        <div className={styles.epGrid}>
          {/* Formularz edycji */}
          <section className={styles.epCard}>
            <h2 className={styles.epCardTitle}>Edytuj profil</h2>

            {message && (
              <div
                className={
                  message.includes("Błąd")
                    ? "ep-message ep-message-error"
                    : "ep-message ep-message-success"
                }
                role="status"
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.epForm}>
              <div className={styles.epFormRow}>
                <label className={styles.epLabel}>Nazwa użytkownika</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={styles.epInput}
                />
              </div>

              <div className={styles.epFormRow}>
                <label className={styles.epLabel}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.epInput}
                />
              </div>

              <div className={styles.epFormRow}>
                <label className={styles.epLabel}>Numer telefonu</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={styles.epInput}
                />
              </div>

              <div className={styles.epFormRow}>
                <label className={styles.epLabel}>Hasło</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Wpisz nowe hasło"
                  className={styles.epInput}
                />
              </div>

              <div className={styles.epFormActions}>
                <button
                  type="submit"
                  className={styles.epButton}
                  disabled={loading}
                >
                  {loading ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>
              </div>
            </form>
          </section>

          {/* Podgląd danych */}
          <aside className={styles.epCard.epPreview}>
            <h2 className={styles.epCardTitle}>Aktualne dane profilu</h2>

            <div className={styles.epPreviewList}>
              <div className={styles.epPreviewItem}>
                <div className={styles.epPreviewLabel}>Nazwa użytkownika</div>
                <div className={styles.epPreviewValue}>{user.username}</div>
              </div>

              <div className={styles.epPreviewItem}>
                <div className={styles.epPreviewLabel}>Email</div>
                <div className={styles.epPreviewValue}>{user.email}</div>
              </div>

              <div className={styles.epPreviewItem}>
                <div className={styles.epPreviewLabel}>Numer telefonu</div>
                <div className={styles.epPreviewValue}>{user.phone_number || "—"}</div>
              </div>

              <div className={styles.epPreviewItem}>
                <div className={styles.epPreviewLabel}>Ostatnie logowanie</div>
                <div className={styles.epPreviewValue}>
                  {user.last_login || "Brak danych"}
                </div>
              </div>

              <div className={styles.epPreviewItem}>
                <div className={styles.epPreviewLabel}>Konto utworzono</div>
                <div className={styles.epPreviewValue}>
                  {user.created_at || "Nieznane"}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
