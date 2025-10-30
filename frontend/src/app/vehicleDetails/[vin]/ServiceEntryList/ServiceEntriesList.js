"use client";

import { useState, useEffect } from "react";
import { getToken } from "../../../Services/auth";

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
        <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
        {/* Lista wpisów serwisowych */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Historia serwisowa</h2>
            {serviceEntries.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                {serviceEntries.map((entry) => (
                    <li key={entry.id} className="py-3">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-800 font-medium">
                                📅 {entry.date || "Brak daty"}
                            </p>
                            {entry.mileage && (
                            <p className="text-gray-500 text-sm">Przebieg: {entry.mileage} km</p>
                            )}
                        </div>
                        <p className="text-gray-600 mt-1">{entry.description || "Brak opisu"}</p>
                        {entry.cost && (
                            <p className="text-gray-500 text-sm mt-1">Koszt: {entry.cost} PLN</p>
                        )}
                        {entry.invoice_image && (
                            <div className="mt-2">
                                <img
                                    src={entry.invoice_image.startsWith("http")
                                    ? entry.invoice_image
                                    : `http://localhost:8000${entry.invoice_image}`}
                                    alt="Faktura"
                                    className="w-32 h-32 object-cover rounded border"
                                />
                            </div>
                        )}
                    </li>
                ))}
                </ul>
            ) : (
            <p className="text-gray-500">Brak wpisów serwisowych.</p>
            )}
        </div>
    )
}