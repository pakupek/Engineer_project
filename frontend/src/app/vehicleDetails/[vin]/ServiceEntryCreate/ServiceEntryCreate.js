"use client";

import { useState, useEffect } from "react";
import { getToken } from "../../../services/auth";
import style from "./ServiceEntry.module.css";

export default function ServiceEntryCreate({ vin, editingEntry, onSave }) {
  const [formData, setFormData] = useState({
    description: "",
    mileage: "",
    date: "",
    cost: "",
    invoice_image: null,
  });
  const API_URL = 'https://backend-production-8ce8.up.railway.app';

  // 🔹 Gdy kliknięto "Edytuj" — wypełnij formularz danymi wpisu
  useEffect(() => {
    if (editingEntry) {
      setFormData({
        description: editingEntry.description || "",
        mileage: editingEntry.mileage || "",
        date: editingEntry.date || "",
        cost: editingEntry.cost || "",
        invoice_image: null, // Nie wypełniamy pola pliku
      });
    } else {
      // Tryb dodawania — czyścimy formularz
      setFormData({
        description: "",
        mileage: "",
        date: "",
        cost: "",
        invoice_image: null,
      });
    }
  }, [editingEntry]);

  // 🔹 Obsługa zmian pól formularza
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Obsługa wysłania formularza (POST / PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      const requestData = new FormData();

      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          requestData.append(key, formData[key]);
        }
      }

      const isEditing = !!editingEntry;
      const url = isEditing
        ? `${API_URL}/api/service-entry/${vin}/${editingEntry.id}/`
        : `${API_URL}/api/service-entry/${vin}/`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: requestData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Błąd: ${response.status}`);
      }

      alert(isEditing ? "Wpis został zaktualizowany!" : "Wpis został dodany!");
      setFormData({
        description: "",
        mileage: "",
        date: "",
        cost: "",
        invoice_image: null,
      });

      if (onSave) onSave(); 

    } catch (err) {
      console.error("Błąd:", err);
      alert("❌ Wystąpił problem podczas zapisu wpisu");
    }
  };

  return (
    <div className={style["service-form"]}>
      <h2 className={style["form-title"]}>
        {editingEntry ? "Edytuj wpis serwisowy" : "Dodaj wpis serwisowy"}
      </h2>

      <form onSubmit={handleSubmit} className={style["form-container"]}>
        <div className={style["form-group"]}>
          <label>Opis serwisu</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            maxLength={500}
            onChange={handleChange}
            required
          />

          {/* Licznik znaków */}
          <div className={style["char-counter"]}>
            {formData.description.length}/500
          </div>
        </div>


        <div className={style["form-group"]}>
          <label>Przebieg (km) *</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label>Data wykonania *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label>Koszt (PLN)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className={style["form-group"]}>
          <label>Zdjęcie faktury</label>
          <input type="file" name="invoice_image" accept="image/*" onChange={handleChange} />
        </div>

        <button type="submit" className={style["submit-btn"]}>
          {editingEntry ? "💾 Zapisz zmiany" : "➕ Dodaj wpis"}
        </button>
      </form>
    </div>
  );
}
