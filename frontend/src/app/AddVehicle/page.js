"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToken } from "../Services/auth";
import styles from "./AddVehicle.module.css"
import DashboardLayout from '../DashboardLayout/page';

export default function AddVehiclePage() {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [searchMake, setSearchMake] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  

  const [generations, setGenerations] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [formData, setFormData] = useState({
    generation_id: '',
    production_year: new Date().getFullYear(),
    vin: '',
    odometer: 0,
    body_color: 'Biały',
    interior_color: 'Czarny',
    price: 0.0,
    first_registration: '',
    fuel_type: 'Diesel',
    transmission: 'Manual',
    drive_type: 'FWD',
    location: '',
    wheel_size: '',
    for_sale: false,
    registration:''
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); 
    // Sprawdź czy nie przekracza limitu
    if (files.length > 30) {
      alert("Możesz dodać maksymalnie 30 zdjęć");
      return;
    }
    
    // Sprawdź czy łączna liczba zdjęć nie przekracza limitu
    if (images.length + files.length > 30) {
      alert(`Możesz dodać maksymalnie 30 zdjęć. Masz już ${images.length} zdjęć.`);
      return;
    }
    
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearAllImages = () => {
    setImages([]);
  };


  const uploadImages = async (vin, files) => {
    if (!files || files.length === 0) return;

    // Sprawdź czy nie przekracza limitu
    if (files.length > 30) {
      console.error("Przekroczono limit 30 zdjęć");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const token = getToken();

    try {
      const response = await fetch(`http://localhost:8000/api/vehicles/${vin}/images/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Zdjęcia zostały przesłane pomyślnie:", data);
      } else {
        console.error("Błąd przy przesyłaniu zdjęć:", data);
      }

    } catch (err) {
      console.error("Błąd uploadu zdjęć:", err);
    }
  };


  useEffect(() => {
    // Pobierz marki
    const fetchMakes = async () => {
      try {
        const token = getToken();
        const res = await fetch('http://localhost:8000/api/makes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setMakes(data);
        } else if (Array.isArray(data.results)) {
          setMakes(data.results);
        } else {
          console.error("Nieprawidłowy format danych z API:", data);
          setMakes([]);
        }
      } catch (err) {
        console.error("Błąd przy pobieraniu marek:", err);
        setMakes([]);
      }
    };

    fetchMakes();
  }, []);

  // Pobierz modele po zmianie marki
  useEffect(() => {
    if (!selectedMake) return;
    const fetchModels = async () => {
      try {
        const token = getToken();
        const res = await fetch(`http://localhost:8000/api/models/?make=${selectedMake}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setModels(data); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchModels();
  }, [selectedMake]);

  useEffect(() => {
    if (selectedModel) {
      fetch(`http://localhost:8000/api/generations/?model=${selectedModel}`)
        .then(res => res.json())
        .then(data => setGenerations(data))
        .catch(err => console.error(err));
    } else {
      setGenerations([]);
      setSelectedGeneration('');
    }
  }, [selectedModel]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : 
              type === 'date' ? value : value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Walidacja liczby zdjęć
    if (images.length > 30) {
      setError("Możesz dodać maksymalnie 30 zdjęć");
      setLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      generation_id: selectedGeneration || null, // DODAJ TE LINIE
    };
    
    console.log("📤 Form data do wysłania:", submitData);
    console.log("🔍 Generation ID:", submitData.generation_id);

    // USUŃ niepotrzebne pola które nie są w modelu Vehicle
    delete submitData.make;
    delete submitData.model;
    delete submitData.generation; // USUŃ stare pole

    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/vehicles/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Odpowiedź z backendu:", data);

      if (response.ok) {
        // Upload zdjęć po utworzeniu pojazdu
        if (images.length > 0 && data.vin) {
          await uploadImages(data.vin, images);
        }
        setSuccess("Pojazd i zdjęcia zostały przesłane pomyślnie!");
        
        setImages([]);
        

        // Reset form
        setFormData({
          generation_id: '', // DODAJ
          production_year: new Date().getFullYear(),
          vin: '',
          odometer: 0,
          body_color: 'Biały',
          interior_color: 'Czarny',
          price: 0.0,
          first_registration: '',
          fuel_type: 'Diesel',
          transmission: 'Manual',
          drive_type: 'FWD',
          location: '',
          wheel_size: '',
          for_sale: false,
          registration:''
        });

        setSelectedMake('');
        setSelectedModel('');
        setSelectedGeneration('');
        
        setTimeout(() => {
           window.location.href = '/VehicleList';
        }, 3000);

      } else {
        setError(JSON.stringify(data, null, 2));
        console.log("Błąd:", data);
      }
    } catch (err) {
        let errorMessage = '';
        if (err.response) {
            try {
                const errorData = await err.response.json();
                errorMessage = JSON.stringify(errorData, null, 2);
            } catch {
                errorMessage = err.response.statusText;
            }
        } else {
            errorMessage = err.message;
        }
        console.error('Błąd:', errorMessage);
        setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredMakes = makes.filter(make =>
    make.name?.toLowerCase().includes(searchMake.toLowerCase())
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <DashboardLayout>
      <div className={styles["add-vehicle-container"]}>
        <div className={styles["header-section"]}>
          <Link href="/VehicleList" className={styles["back-link"]}>
            &larr; Powrót do listy pojazdów
          </Link>
          <h1 className={styles["page-title"]}>Dodaj nowy pojazd</h1>
          <p className={styles["subtitle"]}>Wypełnij formularz, aby dodać nowy pojazd do swojej kolekcji</p>
        </div>

        <form onSubmit={handleSubmit} className={styles["vehicle-form"]} encType="multipart/form-data">
          {/* Sekcja 1: Podstawowe informacje */}
          <div className={styles["form-section"]}>
            <h2 className={styles["section-title"]}>Podstawowe informacje</h2>
            <div className={styles["form-grid"]}>

              <div className={styles["form-group"]}>
                <label>Marka *</label>
                <select
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    setSelectedModel('');
                    setFormData(prev => ({ ...prev, make: e.target.value, model: '' }));
                  }}
                  required
                  className={styles["form-control"]}
                >
                  <option value="">Wybierz markę</option>
                  {makes.map(make => (
                    <option key={make.id} value={make.id}>{make.name}</option>
                  ))}
                </select>
              </div>

              {selectedMake && (
                <div className={styles["form-group"]}>
                  <label>Model *</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      setFormData(prev => ({ ...prev, model: e.target.value }));
                    }}
                    required
                    className={styles["form-control"]}
                  >
                    <option value="">Wybierz model</option>
                    {models.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedModel && (
                <div className={styles["form-group"]}>
                  <label>Generacja</label>
                  <select
                    value={selectedGeneration}
                    onChange={(e) => {
                      setSelectedGeneration(e.target.value);
                      setFormData(prev => ({ ...prev, generation_id: e.target.value }));
                    }}
                    className={styles["form-control"]}
                  >
                    <option value="">Wybierz generację</option>
                    {generations.map(gen => (
                      <option key={gen.id} value={gen.id}>
                        {gen.name} ({gen.production_start}–{gen.production_end || "?"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles["form-group"]}>
                <label>Rok produkcji *</label>
                <select
                  name="production_year"
                  value={formData.production_year}
                  onChange={handleChange}
                  required
                  className={styles["form-control"]}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className={styles["form-group"]}>
                <label>VIN *</label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  required
                  maxLength={17}
                  className={styles["form-control uppercase"]}
                  placeholder="17-znakowy numer VIN"
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Przebieg (km) *</label>
                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className={styles["form-control"]}
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Lokalizacja</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={styles["form-control"]}
                  placeholder="np. Warszawa"
                />
              </div>
            </div>
          </div>

          {/* Sekcja 2: Specyfikacja techniczna */}
          <div className={styles["form-section"]}>
            <h2 className={styles["section-title"]}>Specyfikacja techniczna</h2>
            <div className={styles["form-grid"]}>

              <div className={styles["form-group"]}>
                <label>Rodzaj paliwa</label>
                <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className={styles["form-control"]}>
                  <option value="Benzyna">Benzyna</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybryda">Hybryda</option>
                  <option value="Elektryczny">Elektryczny</option>
                </select>
              </div>

              <div className={styles["form-group"]}>
                <label>Skrzynia biegów</label>
                <select name="transmission" value={formData.transmission_type} onChange={handleChange} className={styles["form-control"]}>
                  <option value="Manual">Manual</option>
                  <option value="Automat">Automat</option>
                </select>
              </div>

              <div className={styles["form-group"]}>
                <label>Napęd</label>
                <select name="drive_type" value={formData.drive_type} onChange={handleChange} className={styles["form-control"]}>
                  <option value="FWD">Napęd na przód</option>
                  <option value="RWD">Napęd na tył</option>
                  <option value="AWD">Napęd na wszystkie koła</option>
                  <option value="4WD">4x4 / 4WD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sekcja 3: Wygląd i dodatkowe informacje */}
          <div className={styles["form-section"]}>
            <h2 className={styles["section-title"]}>Wygląd i dodatkowe informacje</h2>
            <div className={styles["form-grid"]}>

              <div className={styles["form-group"]}>
                <label>Kolor nadwozia</label>
                <select name="body_color" value={formData.body_color} onChange={handleChange} className={styles["form-control"]}>
                  <option value="Czarny">Czarny</option>
                  <option value="Biały">Biały</option>
                  <option value="Srebrny">Srebrny</option>
                  <option value="Szary">Szary</option>
                  <option value="Czerwony">Czerwony</option>
                  <option value="Niebieski">Niebieski</option>
                  <option value="Zielony">Zielony</option>
                  <option value="Beżowy">Beżowy</option>
                  <option value="Żółty">Żółty</option>
                  <option value="Inny">Inny</option>
                </select>
              </div>

              <div className={styles["form-group"]}>
                <label>Kolor wnętrza</label>
                <select name="interior_color" value={formData.interior_color} onChange={handleChange} className={styles["form-control"]}>
                  <option value="Czarny">Czarny</option>
                  <option value="Beżowy">Beżowy</option>
                  <option value="Szary">Szary</option>
                  <option value="Brązowy">Brązowy</option>
                  <option value="Biały">Biały</option>
                  <option value="Czerwony">Czerwony</option>
                  <option value="Inny">Inny</option>
                </select>
              </div>

              <div className={styles["form-group"]}>
                <label>Cena (PLN)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberChange}
                  min="0"
                  step="0.01"
                  className={styles["form-control"]}
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Data pierwszej rejestracji</label>
                <input
                  type="date"
                  name="first_registration"
                  value={formData.first_registration}
                  onChange={handleChange}
                  className={styles["form-control"]}
                />
              </div>
              <div className={styles["form-group"]}>
                <label>Numer rejestracyjny</label>
                <input
                  type="text"
                  name="registration"
                  value={formData.registration}
                  onChange={handleChange}
                  className={styles["form-control"]}
                />
              </div>
            </div>
          </div>


          {/* Zdjęcia */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              Zdjęcia pojazdu 
              <span className={styles.imagesCount}>
                ({images.length}/30)
              </span>
            </h2>
            
            <div className={styles.fileInputContainer}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className={styles.formControl}
                disabled={images.length >= 30}
              />
              <p className={styles.imagesInfo}>
                Możesz dodać maksymalnie 30 zdjęć. Wybrano: {images.length}/30
              </p>
            </div>

            {images.length > 0 && (
              <div className={styles.imagesPreview}>
                <div className={styles.previewHeader}>
                  <span className={styles.previewTitle}>
                    Podgląd zdjęć ({images.length})
                  </span>
                  <button
                    type="button"
                    onClick={clearAllImages}
                    className={styles.clearAllButton}
                  >
                    Usuń wszystkie
                  </button>
                </div>
                
                <div className={styles.imagesGrid}>
                  {images.map((img, i) => {
                    const objectUrl = URL.createObjectURL(img);
                    return (
                      <div key={i} className={styles.imageContainer}>
                        <img
                          src={objectUrl}
                          alt={`preview-${i}`}
                          className={styles.imagePreview}
                          onLoad={() => URL.revokeObjectURL(objectUrl)}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className={styles.removeButton}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {images.length >= 30 && (
              <p className={styles.limitWarning}>
                Osiągnięto limit 30 zdjęć. Aby dodać nowe, usuń niektóre z istniejących.
              </p>
            )}
          </div>


          {/* Przyciski */}
          <div className={styles["form-buttons"]}>
            <Link href="/vehicles" className={styles["btn btn-secondary"]}>Anuluj</Link>
            <button type="submit" disabled={loading} className={styles["btn btn-primary"]}>
              {loading ? 'Dodawanie...' : 'Dodaj pojazd'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}