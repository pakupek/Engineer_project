export default function CarCard({ car }) {
  // Funkcja do wyświetlania lat produkcji
  const renderProductionYears = (generation) => {
    if (!generation) return "Brak danych";
    const start = generation.production_start;
    const end = generation.production_end;
    if (start) {
      return end ? `${start} – ${end}` : `${start}`;
    }
    return "Brak danych";
  };

  const generation = car.generation || {};
  const model = generation.model || {};
  const make = model.make || {};

  return (
    <div className="flex bg-white rounded-2xl shadow-md p-4 mb-4">
      <div className="w-1/3">
        <img
          src={car.image ? `http://localhost:8000${car.image}` : "/placeholder.png"}
          alt={`${make.name || "Nieznana marka"} ${model.name || ""}`}
          className="rounded-lg w-full h-40 object-cover"
        />
      </div>
      <div className="w-2/3 pl-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {make.name || "Nieznana marka"} {model.name || "Nieznany model"} {generation.name || ""}
          </h2>
          <p className="text-gray-500">
            {renderProductionYears(generation)}
          </p>
          <p className="text-gray-500 mt-1">
            Location: {car.location || "Brak danych"}
          </p>
        </div>
        <p className="text-orange-600 text-2xl font-bold">
          ${car.price?.toLocaleString() || "0"}
        </p>
      </div>
    </div>
  );
}
