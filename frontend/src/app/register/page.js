"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth";
import styles from './Register.module.css';

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password2: ""
  });
  const [errors, setErrors] = useState({});
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://engineer-project.onrender.com';

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Nazwa użytkownika jest wymagana";
    else if (form.username.length < 3) newErrors.username = "Nazwa użytkownika musi mieć co najmniej 3 znaki";

    if (!form.email.trim()) newErrors.email = "Email jest wymagany";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email jest nieprawidłowy";

    if (!form.phone_number.trim()) newErrors.phone_number = "Numer telefonu jest wymagany";
    else if (!/^(\+48\s?\d{3}\s?\d{3}\s?\d{3}|\d{3}\s?\d{3}\s?\d{3})$/.test(form.phone_number))
      newErrors.phone_number = "Numer telefonu jest nieprawidłowy";

    if (!form.password) newErrors.password = "Hasło jest wymagane";
    else if (form.password.length < 6) newErrors.password = "Hasło musi mieć co najmniej 6 znaków";

    if (form.password !== form.password2) newErrors.password2 = "Hasła nie są identyczne";

    return newErrors;
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  // Wyślij kod weryfikacyjny
  const handleSendCode = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });

      if (!res.ok) throw new Error("Błąd wysyłki kodu");
      console.log('🔍 API_URL:', API_URL);
      setVerificationStep(true);
      alert("Kod weryfikacyjny został wysłany na Twój email");
    } catch (err) {
      alert(err.message);
    }
  };

  // Rejestracja użytkownika po weryfikacji kodu
  const handleRegister = async () => {
    try {
      await authService.register({ ...form, verification_code: verificationCode });
      alert("Rejestracja zakończona pomyślnie!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.contentWrapper}>
        <div className={styles.mainBox}>
          <div className={styles.formSection}>
            <form className={styles.registerForm} onSubmit={e => e.preventDefault()}>
              <h2 className={styles.registerTitle}>Rejestracja</h2>

              {!verificationStep ? (
                <div className={styles.inputGroup}>
                  <div className={styles.inputField}>
                    <input
                      placeholder="Nazwa użytkownika"
                      value={form.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={`${styles.registerInput} ${errors.username ? styles.inputError : ''}`}
                    />
                    {errors.username && <span className={styles.errorText}>{errors.username}</span>}
                  </div>

                  <div className={styles.inputField}>
                    <input
                      type="email"
                      placeholder="Adres email"
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`${styles.registerInput} ${errors.email ? styles.inputError : ''}`}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>

                  <div className={styles.inputField}>
                    <input
                      type="tel"
                      placeholder="Numer telefonu (np. +48 123 456 789)"
                      value={form.phone_number}
                      onChange={(e) => handleInputChange("phone_number", e.target.value)}
                      className={`${styles.registerInput} ${errors.phone_number ? styles.inputError : ''}`}
                    />
                    {errors.phone_number && <span className={styles.errorText}>{errors.phone_number}</span>}
                  </div>

                  <div className={styles.inputField}>
                    <input
                      type="password"
                      placeholder="Hasło"
                      value={form.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`${styles.registerInput} ${errors.password ? styles.inputError : ''}`}
                    />
                    {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                  </div>

                  <div className={styles.inputField}>
                    <input
                      type="password"
                      placeholder="Potwierdź hasło"
                      value={form.password2}
                      onChange={(e) => handleInputChange("password2", e.target.value)}
                      className={`${styles.registerInput} ${errors.password2 ? styles.inputError : ''}`}
                    />
                    {errors.password2 && <span className={styles.errorText}>{errors.password2}</span>}
                  </div>

                  <button type="button" className={styles.registerButton} onClick={handleSendCode}>
                    Zarejestruj się
                  </button>
                </div>
              ) : (
                <div className={styles.inputGroup}>
                  <div className={styles.inputField}>
                    <input
                      placeholder="Wpisz kod weryfikacyjny"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className={`${styles.registerInput} ${errors.verification_code ? styles.inputError : ''}`}
                    />
                    {errors.verification_code && <span className={styles.errorText}>{errors.verification_code}</span>}
                  </div>
                  <button type="button" className={styles.registerButton} onClick={handleRegister}>
                    Potwierdź rejestrację
                  </button>
                </div>
              )}

              <div className={styles.registerFooter}>
                <p>Masz już konto? <a href="/login" className={styles.loginLink}>Zaloguj się</a></p>
              </div>
            </form>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageOverlay}>
              <div className={styles.imageContent}>
                <h3>Dołącz do GaraZero</h3>
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
