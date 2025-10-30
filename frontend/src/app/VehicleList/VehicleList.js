import VehicleCard from './VehicleCard';
import styles from "./VehicleList.module.css"

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
    <div className={styles["vehicle-list"]}>
      {vehicles.map(vehicle => (
        <VehicleCard 
          key={vehicle.vin} 
          vehicle={vehicle} 
          onDelete={onDeleteVehicle}
          onViewDetails={(vin) => window.location.href = `/VehicleDetails/${vin}`}
        />
      ))}
    </div>
  );
}