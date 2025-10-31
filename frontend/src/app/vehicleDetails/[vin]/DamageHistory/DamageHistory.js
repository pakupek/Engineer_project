import React, { useEffect, useState } from "react";
import ImageDamageShow from "../ImageDamageCreate";
import { useParams } from "next/navigation";
import { getToken } from "../../../Services/auth";
import "./DamageHistory.css";

export default function DamageHistory() {
  const [damageEntries, setDamageEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { vin } = useParams();

  
  const fetchDamageHistory = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `http://localhost:8000/api/damage-entry/${vin}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Błąd podczas pobierania historii szkód");

        const data = await response.json();
        setDamageEntries(data);
      } catch (error) {
        console.error(error);
        alert("Nie udało się pobrać historii szkód");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (vin) fetchDamageHistory();
  }, [vin]);

  if (loading) return <p>Ładowanie historii szkód...</p>;
  if (!damageEntries.length) return <p>Brak zgłoszonych szkód dla tego pojazdu.</p>;

  return (
    <div className="damage-history">
      <h2 className="history-title">Historia uszkodzeń</h2>

      <div className="damage-slider">
        {damageEntries.map((entry, index) => {
          const markers = entry.markers || [];
          const maxSeverity = markers.reduce((acc, m) => {
            const order = { drobne: 1, umiarkowane: 2, poważne: 3 };
            return order[m.severity] > order[acc] ? m.severity : acc;
          }, "drobne");

          return (
            <div key={entry.id ?? `damage-${index}`} className="damage-slide">
              <div className="damage-card">
                <div className="damage-header">
                  <span className="damage-date">📅 {entry.date || "Brak daty"}</span>
                  <span
                    className={`damage-severity ${maxSeverity}`}
                  >
                    {maxSeverity}
                  </span>
                </div>

                <p className="damage-description">
                  {entry.description || "Brak opisu"}
                </p>

                <div className="damage-image">
                  <ImageDamageShow
                    src="https://previews.123rf.com/images/galimovma79/galimovma791605/galimovma79160500023/58812879-auto-linienziehbaren-versicherungssch%C3%A4den-zustand-form.jpg"
                    markers={markers}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
