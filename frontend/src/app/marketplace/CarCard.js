export default function CarCard({ car }) {
  return (
    <div className="flex bg-white rounded-2xl shadow-md p-4 mb-4">
      <div className="w-1/3">
        <img
          src={`http://localhost:8000${car.image}`}
          alt={car.make}
          className="rounded-lg w-full h-40 object-cover"
        />
      </div>
      <div className="w-2/3 pl-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {car.make} {car.model}
          </h2>
          <p className="text-gray-500">
            {car.year} • {car.fuel_type} • {car.transmission}
          </p>
          <p className="text-gray-500 mt-1">Location: {car.location}</p>
        </div>
        <p className="text-orange-600 text-2xl font-bold">${car.price}</p>
      </div>
    </div>
  );
}
