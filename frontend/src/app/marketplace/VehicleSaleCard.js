'use client';

import React from "react";
import styles from "./VehicleSaleCard.module.css";

export default function VehicleSaleCard({ sale }) {
  const v = sale.vehicle_info;

  return (
    <div className={styles.card}>
      {/* Zdjęcie pojazdu */}
      <div className={styles.imageWrapper}>
        {v.images && v.images.length > 0 ? (
          <img src={v.images[0]} alt={`${v.make} ${v.model}`} />
        ) : (
          <div className={styles.noImage}>Brak zdjęcia</div>
        )}
      </div>


      {/* Informacje o pojeździe */}
      <div className={styles.info}>
        <h3 className={styles.title}>{sale.title}</h3>
        <p className={styles.details}>{sale.description}</p>
        <p className={styles.location}><strong>Lokalizacja:</strong> {v.location || "Brak danych"}</p>
      </div>

      {/* Cena i akcje */}
      <div className={styles.priceBlock}>
        <span className={styles.price}>${sale.price}</span>
        <button className={styles.favorite}>☆</button>
      </div>
    </div>
  );
}
