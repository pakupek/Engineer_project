"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDiscussion } from "../../services/api";
import styles from './CreateDiscussion.module.css';

export default function CreateDiscussion() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "OGOLNE"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Sprawdź autoryzację przy załadowaniu komponentu
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Musisz być zalogowany, aby utworzyć dyskusję");
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const categories = [
    { value: "OGOLNE", label: "Ogólne" },
    { value: "TECHNICZNE", label: "Techniczne pytania" },
    { value: "PORADY", label: "Porady mechaniczne" },
    { value: "RECENZJE", label: "Recenzje samochodów" },
    { value: "TUNING", label: "Tuning" },
    { value: "ELEKTRO", label: "Elektromobilność" },
    { value: "HISTORIA", label: "Motoryzacja historyczna" }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Tytuł jest wymagany";
    } else if (form.title.length < 5) {
      newErrors.title = "Tytuł musi mieć co najmniej 5 znaków";
    } else if (form.title.length > 200) {
      newErrors.title = "Tytuł nie może przekraczać 200 znaków";
    }

    if (!form.content.trim()) {
      newErrors.content = "Treść dyskusji jest wymagana";
    } else if (form.content.length < 10) {
      newErrors.content = "Treść musi mieć co najmniej 10 znaków";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert("Musisz być zalogowany, aby utworzyć dyskusję");
      router.push('/login');
      return;
    }
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await createDiscussion(form);
      alert("Dyskusja została utworzona pomyślnie!");
      router.push(`/discussion/`);
      
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        alert("Sesja wygasła. Zaloguj się ponownie.");
        router.push('/login');
      } else {
        alert(error.response?.data?.detail || "Błąd podczas tworzenia dyskusji");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Jeśli użytkownik nie jest zalogowany, pokaż komunikat
  if (!isAuthenticated) {
    return (
      <div className={styles.createContainer}>
        <div className={styles.backgroundOverlay}></div>
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.loadingState}>
              <p>Sprawdzanie autoryzacji...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.createContainer}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.headerSection}>
            <h1 className={styles.pageTitle}>Nowa Dyskusja</h1>
            <p className={styles.pageSubtitle}>Podziel się swoją wiedzą i doświadczeniem z innymi miłośnikami motoryzacji</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.discussionForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tytuł dyskusji *</label>
              <input
                type="text"
                placeholder="Wprowadź tytuł dyskusji..."
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`${styles.formInput} ${errors.title ? styles.inputError : ''}`}
                maxLength={200}
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
              <div className={styles.charCount}>
                {form.title.length}/200 znaków
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Kategoria *</label>
              <select
                value={form.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={styles.formSelect}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Treść dyskusji *</label>
              <textarea
                placeholder="Opisz szczegółowo temat dyskusji..."
                value={form.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className={`${styles.formTextarea} ${errors.content ? styles.inputError : ''}`}
                rows={12}
              />
              {errors.content && <span className={styles.errorText}>{errors.content}</span>}
              <div className={styles.charCount}>
                {form.content.length} znaków
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={loading}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className={styles.loadingSpinner}></div>
                    Tworzenie...
                  </>
                ) : (
                  'Utwórz dyskusję'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}