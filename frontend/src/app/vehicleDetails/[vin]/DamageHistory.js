import React, { useEffect, useState } from "react";
import ImageDamageShow from "./ImageDamageCreate";
import { useParams } from "next/navigation";
import { getToken } from "../../Services/auth";

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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Historia uszkodzeń</h2>

      {damageEntries.map((entry, index) => {
        const markers = entry.markers || [];

        // Wyznacz najwyższy stopień uszkodzenia z markerów
        const maxSeverity = markers.reduce((acc, m) => {
          const order = { "drobne": 1, "umiarkowane": 2, "poważne": 3 };
          return order[m.severity] > order[acc] ? m.severity : acc;
        }, "drobne");

        
        return (
          <div key={entry.id ?? `damage-${index}`} className="border-b py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{entry.date}</span>
              {markers.length > 0 && (
                <span
                  className={`px-2 py-1 rounded text-white ${
                    maxSeverity === "poważne"
                      ? "bg-red-600"
                      : maxSeverity === "umiarkowane"
                      ? "bg-orange-500"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {maxSeverity}
                </span>
              )}
            </div>

            <p className="mb-2">{entry.description || "-"}</p>

            {/* Wyświetlamy zdjęcie z markerami */}
            <ImageDamageShow src="https://previews.123rf.com/images/galimovma79/galimovma791605/galimovma79160500023/58812879-auto-linienziehbaren-versicherungssch%C3%A4den-zustand-form.jpg" markers={markers} />
          </div>
        );
      })}
    </div>
  );
}
