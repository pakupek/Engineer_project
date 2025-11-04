'use client';

import React from "react";
import styles from "./VehicleSaleCard.module.css";
import { useRouter } from "next/navigation";

export default function VehicleSaleCard({ sale }) {
  const v = sale.vehicle_info;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/marketplace/${sale.id}`); 
  };

  return (
    <div className={styles.card} onClick={handleClick} style={{ cursor: "pointer" }}>
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
        <p className={styles.location}><strong>Marka: </strong>{v.make}</p>
        <p className={styles.location}><strong>Model: </strong>{v.model}</p>
        <p className={styles.location}><strong>Rok produkcji: </strong>{v.production_year}</p>
        <p className={styles.location}><strong>Przebieg: </strong>{v.odometer}</p>
        
      </div>

      {/* Cena i akcje */}
      <div className={styles.priceBlock}>
        <span className={styles.price}>{sale.price}</span>
        <button className={styles.favorite}>☆</button>
      </div>
    </div>
  );
}
