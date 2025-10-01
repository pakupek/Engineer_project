"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./vehicleDetails.module.css";

const cars = [
  {
    name: "911 Carrera 4S",
    img: "/images/911_1.jpg",
    speed: "245 mph",
    engine: 3.6,
    fuel: "Benzyna",
    power: 340,
  },
  {
    name: "911 Turbo S",
    img: "/images/911_2.jpg",
    speed: "205 mph",
    engine: 3.0,
    fuel: "Benzyna",
    power: 500,
  },
  {
    name: "911 GT3 RS",
    img: "/images/911_3.jpg",
    speed: "198 mph",
    engine: 3.6,
    fuel: "Benzyna + LPG",
    power: 300,
  },
];

export default function vehicleDetails() {
  const [current, setCurrent] = useState(0);
  const [showMore, setShowMore] = useState(false);

  // Autoplay co 5 sekund
  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % cars.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={styles.hero}>

        {/* Slider w tle */}
        <div className={styles.slider}>
          {cars.map((car, index) => (
            <div
              key={index}
              className={`${styles.slide} ${
                index === current ? styles.active : ""
              }`}
            >
              <Image
                src={car.img}
                alt={car.name}
                fill
                className={styles.image}
                priority={index === current}
              />
            </div>
          ))}
        </div>
        {/* Stały overlay na dole */}
        <div className={styles.overlay}>
          {/* Lewa strona */}
          <div className="flex flex-col">
            <span className={styles.leftSmall}>Model</span>
            <span className={styles.left}>{cars[current].name}</span>
          </div>

          {/* Prawa strona */}
          <div className="flex gap-8">
            <div className="flex flex-col text-right">
              <span className={styles.rightSmall}>Silnik</span>
              <span className={styles.right}>{cars[current].engine}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className={styles.rightSmall}>Paliwo</span>
              <span className={styles.right}>{cars[current].fuel}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className={styles.rightSmall}>Moc</span>
              <span className={styles.right}>{cars[current].power}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col lg:flex-row items-start justify-between gap-6">
        {/* Tekst */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Timeless design, contemporary interpretation.</h2>
          <p className="text-gray-500 mt-2 text-sm">
            The shape of the 911 Carrera is unmistakable because of its iconic flyline and elegant roof lines. 
            These have characterized Porsche since 1963, as have sports cars with astonishing performance.
          </p>
          {!showMore && (
            <button
              onClick={() => setShowMore(true)}
              className="mt-4 flex items-center gap-2 text-black font-medium hover:underline"
            >
              Załaduj więcej →
            </button>
          )}
        </div>

        {/* Kolory nadwozia i wnętrza*/}
        <div className="flex-1">
          <h3 className="font-semibold">Kolor nadwozia</h3>
          <p className="text-gray-500 text-sm mb-2">Metalik</p>
          <div className="flex items-center gap-3">
            {["black", "red", "blue", "gray", "white", "yellow"].map((c) => (
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
              {["black", "red", "blue", "gray", "white", "yellow"].map((c) => (
                <div
                  key={c}
                  className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

        {/* Rozmiar kół */}
        <div className="flex-1">
          <h3 className="font-semibold">Koła</h3>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-2xl font-bold">245/55/R19</p>
          </div>
        </div>

        {/* Cena */}
        <div className="flex-1 text-right">
          <h3 className="font-semibold">Wartość</h3>
          <p className="text-2xl font-bold">$141,090</p>

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

      {/* Sekcja ładowana po kliknięciu */}
        {showMore && (
          <div className="w-full mt-6 bg-gray-50 rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Dodatkowe informacje</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Przyspieszenie 0-100 km/h: 3.5s</li>
              <li>Maksymalny moment obrotowy: 530 Nm</li>
              <li>Napęd: AWD</li>
              <li>Rocznik: 2023</li>
            </ul>
          </div>
        )}
    </>
  );
}
