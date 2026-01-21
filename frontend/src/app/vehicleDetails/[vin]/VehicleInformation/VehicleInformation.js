"use client";

import styles from "./VehicleInformation.module.css";
import "./VehicleInformation.css";
import VehicleSaleForm from "../../../VehicleSale/VehicleSaleForm.js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../../services/auth";
import EditVehicle from "../EditVehicle/EditVehicle.js";

export function VehicleInformationOverlay({ car }){
    return (
        <div className={styles.overlay}>
        {/* Overlay z podstawowymi danymi */}
            <div className={styles.leftColumn}>
                <span className={styles.leftSmall}>Marka</span>
                <span className={styles.left}>{car.generation?.model?.make?.name}</span>
            </div>

            <div className={styles.rightGroup}>
                <div className={styles.rightColumn}>
                    <span className={styles.rightSmall}>Model</span>
                    <span className={styles.right}>{car.generation?.model?.name}</span>
                </div>
                <div className={styles.rightColumn}>
                    <span className={styles.rightSmall}>Paliwo</span>
                    <span className={styles.right}>{car.fuel_type}</span>
                </div>
                <div className={styles.rightColumn}>
                    <span className={styles.rightSmall}>Przebieg</span>
                    <span className={styles.right}>{car.odometer}</span>
                </div>
            </div>
        </div>
    );
}

export function VehicleInformation({ car, setCar }){
  const [showSaleForm, setShowSaleForm] = useState(false);
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const API_URL = 'https://backend-production-15b8.up.railway.app';;
  // Funkcja do odświeżania danych po edycji
  const handleVehicleUpdated = (updatedVehicle) => {
    setCar(updatedVehicle); // aktualizuje dane od razu
  };

  // Funkcja usuwania pojazdu
  const handleDeleteVehicle = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten pojazd? Ta akcja jest nieodwracalna.")) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/vehicles/${car.vin}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd podczas usuwania pojazdu");
      }

      alert("Pojazd został usunięty.");
      router.push("/VehicleList"); 
    } catch (error) {
      console.error("Błąd usuwania pojazdu:", error);
      alert("Nie udało się usunąć pojazdu: " + error.message);
    }
  };

    return(
      <div className="car-info-section">

        {/* Przyciski */}
        <div className="car-info-block">
          <div className="car-btn-group">
            <button className="car-btn" onClick={() => setShowEdit(true)}>Aktualizuj dane →</button>
            <button className="car-btn danger" onClick={handleDeleteVehicle}>Usuń pojazd →</button>

            {/* Pokaż tylko, jeśli auto NIE jest wystawione */}
            {!car.for_sale && (
              <button className="car-btn sale" onClick={() => setShowSaleForm(true)}>
                🏷 Wystaw na sprzedaż
              </button>
            )}

          </div>
        </div>


        {/* Kolor nadwozia */}
        <div className="car-info-block">
          <h3 className="car-subtitle">Kolor nadwozia</h3>
          <p className="car-subtext">{car.body_color || "Metalik"}</p>
          <div className="car-color-list">
            {car.body_colors?.map((c) => (
              <div
                key={c}
                className="car-color-circle"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>


        {/* Kolor wnętrza */}
        <div className="car-info-block">
          <h3 className="car-subtitle">Kolor wnętrza</h3>
          <span className="car-interior-tag">{car.interior_color}</span>
        </div>


        {/* Wartość */}
        <div className="car-value-block">
          <h3 className="car-subtitle">Wartość</h3>
          <p className="car-price">{car.price} PLN</p>
        </div>

        {/* Formularz wystawiania pojazdu na sprzedaż */}
        {showSaleForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setShowSaleForm(false)}>✖ Zamknij</button>
              <VehicleSaleForm
                vin={car.vin}
                onSaleCreated={() => setShowSaleForm(false)}
              />
            </div>
          </div>
        )}

        {/* Edytuj pojazd */}
        {showEdit && (
          <EditVehicle
            vin={car.vin}
            onClose={() => setShowEdit(false)}
            onUpdated={handleVehicleUpdated}
          />
        )}
      </div>
    );
}