"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToken } from "../services/auth";

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
        console.log('Rendering makes:', makes.map(m => ({ id: m.id, name: m.name })));
        setMakes(data);
      } catch (err) {
        console.error(err);
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
    make.name.toLowerCase().includes(searchMake.toLowerCase())
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/vehicles" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          &larr; Powrót do listy pojazdów
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Dodaj nowy pojazd</h1>
        <p className="text-gray-600 mt-2">Wypełnij formularz, aby dodać nowy pojazd do swojej kolekcji</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* Podstawowe informacje */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Podstawowe informacje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marka *
              </label>
              <select
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setSelectedModel('');
                  setFormData(prev => ({ ...prev, make: e.target.value, model: '' }));
                }}
                className="w-full border px-2 py-1 rounded"
                required
              >
                <option value="">Wybierz markę</option>
                {makes.map(make => (
                  <option key={make.id} value={make.id}>{make.name}</option>
                ))}
              </select>
            </div>

            {/* Wybór modelu po wybraniu marki */}
            {selectedMake && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    setFormData(prev => ({ ...prev, model: e.target.value }));
                  }}
                  className="w-full border px-2 py-1 rounded"
                  required
                >
                  <option value="">Wybierz model</option>
                  {models.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                    
                  ))}
                </select>
              </div>
            )}

            {selectedModel && (
              <div>
                <label className="block font-medium mb-1">Generacja:</label>
                <select
                  value={selectedGeneration}
                  onChange={(e) => {
                    setSelectedGeneration(e.target.value);
                    setFormData(prev => ({ ...prev, generation: parseInt(e.target.value, 10) }));
                  }}
                  className="w-full border px-2 py-1 rounded"
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


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rok produkcji *
              </label>
              <select
                name="year"
                value={formData.production_year}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VIN *
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                required
                maxLength={17}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="17-znakowy numer VIN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Przebieg (km) *
              </label>
              <input
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleNumberChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokalizacja
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Warszawa"
              />
            </div>
          </div>
        </div>

        {/* Specyfikacja techniczna */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Specyfikacja techniczna</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rodzaj paliwa
              </label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Benzyna">Benzyna</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybryda">Hybryda</option>
                <option value="Elektryczny">Elektryczny</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skrzynia biegów
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Manual">Manual</option>
                <option value="Automat">Automat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Napęd
              </label>
              <select
                name="drive_type"
                value={formData.drive_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FWD">Napęd na przód</option>
                <option value="RWD">Napęd na tył</option>
                <option value="AWD">Napęd na wszystkie koła</option>
                <option value="4WD">4x4 / 4WD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rozmiar felg
              </label>
              <select
                name="wheel_size"
                value={formData.wheel_size}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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

        {/* Wygląd i dodatkowe informacje */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Wygląd i dodatkowe informacje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kolor nadwozia
              </label>
              <select
                name="body_color"
                value={formData.body_color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kolor wnętrza
              </label>
              <select
                name="interior_color"
                value={formData.interior_color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Czarny">Czarny</option>
                <option value="Beżowy">Beżowy</option>
                <option value="Szary">Szary</option>
                <option value="Brązowy">Brązowy</option>
                <option value="Biały">Biały</option>
                <option value="Czerwony">Czerwony</option>
                <option value="Inny">Inny</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cena (PLN)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleNumberChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data pierwszej rejestracji
              </label>
              <input
                type="date"
                name="first_registration"
                value={formData.first_registration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Opcje sprzedaży */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="for_sale"
              checked={formData.for_sale}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Wystawiony na sprzedaż
            </label>
          </div>
        </div>

        {/* Przyciski */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/vehicles"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Dodawanie...' : 'Dodaj pojazd'}
          </button>
        </div>
      </form>
    </div>
  );
}