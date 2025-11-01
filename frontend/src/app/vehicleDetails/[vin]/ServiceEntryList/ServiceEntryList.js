"use client";

import { useState, useEffect } from "react";
import { getToken } from "../../../Services/auth";
import "./ServiceEntryList.css";

export default function ServiceEntriesList({ vin, onEditEntry }) {
  const [serviceEntries, setServiceEntries] = useState([]);

  // 🔹 Funkcja do pobierania wpisów
  const fetchServiceEntries = async () => {
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:8000/api/service-entry/${vin}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Błąd pobierania wpisów serwisowych");
      const data = await res.json();
      setServiceEntries(data);
    } catch (err) {
      console.error("Błąd:", err);
    }
  };

  // 🔹 Załaduj wpisy po załadowaniu VIN
  useEffect(() => {
    if (vin) fetchServiceEntries();
  }, [vin]);

  // 🔹 Kliknięcie przycisku "Edytuj"
  const handleEditClick = (entry) => {
    if (onEditEntry) {
      onEditEntry(entry); // <-- przekazuje dane wpisu do formularza w komponencie nadrzędnym
    }
  };

  // 🔹 Usuń wpis
  const handleDelete = async (entryId) => {
    if (!confirm("Czy na pewno chcesz usunąć ten wpis serwisowy?")) return;

    try {
      const token = getToken();
      const res = await fetch(
        `http://localhost:8000/api/service-entry/${vin}/${entryId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Błąd podczas usuwania wpisu");

      alert("🗑️ Wpis został usunięty");
      fetchServiceEntries(); // odśwież listę
    } catch (err) {
      console.error(err);
      alert("❌ Wystąpił błąd przy usuwaniu wpisu");
    }
  };

  return (
    <div className="service-history">
      <h2 className="history-title">Historia serwisowa</h2>

      {serviceEntries.length > 0 ? (
        <div className="service-slider">
          {serviceEntries.map((entry) => (
            <div key={entry.id} className="service-slide">
              <div className="service-card">
                <div className="service-header">
                  <p className="service-date">📅 {entry.date || "Brak daty"}</p>
                  {entry.mileage && (
                    <p className="service-mileage">Przebieg: {entry.mileage} km</p>
                  )}
                </div>

                <p className="service-description">{entry.description || "Brak opisu"}</p>

                {entry.cost && <p className="service-cost">Koszt: {entry.cost} PLN</p>}

                {entry.invoice_image && (
                  <div className="service-image">
                    <img
                      src={
                        entry.invoice_image.startsWith("http")
                          ? entry.invoice_image
                          : `http://localhost:8000${entry.invoice_image}`
                      }
                      alt="Faktura"
                    />
                  </div>
                )}

                {/* 🧩 Przyciski akcji */}
                <div className="service-actions">
                  <button className="edit-btn" onClick={() => handleEditClick(entry)}>
                    ✏️ Edytuj
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                    🗑️ Usuń
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-entries">Brak wpisów serwisowych.</p>
      )}
    </div>
  );
}
