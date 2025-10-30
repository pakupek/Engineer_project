"use client";

import { useState } from "react";
import { getToken } from "../../../services/auth";

export default function ServiceEntryCreate({ vin }){

    const [serviceEntries, setServiceEntries] = useState([]);

    // Funkcja do dodawania wpisu serwisowego
    const handleAddServiceEntry = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
    
        try {
          const token = getToken();
          
          const response = await fetch(`http://localhost:8000/api/service-entry/${vin}/`, {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
             
            },
            body: formData,
          });
    
          const responseData = await response.json();
    
          if (!response.ok) {
            throw new Error(responseData.message || responseData.errors || `Błąd: ${response.status}`);
          }
    
          // Dodaj nowy wpis do listy
          setServiceEntries(prev => [responseData.data, ...prev]);
          alert("Wpis serwisowy został dodany pomyślnie!");
          e.target.reset();
          
        } catch (error) {
          console.error("Błąd dodawania wpisu:", error);
          alert(`Nie udało się dodać wpisu serwisowego: ${error.message}`);
        }
    };

    return(
        
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md">
        {/* Formularz dodawania wpisu serwisowego */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Dodaj wpis serwisowy</h2>

            <form onSubmit={handleAddServiceEntry} className="space-y-4">
                {/* Pole opisu */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Opis serwisu *</label>
                    <textarea
                    name="description"
                    rows="3"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Wymiana oleju, filtrów, klocków hamulcowych..."
                    required
                />
                </div>

                {/* Pole przebiegu */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Przebieg (km) *</label>
                    <input
                    type="number"
                    name="mileage"
                    min="0"
                    required
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Pole daty */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Data wykonania *</label>
                    <input
                    type="date"
                    name="date"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>

                {/* Pole kosztu */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Koszt (PLN)</label>
                    <input
                    type="number"
                    name="cost"
                    min="0"
                    step="0.01"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Pole zdjęcia faktury */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Zdjęcie faktury</label>
                    <input
                    type="file"
                    name="invoice_image"
                    accept="image/*"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
                >
                    Dodaj wpis
                </button>
            </form>
        </div>
    )
}