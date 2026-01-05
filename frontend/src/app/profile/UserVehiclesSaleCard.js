'use client';

import React from "react";
import styles from "./UserVehiclesSaleCard.module.css";
import { getToken } from "../services/auth";
import Image from "next/image";

export default function VehicleSaleCard({ sale, onDelete }) {
  const v = sale.vehicle_info;
  const API_URL = 'https://backend-production-0265.up.railway.app';;

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) return;

    try {
        const token = getToken();
    
        const res = await fetch(`${API_URL}/api/sales/${sale.id}/`, {
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
            <Image
              src={sale.vehicle_info.images[0]}
              alt={sale.title}
              width={300}       // dopasuj do stylów wrappera
              height={200}      // dopasuj do stylów wrappera
              className={styles.image}
              objectFit="cover" // zachowanie proporcji i przycięcie w razie potrzeby
              priority={true}   // jeśli to obraz powyżej folda
            />
          ) : (
            <div className={styles.noImage}>Brak zdjęcia</div>
          )}
        </div>

        <div className={styles.info}>
            <h3 className={styles.title}>{sale.title}</h3>
            <p className={styles.price}>{sale.price}</p>

            {/* Statystyki */}
            <div className={styles.stats}>
            <span>Wyświetlenia: {sale.stats?.views || 0}</span>
            <span>✉️ Wiadomości: {sale.stats?.messages_sent || 0}</span>
            <span>⭐ Ulubione: {sale.stats?.favorites || 0}</span> 
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
