"use client";

import { useEffect, useState } from 'react';
import api from '../services/api';
import Filters from '../components/Filters';
import CarCard from '../components/CarCard';

export default function marketplace() {
  const [cars, setCars] = useState([]);
  const [tab, setTab] = useState('all');

  const fetchCars = async (params = {}) => {
    try {
      const res = await api.get('vehicles/for-sale/', { params });
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Filters onFilter={fetchCars} />

      <div className="flex justify-between items-center mt-8 mb-4">
        <div className="space-x-6 text-gray-500 font-medium">
          <button
            onClick={() => setTab('all')}
            className={tab === 'all' ? 'text-orange-500 font-bold' : ''}
          >
            All
          </button>
          <button
            onClick={() => setTab('new')}
            className={tab === 'new' ? 'text-orange-500 font-bold' : ''}
          >
            New
          </button>
          <button
            onClick={() => setTab('used')}
            className={tab === 'used' ? 'text-orange-500 font-bold' : ''}
          >
            Used
          </button>
        </div>

        <div className="text-gray-500 text-sm">
          Sort by:
          <select className="ml-2 border rounded px-2 py-1">
            <option>Date Listed: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">{cars.length} Results</h1>

      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
