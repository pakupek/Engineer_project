import React, { useState } from "react";
import ImageDamageCreate from "../ImageDamageCreate";
import { getToken } from "../../../Services/auth";
import { useParams } from "next/navigation";
import style from "./DamageForm.module.css"

export default function DamageForm() {
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
    <div className={style["damage-form"]}>
      <h2 className={style["form-title"]}>Zgłoś uszkodzenie</h2>

      <div className={style["form-group"]}>
        <label>Stopień uszkodzenia:</label>
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className={style["severity-select"]}
        >
          <option value="drobne">Drobne</option>
          <option value="umiarkowane">Umiarkowane</option>
          <option value="poważne">Poważne</option>
        </select>
      </div>

      <p className={style["info-text"]}>
        Kliknij na obraz poniżej, aby wskazać miejsce uszkodzenia.
      </p>

      <div className={style["image-container"]}>
        <ImageDamageCreate
          src="https://previews.123rf.com/images/galimovma79/galimovma791605/galimovma79160500023/58812879-auto-linienziehbaren-versicherungssch%C3%A4den-zustand-form.jpg"
          markers={markers}
          onClickPosition={handleAddMarker}
        />
      </div>

      <form onSubmit={handleAddDamage} className={style["form-container"]}>
        <div className={style["form-group"]}>
          <label>Data</label>
          <input type="date" name="date" required />
        </div>

        <div className={style["form-group"]}>
          <label>Opis</label>
          <textarea name="description" rows="3" placeholder="Opisz uszkodzenie..." />
        </div>

        <div className={style["form-group"]}>
          <label>Zdjęcie</label>
          <input type="file" name="photos" accept="image/*" />
        </div>

        <button type="submit" className={style["submit-btn"]}>
          Zgłoś uszkodzenie
        </button>
      </form>
    </div>
  );
}
