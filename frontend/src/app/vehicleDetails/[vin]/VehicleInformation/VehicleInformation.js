"use client";

import styles from "./VehicleInformation.module.css"

export function VehicleInformationOverlay({ car }){
    return (
        <div className={styles.overlay}>
        {/* Overlay z podstawowymi danymi */}
            <div className="flex flex-col">
                <span className={styles.leftSmall}>Marka</span>
                <span className={styles.left}>{car.generation?.model?.make?.name}</span>
            </div>

            <div className="flex gap-8">
                <div className="flex flex-col text-right">
                    <span className={styles.rightSmall}>Model</span>
                    <span className={styles.right}>{car.generation?.model?.name}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className={styles.rightSmall}>Paliwo</span>
                    <span className={styles.right}>{car.fuel_type}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className={styles.rightSmall}>Przebieg</span>
                    <span className={styles.right}>{car.odometer}</span>
                </div>
            </div>
        </div>
    );
}

export function VehicleInformation({ car, showMore, setShowMore }){
    return(
        
      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col lg:flex-row items-start justify-between gap-6">
        {/* Główne dane auta */}
        <div className="flex-1">
            <h2 className="text-xl font-semibold">{car.title || car.name}</h2>
            <p className="text-gray-500 mt-2 text-sm">{car.description}</p>

            {!showMore && (
                <button onClick={() => setShowMore(true)} className="mt-4 flex items-center gap-2 text-black font-medium hover:underline">
                    Załaduj więcej →
                </button>
            )}
        </div>

        <div className="flex-1">
            <h3 className="font-semibold">Kolor nadwozia</h3>
            <p className="text-gray-500 text-sm mb-2">{car.body_color || "Metalik"}</p>
            <div className="flex items-center gap-3">
                {car.body_colors?.map((c) => (
                    <div key={c} className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer" style={{ backgroundColor: c }}/>
                ))}
            </div>
        </div>

        <div className="flex-1">
            <h3 className="font-semibold">Kolor wnętrza</h3>
            <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-gray-200 rounded">{car.interior_color}</span>
            </div>
        </div>

        <div className="flex-1">
            <h3 className="font-semibold">Koła</h3>
            <div className="flex items-center gap-3 mt-2">
                <p className="text-2xl font-bold">{car.wheel_size}</p>
            </div>
        </div>

        <div className="flex-1 text-right">
            <h3 className="font-semibold">Wartość</h3>
            <p className="text-2xl font-bold">{car.price}</p>
            <div className="flex gap-3 mt-4 justify-end">
                <button className="px-4 py-2 border rounded-full hover:bg-gray-100"> Aktualizuj dane → </button>
                <button className="px-4 py-2 border rounded-full hover:bg-gray-100"> Usuń pojazd → </button>
            </div>
        </div>
      </div>
    );
}