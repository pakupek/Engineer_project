"use client";

import { useState, useEffect } from "react";
import "./TechnicalData.css";

export default function TechnicalData({ vin }) {
    const [technicalData, setTechnicalData] = useState(null);

    // Pobranie danych technicznych pojazdu
    useEffect(() => {
        const fetchTechnicalData = async () => {
          try {
            const res = await fetch(`http://localhost:8000/api/vehicle-history/${vin}/`);
            const data = await res.json();
            if (data.success) {
              setTechnicalData(data.technical_data);
            }
          } catch (err) {
            console.error("Błąd przy pobieraniu danych technicznych:", err);
          }
        };
    
        if (vin) fetchTechnicalData();
      }, [vin]);

    return (
        <div className="technical-section">
          <h3 className="technical-title">Dane techniczne pojazdu</h3>
          {technicalData ? (
            <ul className="technical-list">
              <li>Pojemność silnika: {technicalData.engine_capacity}</li>
              <li>Moc silnika: {technicalData.engine_power}</li>
              <li>Norma euro: {technicalData.euro_norm}</li>
              <li>Liczba miejsc ogółem: {technicalData.seats_total}</li>
              <li>Masa własna pojazdu: {technicalData.mass_own}</li>
              <li>Dopuszczalna masa całkowita: {technicalData.mass_total}</li>
              <li>
                Maks. masa całkowita przyczepy z hamulcem:{" "}
                {technicalData.trailer_with_brake}
              </li>
              <li>
                Maks. masa całkowita przyczepy bez hamulca:{" "}
                {technicalData.trailer_without_brake}
              </li>
            </ul>
          ) : (
            <p className="technical-loading">Ładowanie danych technicznych...</p>
          )}
        </div>
    );
}