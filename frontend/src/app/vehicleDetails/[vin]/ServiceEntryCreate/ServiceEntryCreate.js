"use client";

import { useState } from "react";
import { getToken } from "../../../Services/auth";
import style from "./ServiceEntry.module.css";

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
        
        <div className={style["service-form"]}>
            <h2 className={style["form-title"]}>Dodaj wpis serwisowy</h2>

            <form onSubmit={handleAddServiceEntry} className={style["form-container"]}>
                {/* Opis serwisu */}
                <div className={style["form-group"]}>
                    <label>Opis serwisu *</label>
                    <textarea name="description" rows="3" placeholder="Wymiana oleju, filtrów, klocków hamulcowych..." required></textarea>
                </div>

                {/* Przebieg */}
                <div className={style["form-group"]}>
                    <label>Przebieg (km) *</label>
                    <input type="number" name="mileage" min="0" required />
                </div>

                {/* Data */}
                <div className={style["form-group"]}>
                    <label>Data wykonania *</label>
                    <input type="date" name="date" required />
                </div>

                {/* Koszt */}
                <div className={style["form-group"]}>
                    <label>Koszt (PLN)</label>
                    <input type="number" name="cost" min="0" step="0.01" />
                </div>

                {/* Faktura */}
                <div className={style["form-group"]}>
                    <label>Zdjęcie faktury</label>
                    <input type="file" name="invoice_image" accept="image/*" />
                </div>

                <button type="submit" className={style["submit-btn"]}> Dodaj wpis </button>
            </form>
        </div>
    )
}