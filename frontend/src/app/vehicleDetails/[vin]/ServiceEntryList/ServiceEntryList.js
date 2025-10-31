"use client";

import { useState, useEffect } from "react";
import { getToken } from "../../../Services/auth";
import "./ServiceEntryList.css";

export default function ServiceEntriesList({ vin }) {
    const [serviceEntries, setServiceEntries] = useState([]);

    // Pobieranie wpisów serwisowych
    useEffect(() => {
        const fetchServiceEntries = async () => {
          try {
            const token = getToken();
            const res = await fetch(`http://localhost:8000/api/service-entries/${vin}/`, {
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
    
        if (vin) {
          fetchServiceEntries();
        }
    }, [vin]);

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

                        <p className="service-description">
                        {entry.description || "Brak opisu"}
                        </p>

                        {entry.cost && (
                        <p className="service-cost">Koszt: {entry.cost} PLN</p>
                        )}

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