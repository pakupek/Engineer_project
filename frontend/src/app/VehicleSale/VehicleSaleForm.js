"use client";

import React, { useState, useEffect } from "react";
import { getToken } from "../services/auth";
import style from "./VehicleSaleForm.module.css";

export default function VehicleSaleForm({ vin, onSaleCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [vehicleData, setVehicleData] = useState(null);
  const API_URL = 'backend-production-0265.up.railway.app';

  // Pobierz dane pojazdu
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_URL}/api/vehicles/${vin}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setVehicleData(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (vin) fetchVehicle();
  }, [vin]);

  // Wyślij ogłoszenie na backend
  const handleSubmit = async (e) => {
    e.preventDefault();

  try {
    const token = getToken();
    const body = JSON.stringify({
      title,
      description,
      price,
      vehicle: vin 
    });

    const response = await fetch(`${API_URL}/api/sales/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const err = await response.json();
      console.error(err);
      alert("❌ Nie udało się dodać ogłoszenia");
      return;
    }

    alert("✅ Pojazd wystawiony na sprzedaż!");
    onSaleCreated?.();
  } catch (err) {
    console.error(err);
    alert("❌ Błąd połączenia z serwerem");
  }
  };

  if (!vehicleData) return <div>Ładowanie danych pojazdu...</div>;

  return (
    <div className={style["sale-form-container"]}>
      <h2>Wystaw pojazd na sprzedaż</h2>
      <form onSubmit={handleSubmit} className={style["sale-form"]}>
        <div className={style["form-group"]}>
          <label>Tytuł ogłoszenia</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label>Opis ogłoszenia</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label>Cena (PLN)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={style["submit-btn"]}>
          Wystaw pojazd
        </button>
      </form>

      
    </div>
  );
}
