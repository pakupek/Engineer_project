"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getToken } from "../../Services/auth";
import styles from "./VehicleDetails.module.css";

// Importy komponentów
import DamageForm from "./DamageForm";
import DamageHistory from "./DamageHistory";
import Timeline from "./TimeLine/TimeLine";
import TechnicalData from "./TechnicalData/TechnicalData";
import ServiceEntriesList from "./ServiceEntryList/ServiceEntriesList";
import ServiceEntryCreate from "./ServiceEntryCreate/ServiceEntryCreate";
import VehicleImages from "./VehicleImages/VehicleImages";
import { VehicleInformation, VehicleInformationOverlay } from "./VehicleInformation/VehicleInformation";

export default function CarDetails() {
  const { vin } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  // Jedno zapytanie do API
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:8000/api/vehicles/${vin}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`Błąd pobierania auta: ${response.status}`);

        const data = await response.json();
        setCar(data);
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vin) fetchCar();
  }, [vin]);

  if (loading) return <div className="p-6 text-gray-600">Ładowanie danych pojazdu...</div>;
  if (error) return <div className="p-6 text-red-500">Błąd: {error}</div>;
  if (!car) return <div className="p-6 text-gray-500">Nie znaleziono danych pojazdu.</div>;

  return (
    <>
      {/* Slider z obrazami auta */}
      <div className={styles.hero}>
        <VehicleImages car={car} />
        <VehicleInformationOverlay car={car} />
      </div>

      {/* Podstawowe informacje */}
      <VehicleInformation car={car} showMore={showMore} setShowMore={setShowMore} />

      {/* Dodatkowe sekcje po kliknięciu */}
      {showMore && (
        <>
          <TechnicalData vin={vin} />
          <Timeline vin={vin} />
          <ServiceEntriesList vin={vin} />
          <ServiceEntryCreate vin={vin} />
          <DamageForm/>
          <DamageHistory/>
        </>
      )}
    </>
  );
}
