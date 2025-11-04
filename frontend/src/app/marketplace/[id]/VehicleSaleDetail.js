'use client';

import React, { useState, useEffect } from "react";
import styles from "./VehicleSaleDetail.module.css";
import { getToken } from "../../Services/auth";

export default function VehicleSaleDetail({ saleId }) {
  const [sale, setSale] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const token = getToken();
        const res = await fetch(`http://localhost:8000/api/sales/${saleId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log(token);
        setSale(data);
      } catch (error) {
        console.error("Błąd ładowania szczegółów ogłoszenia:", error);
      }
    };
    fetchSale();
  }, [saleId]);

  if (!sale) return <p>Ładowanie ogłoszenia...</p>;

  const images = sale.vehicle_info?.images || [];

  return (
  <div className={styles.container}>
    {/* GÓRNA SEKCJA: zdjęcia + dane auta */}
    <div className={styles.topSection}>
      {/* Galeria zdjęć */}
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          {images[selectedImage] ? (
            <img src={images[selectedImage]} alt={sale.title} />
          ) : (
            <div className={styles.noImage}>Brak zdjęcia</div>
          )}
        </div>
        <div className={styles.thumbnailRow}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              className={selectedImage === idx ? styles.selectedThumb : ""}
              onClick={() => setSelectedImage(idx)}
            />
          ))}
        </div>
      </div>

      {/* Informacje o aucie */}
      <div className={styles.info}>
        <h1>{sale.title}</h1>
        <p className={styles.price}>{sale.price} zł</p>
        

        {/* Statystyki i szczegóły */}
        <div className={styles.detailsGrid}>
          <div><strong>Marka:</strong> {sale.vehicle_info?.make}</div>
          <div><strong>Model:</strong> {sale.vehicle_info?.model}</div>
          <div><strong>Kolor nadwozia:</strong> {sale.vehicle_info?.body_color}</div>
          <div><strong>Napęd:</strong> {sale.vehicle_info?.drive_type}</div>
          <div><strong>Skrzynia biegów:</strong> {sale.vehicle_info?.transmission}</div>
          <div><strong>Rok produkcji:</strong> {sale.vehicle_info?.production_year}</div>
          <div><strong>Przebig:</strong> {sale.vehicle_info?.odometer}</div>
          <div><strong>Paliwo:</strong> {sale.vehicle_info?.fuel_type}</div>
        </div>
      </div>
    </div>

    {/* Opis ogłoszenia */}
    <div className={styles.descriptionSection}>
      <h2>Opis ogłoszenia</h2>
      <p>{sale.description || "Brak opisu dla tego ogłoszenia."}</p>
    </div>

    {/* MAPA LOKALIZACJI */}
    {sale.vehicle_info?.location && (
      <div className={styles.mapSection}>
        <h2>Lokalizacja pojazdu</h2>
        <div className={styles.mapContainer}>
          <iframe
            title="Mapa lokalizacji pojazdu"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "12px" }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              sale.vehicle_info.location
            )}&output=embed`}
          ></iframe>
        </div>
      </div>
    )}

    {/* Sekcja kontaktowa */}
    <div className={styles.contactWrapper}>
      {/* Formularz kontaktowy */}
      <div className={styles.contactForm}>
        <h2>Wyślij wiadomość do sprzedającego</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const token = getToken();
            const message = e.target.message.value;

            if (sale.owner_data?.id === sale.current_user) {
              alert("Nie możesz wysłać wiadomości do siebie.");
              return;
            }

            try {
              const res = await fetch("http://localhost:8000/api/messages/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  receiver: sale.owner,
                  sale: sale.id,
                  content: message,
                }),
              });

              if (res.ok) {
                alert("Wiadomość wysłana pomyślnie!");
                const data = await res.json();
                console.log('message create response', res.status, data);
                e.target.reset();
              } else {
                const err = await res.json();
                alert("Błąd: " + (err.detail || "Nie udało się wysłać wiadomości."));
              }
            } catch (error) {
              console.error("Błąd wysyłania wiadomości:", error);
            }
          }}
        >

          <textarea
            name="message"
            placeholder="treść wiadomości"
            required
            className={styles.messageBox}
          ></textarea>

          <button type="submit" className={styles.sendBtn}>
            Wyślij
          </button>
        </form>
      </div>

      {/* Dane właściciela */}
      <div className={styles.ownerCard}>
        <div className={styles.ownerHeader}>
          <div>
            <h3>{sale.owner_info?.username || "Nieznany użytkownik"}</h3>
            <p className={styles.ownerRole}>Sprzedający</p>
            <p className={styles.ownerAddress}>
              📍 {sale.vehicle_info?.location || "Brak lokalizacji"}
            </p>
          </div>
          <img
            src={sale.owner_info.avatar}
            alt={sale.owner_info.username}
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        </div>

        <div className={styles.ownerContactBox}>
          <p>📧 {sale.owner_info?.email || "Brak adresu e-mail"}</p>

          <button
            className={styles.revealBtn}
            onClick={() => setShowPhone((prev) => !prev)}
          >
            📞{" "}
            {sale.owner_info?.phone_number
              ? showPhone
                ? sale.owner_info.phone_number
                : "123 *** *** - Pokaż numer"
              : "Brak numeru telefonu"}
          </button>
        </div>
      </div>
    </div>


    
  </div>
);
}
