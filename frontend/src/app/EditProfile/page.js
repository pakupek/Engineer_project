"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { authService, logout } from "../Services/auth.js";
import styles from "./EditProfile.module.css";
import DashboardLayout from "../DashboardLayout/page";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
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
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone);
      if (formData.password) formDataToSend.append("password", formData.password);
      if (avatarFile) formDataToSend.append("avatar", avatarFile);

      await authService.updateProfile(formDataToSend, true); 
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

    <DashboardLayout>
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

                <div className={styles.epFormRow}>
                  <label className={styles.epLabel}>Zdjęcie profilowe</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                    className={styles.epInput}
                  />
                  {user.avatar && (
                    <img
                      src={`http://localhost:8000${user.avatar}`}
                      alt="Avatar"
                      className={styles.epAvatarPreview}
                    />
                  )}
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

                </div>
            </aside>
            </div>
        </main>
    </DashboardLayout>
  );
}
