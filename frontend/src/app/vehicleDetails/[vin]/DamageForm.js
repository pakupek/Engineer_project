import React, { useState } from "react";
import ImageDamageCreate from "./ImageDamageCreate";
import { getToken } from "../../services/auth";
import { useParams } from "next/navigation";

export default function DamageForm({ vehicleImage, vehicleId }) {
  const [markers, setMarkers] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("drobne");
  const { vin } = useParams();

  const handleAddMarker = ({ x, y }) => {
    const newMarker = {
      x_percent: x,
      y_percent: y,
      severity: selectedSeverity,
    };
    setMarkers([...markers, newMarker]);
  };

  const handleAddDamage = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Dodajemy ID pojazdu i markery
    formData.append("vin", vin);
    formData.append("markers", JSON.stringify(markers));

    try {
      const token = getToken();
      const response = await fetch("http://localhost:8000/api/damage-entry/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        alert("Nie udało się zapisać uszkodzenia");
        return;
      }

      alert("Uszkodzenie zapisane!");
      e.target.reset();
      setMarkers([]);
    } catch (error) {
      console.error(error);
      alert("Nie udało się zapisać uszkodzenia");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Zgłoś uszkodzenie</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Stopień uszkodzenia:</label>
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
        >
          <option value="drobne">Drobne</option>
          <option value="umiarkowane">Umiarkowane</option>
          <option value="poważne">Poważne</option>
        </select>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        Kliknij na obraz poniżej, aby wskazać miejsce uszkodzenia.
      </p>

      <ImageDamageCreate
        src="https://previews.123rf.com/images/galimovma79/galimovma791605/galimovma79160500023/58812879-auto-linienziehbaren-versicherungssch%C3%A4den-zustand-form.jpg"
        markers={markers}
        onClickPosition={handleAddMarker}
      />

      <form onSubmit={handleAddDamage} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">Data</label>
          <input type="date" name="date" required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Opis</label>
          <textarea name="description" rows="3" className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Zdjęcie</label>
          <input type="file" name="photos" accept="image/*" className="w-full" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Zgłoś uszkodzenie
        </button>
      </form>
    </div>
  );
}
