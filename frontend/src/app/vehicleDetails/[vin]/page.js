"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getToken } from "../../services/auth";
import styles from "../vehicleDetails.module.css";

export default function VehicleDetails() {
  const { vin } = useParams();

  const [car, setCar] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showMore, setShowMore] = useState(false);

  // Fetch danych auta z API
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:8000/api/vehicles/${vin}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error("Błąd pobierania auta: ${response.status}");
        const data = await response.json();
        setCar(data);
      } catch (err) {
        console.error("Błąd pobierania auta:", err);
      }
    };

    fetchCar();
  }, [vin]);

  // Autoplay slidera co 5 sekund
  useEffect(() => {
    if (!car?.images?.length) return;

    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % car.images.length),
      5000
    );
    return () => clearInterval(interval);
  }, [car]);

  if (!car) {
    return <div className={styles.loading}>Ładowanie danych pojazdu...</div>;
  }

  return (
    <>
      {/* Slider z obrazami auta */}
      <div className={styles.hero}>
        <div className={styles.slider}>
          {car.images?.map((img, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === current ? styles.active : ""}`}
            >
              <Image
                src={img}
                alt={car.name}
                fill
                className={styles.image}
                priority={index === current}
              />
            </div>
          ))}
        </div>

        {/* Overlay z podstawowymi danymi */}
        <div className={styles.overlay}>
          <div className="flex flex-col">
            <span className={styles.leftSmall}>Model</span>
            <span className={styles.left}>{car.name}</span>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col text-right">
              <span className={styles.rightSmall}>Silnik</span>
              <span className={styles.right}>{car.engine}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className={styles.rightSmall}>Paliwo</span>
              <span className={styles.right}>{car.fuel}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className={styles.rightSmall}>Moc</span>
              <span className={styles.right}>{car.power}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Główne dane auta */}
      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{car.title || car.name}</h2>
          <p className="text-gray-500 mt-2 text-sm">{car.description}</p>

          {!showMore && (
            <button
              onClick={() => setShowMore(true)}
              className="mt-4 flex items-center gap-2 text-black font-medium hover:underline"
            >
              Załaduj więcej →
            </button>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">Kolor nadwozia</h3>
          <p className="text-gray-500 text-sm mb-2">{car.body_color || "Metalik"}</p>
          <div className="flex items-center gap-3">
            {car.body_colors?.map((c) => (
              <div
                key={c}
                className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">Kolor wnętrza</h3>
          <div className="flex items-center gap-3">
            {car.interior_colors?.map((c) => (
              <div
                key={c}
                className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">Koła</h3>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-2xl font-bold">{car.wheels}</p>
          </div>
        </div>

        <div className="flex-1 text-right">
          <h3 className="font-semibold">Wartość</h3>
          <p className="text-2xl font-bold">${car.price}</p>
          <div className="flex gap-3 mt-4 justify-end">
            <button className="px-4 py-2 border rounded-full hover:bg-gray-100">
              Aktualizuj dane →
            </button>
            <button className="px-4 py-2 border rounded-full hover:bg-gray-100">
              Usuń pojazd →
            </button>
          </div>
        </div>
      </div>

      {/* Dodatkowe informacje po kliknięciu */}
      {showMore && (
        <div className="w-full mt-6 bg-gray-50 rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Dodatkowe informacje</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Przyspieszenie 0-100 km/h: {car.acceleration}</li>
            <li>Maksymalny moment obrotowy: {car.torque}</li>
            <li>Napęd: {car.drive}</li>
            <li>Rocznik: {car.year}</li>
          </ul>
        </div>
      )}
    </>
  );
}
