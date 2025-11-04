'use client';

import React from "react";
import styles from "./UserVehiclesSaleCard.module.css";
import { getToken } from "../Services/auth";

export default function VehicleSaleCard({ sale, onDelete }) {
  const v = sale.vehicle_info;

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) return;

    try {
        const token = getToken();
    
        const res = await fetch(`http://localhost:8000/api/sales/${sale.id}/`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${token}`,
            },
     });
        if (res.ok) {
            alert("Ogłoszenie zostało usunięte");
        if (onDelete) onDelete(sale.id); 
      } else {
        alert("Błąd podczas usuwania ogłoszenia");
      }
    } catch (error) {
      console.error(error);
      alert("Błąd podczas usuwania ogłoszenia");
    }
  };

  return (
    <div className={styles.card}>
        <div className={styles.imageWrapper}>
            {sale.vehicle_info?.images?.length > 0 ? (
            <img src={sale.vehicle_info.images[0]} alt={sale.title} />
            ) : (
            <div className={styles.noImage}>Brak zdjęcia</div>
            )}
        </div>

        <div className={styles.info}>
            <h3 className={styles.title}>{sale.title}</h3>
            <p className={styles.details}>{sale.description}</p>
            <p className={styles.price}>${sale.price}</p>

            {/* Statystyki */}
            <div className={styles.stats}>
            <span>Wyświetlenia: {sale.views_count ?? 0}</span>
            <span>Zainteresowani: {sale.interested_count ?? 0}</span>
            <span>Utworzono: {new Date(sale.created_at).toLocaleDateString()}</span>
            <span>Status: {sale.is_active ? "Aktywne" : "Nieaktywne"}</span>
            </div>
        </div>

        <div className={styles.actions}>
            <button className={styles.deleteBtn} onClick={handleDelete}>
            Usuń
            </button>
        </div>
    </div>

  );
}
