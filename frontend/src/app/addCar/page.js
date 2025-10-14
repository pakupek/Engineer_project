"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToken } from "../services/auth";
import styles from "./AddCar.module.css"
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
  

  const [generations, setGenerations] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    generation: '',
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
    for_sale: false
  });

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

    console.log("Form data do wysłania:", formData);

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
        setSuccess('Pojazd został pomyślnie dodany!');
        // Reset form
        setFormData({
          make: '',
          model: '',
          generation: '',
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
          for_sale: false
        });
        
        setTimeout(() => {
           window.location.href = '/home';
        }, 2000);

      } else {
        setError(JSON.stringify(data, null, 2));
        console.log("Błąd:", data);
      }
    } catch (err) {
        setError(JSON.stringify(data, null, 2));
        console.log("Błąd:", data);

        console.error('Error:', err);
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
          <Link href="/carList" className={styles["back-link"]}>
            &larr; Powrót do listy pojazdów
          </Link>
          <h1 className={styles["page-title"]}>Dodaj nowy pojazd</h1>
          <p className={styles["subtitle"]}>Wypełnij formularz, aby dodać nowy pojazd do swojej kolekcji</p>
        </div>

        <form onSubmit={handleSubmit} className={styles["vehicle-form"]}>
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
                      setFormData(prev => ({ ...prev, generation: e.target.value }));
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
                <select name="transmission" value={formData.transmission} onChange={handleChange} className={styles["form-control"]}>
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

              <div className={styles["form-group"]}>
                <label>Rozmiar felg</label>
                <select name="wheel_size" value={formData.wheel_size} onChange={handleChange} className={styles["form-control"]}>
                  <option value="">Wybierz rozmiar</option>
                  <option value='15"'>15"</option>
                  <option value='16"'>16"</option>
                  <option value='17"'>17"</option>
                  <option value='18"'>18"</option>
                  <option value='19"'>19"</option>
                  <option value='20"'>20"</option>
                  <option value='21"'>21"</option>
                  <option value='22"'>22"</option>
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
            </div>
          </div>

          {/* Sekcja 4: Opcje sprzedaży */}
          <div className={styles["form-section checkbox-group"]}>
            <input
              type="checkbox"
              name="for_sale"
              checked={formData.for_sale}
              onChange={handleChange}
              id="for_sale"
            />
            <label htmlFor="for_sale">Wystawiony na sprzedaż</label>
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