"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "../../../Services/auth";
import DamageForm from "./DamageForm";

export default function DamageFormContainer() {
  const { vin } = useParams();
  const [markers, setMarkers] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("drobne");

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
    formData.append("markers", JSON.stringify(markers));

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8000/api/damage-entry/${vin}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        alert("❌ Nie udało się dodać szkody");
        return;
      }

      alert("✅ Szkoda została dodana!");
      e.target.reset();
      setMarkers([]);
      
    } catch (err) {
      console.error(err);
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
    />
  );
}
