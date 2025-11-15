import React, { useEffect, useRef, useState } from "react";
import ImageDamageCreate from "../ImageDamage/ImageDamageCreate";
import style from "./DamageForm.module.css";


export default function DamageForm({
  handleAddDamage,
  handleAddMarker,
  markers,
  selectedSeverity,
  setSelectedSeverity,
  damageToEdit,
}) {
  const dateRef = useRef(null);
  const [description, setDescription] = useState("");
  const [newPhotos, setNewPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const [existingPhotos, setExistingPhotos] = useState([]);


  // Wczytanie danych przy edycji
  useEffect(() => {
    if (damageToEdit) {
      if (dateRef.current) dateRef.current.value = damageToEdit.date || "";
      setDescription(damageToEdit.description || "");
      setExistingPhotos(damageToEdit.photos || []);
      setNewPhotos([]);
    } else {
      setDescription("");
      setExistingPhotos([]);
      setNewPhotos([]);
    }
  }, [damageToEdit]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) setDescription(value);
  };

  // Dodawanie nowych zdjęć
  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newPhotos.length + existingPhotos.length > 10) {
      alert("Możesz dodać maksymalnie 10 zdjęć");
      return;
    }
    setNewPhotos((prev) => [...prev, ...files]);
  };

  // Usuwanie zdjęcia
  const handleRemovePhoto = (index, isExisting = false) => {
    if (isExisting) {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    handleAddDamage(e, {
      date: dateRef.current.value,
      description,
      severity: selectedSeverity,
      existingPhotos, 
      newPhotos,      
    });
  };



  return (
    <div className={style["damage-form"]}>
      <h2 className={style["form-title"]}>
        {damageToEdit ? "Edytuj uszkodzenie" : "Zgłoś uszkodzenie"}
      </h2>

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
          src="/images/auto-linienziehbaren.jpg"
          markers={markers}
          onClickPosition={handleAddMarker}
        />
      </div>

      <form onSubmit={handleSubmit} className={style["form-container"]}>
        <div className={style["form-group"]}>
          <label>Data</label>
          <input type="date" name="date" ref={dateRef} required />
        </div>

        <div className={style["form-group"]}>
          <label>Opis (max 500 znaków)</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Opisz uszkodzenie..."
            value={description}
            onChange={handleDescriptionChange}
          />
          <div className={style["char-count"]}>
            {description.length}/500
          </div>
        </div>

        <div className={style["form-group"]}>
          <label>Zdjęcia (max 10)</label>

          {/* Ukryty natywny input */}
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handlePhotosChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {/* Własny przycisk */}
          <button
            type="button"
            className={style["upload-btn"]}
            onClick={() => fileInputRef.current.click()}
          >
            Wybierz zdjęcia
          </button>

          {/* Podgląd miniatur */}
          {(existingPhotos.length + newPhotos.length) > 0 && (
            <div className={style["photo-preview"]}>
              {existingPhotos.map((url, index) => (
                <div key={`exist-${index}`} className={style["photo-item"]}>
                  <img
                    src={url}
                    alt={`Podgląd ${index + 1}`}
                    className={style["photo-thumb"]}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index, true)}
                    className={style["remove-photo-btn"]}
                  >
                    ×
                  </button>
                </div>
              ))}

              {newPhotos.map((file, index) => (
                <div key={`new-${index}`} className={style["photo-item"]}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Podgląd ${index + 1}`}
                    className={style["photo-thumb"]}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className={style["remove-photo-btn"]}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Licznik zdjęć */}
          <div className={style["photo-count"]}>
            {existingPhotos.length + newPhotos.length} / 10
          </div>
        </div>

        {/* Przycisk do zatwierdzenia formuarza */}
        <button type="submit" className={style["submit-btn"]}>
          {damageToEdit ? "Zapisz zmiany" : "Zgłoś uszkodzenie"}
        </button>
      </form>
    </div>
  );
}
