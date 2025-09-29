// app/register/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../services/api";
import styles from './Register.module.css';

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Nazwa użytkownika jest wymagana";
    } else if (form.username.length < 3) {
      newErrors.username = "Nazwa użytkownika musi mieć co najmniej 3 znaki";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email jest nieprawidłowy";
    }

    if (!form.password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (form.password.length < 6) {
      newErrors.password = "Hasło musi mieć co najmniej 6 znaków";
    }

    if (form.password !== form.password2) {
      newErrors.password2 = "Hasła nie są identyczne";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await register(form);
      alert("Rejestracja udana!");
      router.push("/login");
    } catch (err) {
      alert(err.response?.data || "Błąd rejestracji");
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Usuń błąd dla danego pola gdy użytkownik zaczyna pisać
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className={styles.registerContainer}>
      {/* Overlay z blurem na całym tle */}
      <div className={styles.backgroundOverlay}></div>

      {/* Kontener z formularzem i boxem ze zdjęciem */}
      <div className={styles.contentWrapper}>
        {/* Główny kontener - formularz + zdjęcie obok */}
        <div className={styles.mainBox}>
          {/* Lewa strona - formularz rejestracji */}
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
              <h2 className={styles.registerTitle}>Rejestracja</h2>
              
              <div className={styles.inputGroup}>
                <div className={styles.inputField}>
                  <input
                    placeholder="Nazwa użytkownika"
                    value={form.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`${styles.registerInput} ${errors.username ? styles.inputError : ''}`}
                  />
                  {errors.username && <span className={styles.errorText}>{errors.username}</span>}
                </div>

                <div className={styles.inputField}>
                  <input
                    type="email"
                    placeholder="Adres email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`${styles.registerInput} ${errors.email ? styles.inputError : ''}`}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.inputField}>
                  <input
                    type="password"
                    placeholder="Hasło"
                    value={form.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`${styles.registerInput} ${errors.password ? styles.inputError : ''}`}
                  />
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>

                <div className={styles.inputField}>
                  <input
                    type="password"
                    placeholder="Potwierdź hasło"
                    value={form.password2}
                    onChange={(e) => handleInputChange('password2', e.target.value)}
                    className={`${styles.registerInput} ${errors.password2 ? styles.inputError : ''}`}
                  />
                  {errors.password2 && <span className={styles.errorText}>{errors.password2}</span>}
                </div>
              </div>
              
              <button type="submit" className={styles.registerButton}>
                Zarejestruj się
              </button>

              <div className={styles.registerFooter}>
                <p>Masz już konto? <a href="/login" className={styles.loginLink}>Zaloguj się</a></p>
              </div>
            </form>
          </div>

          {/* Prawa strona - box z oryginalnym zdjęciem */}
          <div className={styles.imageSection}>
            <div className={styles.imageOverlay}>
              <div className={styles.imageContent}>
                <h3>Dołącz do AutoMania</h3>
                <p>Stwórz konto i dołącz do społeczności miłośników samochodów</p>
                <ul className={styles.benefitsList}>
                  <li>✅ Dostęp do forum dyskusyjnego</li>
                  <li>✅ Śledzenie historii swojego pojazdu</li>
                  <li>✅ Ekskluzywne treści i porady</li>
                  <li>✅ Społeczność pasjonatów</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}