import VehicleCard from './VehicleCard';

export default function VehicleList({ vehicles, onDeleteVehicle }) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          Nie masz jeszcze żadnych pojazdów
        </div>
        <button 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => window.location.href = '/vehicles/add'}
        >
          Dodaj pierwszy pojazd
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <VehicleCard 
          key={vehicle.vin} 
          vehicle={vehicle} 
          onDelete={onDeleteVehicle}
          onViewDetails={(vin) => window.location.href = `/vehicleDetails/${vin}`}
        />
      ))}
    </div>
  );
}