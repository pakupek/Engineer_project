"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "../services/auth";
import styles from "./Login.module.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login(form.username, form.password); // To zapisze token w localStorage
      alert("Logowanie udane!");
      router.push("/home"); // lub gdzie chcesz przekierować
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.detail || "Błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Overlay z blurem na całym tle */}
      <div className={styles.backgroundOverlay}></div>

      {/* Kontener z formularzem i boxem ze zdjęciem */}
      <div className={styles.contentWrapper}>
        {/* Główny kontener - formularz + zdjęcie obok */}
        <div className={styles.mainBox}>
          {/* Lewa strona - formularz logowania */}
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <h2 className={styles.loginTitle}>Logowanie</h2>
              
              <div className={styles.inputGroup}>
                <input
                  placeholder="Nazwa użytkownika"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={styles.loginInput}
                />
                <input
                  type="password"
                  placeholder="Hasło"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={styles.loginInput}
                />
              </div>
              
              <button type="submit" className={styles.loginButton}>
                Zaloguj się
              </button>

              <div className={styles.loginFooter}>
                <p>Nie masz konta? <a href="/register" className={styles.registerLink}>Zarejestruj się</a></p>
              </div>
            </form>
          </div>

          {/* Prawa strona - box z oryginalnym zdjęciem */}
          <div className={styles.imageSection}>
            <div className={styles.imageOverlay}>
              <div className={styles.imageContent}>
                <h3>GaraZero</h3>
                <p>Dołącz do społeczności miłośników samochodów</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}