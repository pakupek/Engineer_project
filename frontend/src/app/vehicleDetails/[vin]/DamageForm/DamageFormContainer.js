"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getToken } from "../../../Services/auth";
import DamageForm from "./DamageForm";

export default function DamageFormContainer({ damageToEdit, onEditComplete}) {
  const { vin } = useParams();
  const [markers, setMarkers] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("drobne");

  // 📌 Wczytaj istniejące markery przy edycji
  useEffect(() => {
    if (damageToEdit) {
      // Głębokie skopiowanie tablicy markerów (aby zachować referencje)
      const existingMarkers = damageToEdit.markers
        ? JSON.parse(JSON.stringify(damageToEdit.markers))
        : [];
      setMarkers(existingMarkers);
      setSelectedSeverity(existingMarkers?.[0]?.severity || "drobne");
    } else {
      setMarkers([]);
    }
  }, [damageToEdit]);

  // Dodawanie markera (kliknięcie na obrazku)
  const handleAddMarker = ({ x, y }) => {
    const newMarker = {
      x_percent: x,
      y_percent: y,
      severity: selectedSeverity,
    };
    setMarkers((prev) => [...prev, newMarker]);
  };

  // Obsługa formularza (wysyłanie danych do backendu)
  const handleAddDamage = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    formData.append("vin", vin);
    formData.append("markers", JSON.stringify(markers)); // zawsze wysyłamy aktualne markery

    const token = getToken();
    const isEditing = Boolean(damageToEdit);

    const url = isEditing
      ? `http://localhost:8000/api/damage-entry/${vin}/${damageToEdit.id}/`
      : `http://localhost:8000/api/damage-entry/${vin}/`;

    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("❌ Błąd API:", err);
        alert("❌ Operacja nie powiodła się");
        return;
      }

      alert(isEditing ? "✅ Zmiany zapisane!" : "✅ Szkoda dodana!");
      e.target.reset();
      setMarkers([]);
      onEditComplete?.(); // odświeżenie listy szkód
    } catch (err) {
      console.error("❌ Błąd połączenia:", err);
      alert("❌ Błąd połączenia z serwerem");
    }
  };

  return (
    <DamageForm
      handleAddDamage={handleAddDamage}
      handleAddMarker={handleAddMarker}
      markers={markers}
      selectedSeverity={selectedSeverity}
      setSelectedSeverity={setSelectedSeverity}
      damageToEdit={damageToEdit}
    />
  );
}
