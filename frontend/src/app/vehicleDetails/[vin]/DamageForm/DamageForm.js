import React from "react";
import ImageDamageCreate from "../ImageDamageCreate";
import style from "./DamageForm.module.css"

export default function DamageForm({
  handleAddDamage,
  handleAddMarker,
  markers,
  selectedSeverity,
  setSelectedSeverity,
}) {

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