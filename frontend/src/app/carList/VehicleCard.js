"use client";

import { useState } from 'react';

export default function VehicleCard({ vehicle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Czy na pewno chcesz usunąć ten pojazd?')) {
      setIsDeleting(true);
      await onDelete(vehicle.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {vehicle.brand} {vehicle.model}
        </h3>
      </div>

      <div className="space-y-2 text-gray-600">
        <div className="flex justify-between">
          <span>Rejestracja:</span>
          <span className="font-medium">{vehicle.licensePlate}</span>
        </div>
        <div className="flex justify-between">
          <span>Rok produkcji:</span>
          <span className="font-medium">{vehicle.year}</span>
        </div>
        <div className="flex justify-between">
          <span>Przebieg:</span>
          <span className="font-medium">{vehicle.odometer?.toLocaleString()} km</span>
        </div>
        <div className="flex justify-between">
          <span>Typ paliwa:</span>
          <span className="font-medium">{vehicle.fuel_type}</span>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button 
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          onClick={() => window.location.href = `/vehicles/${vehicle.id}/edit`}
        >
          Edytuj
        </button>
        <button 
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors disabled:bg-red-300"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Usuwanie...' : 'Usuń'}
        </button>
      </div>
    </div>
  );
}