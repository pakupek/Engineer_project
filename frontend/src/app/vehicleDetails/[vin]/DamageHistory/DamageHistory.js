import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "../../../services/auth";
import DamageHistoryForm from "./DamageHistoryForm";

export default function DamageHistory({ onEditDamage }) {
  const [damageEntries, setDamageEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { vin } = useParams();
  const [editingDamage, setEditingDamage] = useState(null);
  const API_URL = 'https://backend-production-8ce8.up.railway.app';
  

  const fetchDamageHistory = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/damage-entry/${vin}/`,
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

  // Usuwanie wpisu
  const handleDelete = async (entryId) => {
    if (!confirm("Czy na pewno chcesz usunąć tę szkodę?")) return;

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/damage-entry/${vin}/${entryId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Błąd podczas usuwania szkody");

      alert("Szkoda została usunięta");
      fetchDamageHistory();
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć szkody");
    }
  };


  // Obsługa kliknięcia "Edytuj"
  const handleEdit = (damage) => {
    setEditingDamage(damage);
  };

  // Po zakończeniu edycji — odśwież listę
  const handleEditComplete = () => {
    setEditingDamage(null);
    fetchDamages();
  };

  if (loading) return <p>Ładowanie historii szkód...</p>;

  return (
      <DamageHistoryForm
        damageEntries={damageEntries}
        handleDelete={handleDelete}
        onEditDamage={onEditDamage}
      />
  );
}
