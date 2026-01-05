"use client";

import { useState, useEffect } from "react";
import "./TechnicalData.css";

export default function TechnicalData({ vin }) {
    const [technicalData, setTechnicalData] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_URL = 'https://backend-production-0265.up.railway.app';;
    // Pobranie danych technicznych pojazdu
    useEffect(() => {
      let interval;

      const startVehicleHistoryTask = async () => {
        try {
          setLoading(true);
          // Wywołanie endpointu, który enqueue'uje zadanie Celery
          const res = await fetch(`${API_URL}/api/vehicle-history/${vin}/`);
          const data = await res.json();

          if (res.ok && data.task_id) {
            setTaskId(data.task_id);

            // Polling co 2 sekundy
            interval = setInterval(async () => {
              try {
                const statusRes = await fetch(
                  `${API_URL}/api/vehicle-history/status/${data.task_id}/`
                );
                const statusData = await statusRes.json();

                if (statusData.status === "success") {
                  setTechnicalData(statusData.technical_data);
                  setLoading(false);
                  clearInterval(interval); // zatrzymanie polling
                } else if (statusData.status === "failure") {
                  console.error("Błąd pobierania danych:", statusData.error);
                  setLoading(false);
                  clearInterval(interval);
                }
                // w przeciwnym razie status = pending → kontynuuj polling
              } catch (err) {
                console.error("Błąd przy polling statusu:", err);
                setLoading(false);
                clearInterval(interval);
              }
            }, 2000);
          }
        } catch (err) {
          console.error("Błąd przy uruchamianiu zadania Celery:", err);
          setLoading(false);
        }
      };

      if (vin) startVehicleHistoryTask();

      // Cleanup przy odmontowaniu komponentu
      return () => clearInterval(interval);
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