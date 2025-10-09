import { useState } from 'react';

export default function Filters({ onFilter }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [min_price, setMinPrice] = useState('');
  const [max_price, setMaxPrice] = useState('');
  const [drive_type, setDriveType] = useState('');
  const [fuel_type, setFuelType] = useState('');

  const handleSearch = () => {
    onFilter({ make, model, location, min_price, max_price, drive_type, fuel_type });
  };

  const handleClear = () => {
    setMake('');
    setModel('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setDriveType('');
    setFuelType('');
    onFilter({});
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 bg-white p-4 rounded-2xl shadow" style={{ marginTop: '50px'}}>
      {/* Marka */}
      <input
        placeholder="Make"
        value={make}
        onChange={(e) => setMake(e.target.value)}
        className="p-2 border rounded-lg"
      />

      {/* Model */}
      <input
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="p-2 border rounded-lg"
      />

      {/* Lokalizacja */}
      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 border rounded-lg"
      />

      {/* Cena minimalna */}
      <input
        type="number"
        placeholder="Min Price"
        value={min_price}
        onChange={(e) => setMinPrice(e.target.value)}
        className="p-2 border rounded-lg"
      />

      {/* Cena maksymalna */}
      <input
        type="number"
        placeholder="Max Price"
        value={max_price}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="p-2 border rounded-lg"
      />

      {/* Typ napędu */}
      <select
        value={drive_type}
        onChange={(e) => setDriveType(e.target.value)}
        className="p-2 border rounded-lg"
      >
        <option value="">Drive Type</option>
        <option value="FWD">Front Wheel Drive</option>
        <option value="RWD">Rear Wheel Drive</option>
        <option value="AWD">All Wheel Drive</option>
        <option value="4WD">4x4 / 4WD</option>
      </select>

      {/* Typ paliwa */}
      <select
        value={fuel_type}
        onChange={(e) => setFuelType(e.target.value)}
        className="p-2 border rounded-lg"
      >
        <option value="">Fuel Type</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Electric">Electric</option>
      </select>

      {/* Przyciski */}
      <div className="flex gap-2 col-span-2 md:col-span-1">
        <button
          onClick={handleSearch}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
