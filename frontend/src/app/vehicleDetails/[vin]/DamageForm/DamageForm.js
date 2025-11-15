import React, { useEffect, useRef, useState } from "react";
import ImageDamageCreate from "../ImageDamage/ImageDamageCreate";
import style from "./DamageForm.module.css";

export default function DamageForm({ 
  handleAddDamage, 
  handleAddMarker, 
  markers, 
  selectedSeverity, 
  setSelectedSeverity, 
  damageToEdit 
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
      
      // Ustawienie istniejących zdjęć - DOSTOSOWANE DO STRUKTURY Z BACKENDU
      if (damageToEdit.photos && Array.isArray(damageToEdit.photos)) {
        
        const formattedPhotos = damageToEdit.photos.map(photo => ({
          id: photo.id,
          url: photo.image, // Używamy pełnego URL z pola 'image'
          name: `photo-${photo.id}`
        }));
        setExistingPhotos(formattedPhotos);
      } else {
        setExistingPhotos([]);
      }
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
    
    // Reset input file
    e.target.value = '';
  };

  // Usuwanie zdjęcia
  const handleRemovePhoto = (index, isExisting = false) => {
    if (isExisting) {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Zwolnij URL obiektu przed usunięciem
      if (newPhotos[index] instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(newPhotos[index]));
      }
      setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Przygotuj dane do wysłania
    const submitData = {
      date: dateRef.current?.value,
      description,
      severity: selectedSeverity,
      existingPhotos: existingPhotos.map(photo => ({
        id: photo.id,
        url: photo.url
      })), 
      newPhotos,      
    };
    handleAddDamage(e, submitData);
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

          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handlePhotosChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <button
            type="button"
            className={style["upload-btn"]}
            onClick={() => fileInputRef.current.click()}
          >
            Wybierz zdjęcia
          </button>

          {/* Podgląd miniatur */}
          {(existingPhotos.length > 0 || newPhotos.length > 0) && (
            <div className={style["photo-preview"]}>
              {/* Istniejące zdjęcia - POPRAWIONE */}
              {existingPhotos.map((photo, index) => (
                <div key={`exist-${photo.id}`} className={style["photo-item"]}>
                  <img
                    src={photo.url}
                    alt={`Podgląd istniejącego zdjęcia ${index + 1}`}
                    className={style["photo-thumb"]}
                    onError={(e) => {
                      console.error("Error loading image:", photo.url);
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index, true)}
                    className={style["remove-photo-btn"]}
                    title="Usuń zdjęcie"
                  >
                    ×
                  </button>
                  <div className={style["photo-badge"]}>Istniejące</div>
                </div>
              ))}

              {/* Nowe zdjęcia */}
              {newPhotos.map((file, index) => (
                <div key={`new-${index}`} className={style["photo-item"]}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Podgląd nowego zdjęcia ${index + 1}`}
                    className={style["photo-thumb"]}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className={style["remove-photo-btn"]}
                    title="Usuń zdjęcie"
                  >
                    ×
                  </button>
                  <div className={style["photo-badge"]}>Nowe</div>
                </div>
              ))}
            </div>
          )}

          <div className={style["photo-count"]}>
            {existingPhotos.length + newPhotos.length} / 10
          </div>
        </div>

        <button type="submit" className={style["submit-btn"]}>
          {damageToEdit ? "Zapisz zmiany" : "Zgłoś uszkodzenie"}
        </button>
      </form>
    </div>
  );
}