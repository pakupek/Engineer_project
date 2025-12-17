"use client";

import { useEffect, useState } from "react";
import styles from "./EditVehicle.module.css";
import { getToken } from "@/services/auth";

export default function EditVehicleModal({ vin, onClose, onUpdated }) {
  const [vehicle, setVehicle] = useState(null);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({});
  const token = getToken();
  const API_URL = 'https://backend-production-8ce8.up.railway.app';

  // Blokowanie scrolla w tle przy otwartym modalu
  useEffect(() => {
    document.body.style.overflow = "hidden"; // blokada scrolla
    return () => {
      document.body.style.overflow = "auto"; // przywrócenie scrolla po zamknięciu
    };
  }, []);

  // Pobieranie danych pojazdu
  useEffect(() => {
    const fetchVehicle = async () => {
      const res = await fetch(`${API_URL}/api/vehicles/${vin}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setVehicle(data);
      setImages(data.images || []);
      setFormData({
        production_year: data.production_year,
        odometer: data.odometer,
        body_color: data.body_color,
        interior_color: data.interior_color,
        price: data.price,
        fuel_type: data.fuel_type,
        transmission: data.transmission,
        drive_type: data.drive_type,
        location: data.location,
        wheel_size: data.wheel_size,
        first_registration: data.first_registration,
        registration: data.registration,
        generation_id: data.generation?.id,
      });
    };

    fetchVehicle();
  }, [vin]);

  // Upload zdjęć
  const uploadImages = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const form = new FormData();
    for (let f of files) {
      form.append("image", f);
    }

    const res = await fetch(`${API_URL}/api/vehicles/${vin}/images/`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    );

    if (res.ok) {
      const newImages = await res.json();
      setImages((prev) => [...prev, ...newImages]);
      e.target.value = "";
    } else {
      console.error(await res.json());
    }
  };

  // Usuwanie zdjęcia
  const deleteImage = async (imageId) => {
    if (!window.confirm("Czy na pewno usunąć to zdjęcie?")) return;

    try {
      const res = await fetch(`${API_URL}/api/vehicles/${vin}/images/${imageId}/`,{
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 204) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      } else {
        const data = await res.json();
        alert(data.detail || "Nie udało się usunąć zdjęcia");
      }
    } catch (err) {
      console.error(err);
      alert("Błąd połączenia z serwerem");
    }
  };


  // Zmiany w formularzu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Zapis zmian pojazdu
  const saveChanges = async () => {
    const res = await fetch(`${API_URL}/api/vehicles/${vin}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) {
        
      const updatedData = await res.json();

      // Przekaż odświeżone dane do komponentu nadrzędnego
      onUpdated(updatedData);

      // Zamknij modal
      onClose();
    } else console.error(await res.json());
  };

  if (!vehicle) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        {/* LEWA STRONA — ZDJĘCIA */}
        <div className={styles.left}>
          <h3>Zdjęcia pojazdu</h3>

          {/* Dodawanie zdjęć */}
          <button
            className={styles.addPhotoBtn}
            onClick={() => document.getElementById("uploadInput").click()}
          >
            ➕ Dodaj zdjęcia
          </button>

          <input
            id="uploadInput"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={uploadImages}
          />

          {/* Galeria */}
          <div className={styles.gallery}>
            {images.map((img) => (
              <div key={img.id} className={styles.imageBox}>
                <img src={img.image} alt="Vehicle" />
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteImage(img.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PRAWA STRONA — FORMULARz */}
        <div className={styles.right}>
          <h2>Edycja pojazdu</h2>

          <div className={styles.form}>
            <label>Przebieg</label>
            <input
              name="odometer"
              value={formData.odometer || ""}
              onChange={handleChange}
            />

            <label>Kolor nadwozia</label>
            <input
              name="body_color"
              value={formData.body_color || ""}
              onChange={handleChange}
            />

            <label>Kolor wnętrza</label>
            <input
              name="interior_color"
              value={formData.interior_color || ""}
              onChange={handleChange}
            />

            <label>Cena</label>
            <input
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
            />

            <label>Miejsce</label>
            <input
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
            />

            <label>Data rejestracji</label>
            <input
              type="date"
              name="first_registration"
              value={formData.first_registration || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.footer}>
            <button className={styles.cancel} onClick={onClose}>
              Anuluj
            </button>
            <button className={styles.save} onClick={saveChanges}>
              Zapisz zmiany
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
