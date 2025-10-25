"use client";

import { useState } from "react";
import styles from "./VehicleCard.module.css";

export default function VehicleCard({ vehicle, onDelete, onViewDetails }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Czy na pewno chcesz usunąć ten pojazd?")) {
      setIsDeleting(true);
      await onDelete(vehicle.vin);
      setIsDeleting(false);
    }
  };

  const makeName = vehicle?.generation?.model?.make?.name || "Brak danych";
  const modelName = vehicle?.generation?.model?.name || "Brak danych";
  const generationName = vehicle?.generation?.name || "Brak danych"
  const price = vehicle?.price ? `${vehicle.price} PLN` : "Brak danych";
  const vin = vehicle?.vin || "Brak danych";
  const odometer = vehicle?.odometer ? `${vehicle.odometer} km` : "Brak danych";
  const productionYear = vehicle?.production_year || "Brak danych";
  const imageSrc = vehicle?.images?.[0]?.image || "/car.jpg"; 

  return (
    <div className={styles["vehicle-card"]}>
      <div className={styles["vehicle-card-image"]}>
        <img src={imageSrc} alt={`${makeName} ${modelName}`} />
      </div>

      <div className={styles["vehicle-card-content"]}>
        <div className={styles["vehicle-card-header"]}>
          <h2 onClick={() => onViewDetails(vehicle.vin)}>
            {productionYear} {makeName} {modelName} 
          </h2>
          <span className={styles["vehicle-card-price"]}>{price}</span>
        </div>

        <div className={styles["vehicle-card-parameters"]}>
          <div><span className={styles["label"]}>VIN:</span> {vin}</div>
          <div><span className={styles["label"]}>Przebieg:</span> {odometer}</div>
          <div><span className={styles["label"]}>Rok prod:</span> {productionYear}</div>
          <div><span className={styles["label"]}>Generacja:</span> {generationName}</div>
        </div>

        <div className={styles["vehicle-card-actions"]}>
          <button
            onClick={() => onViewDetails(vehicle.vin)}
            title="Szczegóły pojazdu"
            className={styles["icon-button"]}
          >
            <img src="/icons/info.png" alt="Szczegóły" className={styles["icon"]} />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Usuń pojazd"
            className={`${styles["icon-button"]} ${styles["delete"]}`}
          >
            <img src="/icons/delete.svg" alt="Usuń" className={styles["icon"]} />
          </button>
        </div>
      </div>
    </div>
  );
}
