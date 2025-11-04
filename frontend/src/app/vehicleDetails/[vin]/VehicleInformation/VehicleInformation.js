"use client";

import styles from "./VehicleInformation.module.css";
import "./VehicleInformation.css";
import VehicleSaleForm from "../../../VehicleSale/VehicleSaleForm.js";
import { useState } from "react";

export function VehicleInformationOverlay({ car }){
    return (
        <div className={styles.overlay}>
        {/* Overlay z podstawowymi danymi */}
            <div className="flex flex-col">
                <span className={styles.leftSmall}>Marka</span>
                <span className={styles.left}>{car.generation?.model?.make?.name}</span>
            </div>

            <div className="flex gap-8">
                <div className="flex flex-col text-right">
                    <span className={styles.rightSmall}>Model</span>
                    <span className={styles.right}>{car.generation?.model?.name}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className={styles.rightSmall}>Paliwo</span>
                    <span className={styles.right}>{car.fuel_type}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className={styles.rightSmall}>Przebieg</span>
                    <span className={styles.right}>{car.odometer}</span>
                </div>
            </div>
        </div>
    );
}

export function VehicleInformation({ car, showMore, setShowMore}){
  const [showSaleForm, setShowSaleForm] = useState(false);

    return(
        
      <div className="car-info-section">
      {/* Główne dane auta */}
      <div className="car-info-block">
        <h2 className="car-title">{car.title || car.name}</h2>
        <p className="car-description">{car.description}</p>

        {!showMore && (
          <button
            onClick={() => setShowMore(true)}
            className="car-loadmore-btn"
          >
            Załaduj więcej →
          </button>
        )}
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

      {/* Koła */}
      <div className="car-info-block">
        <h3 className="car-subtitle">Koła</h3>
        <p className="car-wheel-size">{car.wheel_size}</p>
      </div>

      {/* Wartość i przyciski */}
      <div className="car-value-block">
        <h3 className="car-subtitle">Wartość</h3>
        <p className="car-price">{car.price} PLN</p>
        <div className="car-btn-group">
          <button className="car-btn">Aktualizuj dane →</button>
          <button className="car-btn danger">Usuń pojazd →</button>
          <button onClick={() => setShowSaleForm(true)}>🏷 Wystaw na sprzedaż</button>
        </div>
      </div>

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

    </div>
    );
}