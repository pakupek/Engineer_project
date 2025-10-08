"use client";

import { useState } from 'react';
import Link from 'next/link';
import { getToken } from "../services/auth";

export default function AddVehiclePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
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
    tire_size: '',
    for_sale: false
  });

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

      if (response.ok) {
        setSuccess('Pojazd został pomyślnie dodany!');
        // Reset form
        setFormData({
          make: '',
          model: '',
          year: new Date().getFullYear(),
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
          tire_size: '',
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* Podstawowe informacje */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Podstawowe informacje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marka *
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Corolla"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rok produkcji *
              </label>
              <select
                name="year"
                value={formData.year}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rozmiar opon
              </label>
              <select
                name="tire_size"
                value={formData.tire_size}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wybierz rozmiar</option>
                <option value="195/65 R15">195/65 R15</option>
                <option value="205/55 R16">205/55 R16</option>
                <option value="225/45 R17">225/45 R17</option>
                <option value="235/40 R18">235/40 R18</option>
                <option value="245/35 R19">245/35 R19</option>
                <option value="255/30 R20">255/30 R20</option>
                <option value="265/35 R21">265/35 R21</option>
                <option value="275/30 R22">275/30 R22</option>
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