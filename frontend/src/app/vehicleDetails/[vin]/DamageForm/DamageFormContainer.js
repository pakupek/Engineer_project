"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getToken } from "../../../services/auth";
import DamageForm from "./DamageForm";

export default function DamageFormContainer({ damageToEdit, onEditComplete}) {
  const { vin } = useParams();
  const [markers, setMarkers] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("drobne");
  const API_URL = 'https://backend-production-8ce8.up.railway.app';

  // Wczytaj istniejące markery przy edycji
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
  const handleAddDamage = async (e, damageData) => {
    e.preventDefault(); 
    const formData = new FormData();

    formData.append("vin", vin);
    formData.append("markers", JSON.stringify(markers));
    formData.append("date", damageData.date);
    formData.append("description", damageData.description);
    formData.append("severity", damageData.severity);

    // POPRAWIONE: Wyślij existingPhotos jako JSON string
    formData.append("existingPhotos", JSON.stringify(damageData.existingPhotos));

    // Wyślij new_photos jako pliki
    damageData.newPhotos.forEach(photo => {
      formData.append("new_photos", photo); 
    });

    const token = getToken();
    const isEditing = Boolean(damageToEdit);

    const url = isEditing
      ? `${API_URL}/api/damage-entry/${vin}/${damageToEdit.id}/`
      : `${API_URL}/api/damage-entry/${vin}/`;

    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        alert("Operacja nie powiodła się: " + (response.detail || JSON.stringify(response)));
        return;
      }

      alert(isEditing ? "Zmiany zapisane!" : "Szkoda dodana!");
      e.target.reset();
      setMarkers([]);
      onEditComplete?.();
    } catch (err) {
      console.error("Błąd połączenia:", err);
      alert("Błąd połączenia z serwerem");
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
