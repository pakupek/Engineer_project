"use client";
import { useState, useEffect } from "react";
import { getToken } from "../services/auth";

export default function SaleForm({ vin, onSaleAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [history, setHistory] = useState({ damages: [], services: [] });
  const API_URL = 'https://backend-production-8ce8.up.railway.app';

  useEffect(() => {
    if (vin) {
      fetch(`${API_URL}/api/vehicles/${vin}/`)
        .then((res) => res.json())
        .then((data) => {
          setHistory({
            damages: data.damage_entries || [],
            services: data.service_entries || [],
          });
        });
    }
  }, [vin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    const response = await fetch(`${API_URL}/api/sales/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, price, vehicle: vin }),
    });

    if (response.ok) {
      alert("✅ Ogłoszenie dodane!");
      setTitle("");
      setDescription("");
      setPrice("");
      onSaleAdded?.();
    } else {
      alert("❌ Nie udało się wystawić auta.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Wystaw auto na sprzedaż</h2>

        <input type="text" placeholder="Tytuł" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 mb-2 border rounded" />
        <textarea placeholder="Opis..." value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input type="number" placeholder="Cena (PLN)" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 mb-2 border rounded" />

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Dodaj ogłoszenie</button>
      </form>

      <div className="mt-4">
        <h3 className="font-bold text-lg">Historia pojazdu:</h3>
        <div>
          <h4 className="font-semibold">Uszkodzenia:</h4>
          {history.damages.length === 0 ? <p>Brak</p> : (
            <ul>{history.damages.map(d => <li key={d.id}>{d.date}: {d.description}</li>)}</ul>
          )}
        </div>

        <div>
          <h4 className="font-semibold">Serwis:</h4>
          {history.services.length === 0 ? <p>Brak</p> : (
            <ul>{history.services.map(s => <li key={s.id}>{s.date}: {s.description}</li>)}</ul>
          )}
        </div>
      </div>
    </div>
  );
}
