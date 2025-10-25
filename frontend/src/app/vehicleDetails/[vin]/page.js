"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getToken } from "../../services/auth";
import styles from "../vehicleDetails.module.css";
import DamageForm from "./DamageForm";
import DamageHistory from "./DamageHistory";

export default function carDetails() {
  const { vin } = useParams();

  const [car, setCar] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [images, setImages] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceEntries, setServiceEntries] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null); 
  const [damageEntries, setDamageEntries] = useState([]);


  const getProductionYears = (generation) => {
    if (!generation) return "Brak danych";
    const start = generation.production_start;
    const end = generation.production_end;
    return start ? (end ? `${start} – ${end}` : `${start}`) : "Brak danych";
  };



  // Pobieranie wpisów serwisowych
  useEffect(() => {
    const fetchServiceEntries = async () => {
      try {
        const token = getToken();
        const res = await fetch(`http://localhost:8000/api/service-entries/${vin}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Błąd pobierania wpisów serwisowych");
        const data = await res.json();
        setServiceEntries(data);
      } catch (err) {
        console.error("Błąd:", err);
      }
    };

    if (vin) {
      fetchServiceEntries();
    }
  }, [vin]);


  // Funkcja do dodawania wpisu serwisowego
  const handleAddServiceEntry = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const token = getToken();
      
      const response = await fetch(`http://localhost:8000/api/service-entry/${vin}/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
         
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.errors || `Błąd: ${response.status}`);
      }

      // Dodaj nowy wpis do listy
      setServiceEntries(prev => [responseData.data, ...prev]);
      alert("Wpis serwisowy został dodany pomyślnie!");
      e.target.reset();
      
    } catch (error) {
      console.error("Błąd dodawania wpisu:", error);
      alert(`Nie udało się dodać wpisu serwisowego: ${error.message}`);
    }
  };


  // Pobranie osi czasu z historiapojazdugov.pl
  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/api/vehicle-history/${vin}/`);
      const data = await res.json();

      if (data.success) {
        setTimeline(data);
      } else {
        setError(data.message || data.error);
      }
    } catch (err) {
      setError("Błąd połączenia z serwerem");
    } finally {
      setLoading(false);
    }
  };


  // Fetch danych auta z API
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const token = getToken();
        console.log("Token JWT:", token);
        const response = await fetch(`http://localhost:8000/api/vehicles/${vin}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error(`Błąd pobierania auta: ${response.status}`);
        const data = await response.json();
        setCar(data);
      } catch (err) {
        console.error("Błąd pobierania auta:", err);
      }
    };

    fetchCar();
  }, [vin]);

  // Pobierz zdjęcia pojazdu
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:8000/api/vehicles/${vin}/images/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Błąd pobierania zdjęć: ${response.status}`);
        const data = await response.json();

        // Poprawny format URL zdjęć
        const imageUrls = data
          .map((img) =>
            img.image && img.image.trim() !== ""
              ? img.image.startsWith("http")
                ? img.image
                : `http://localhost:8000${img.image}`
              : null
          )
          .filter(Boolean); // usuwa null-e
        setImages(imageUrls);
      } catch (err) {
        console.error("Błąd pobierania zdjęć:", err);
      }
    };

    fetchImages();
  }, [vin]);

 // Autoplay slidera co 5 sekund
  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);


  if (!car) {
    return <div className={styles.loading}>Ładowanie danych pojazdu...</div>;
  }

  return (
    <>
      {/* Slider z obrazami auta */}
      <div className={styles.hero}>
        <div className={styles.slider}>
          {car.images?.filter((imgObj) => imgObj?.image && imgObj.image.trim() !== "").map((imgObj, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === current ? styles.active : ""}`}
            >
              <Image
                src={
                imgObj.image.startsWith("http")
                  ? imgObj.image
                  : `http://localhost:8000${imgObj.image}`
              }
                alt={car?.name ? `Zdjęcie pojazdu: ${car.name}` : "Zdjęcie pojazdu"}
                fill
                className={styles.image}
                priority={index === current}
                unoptimized={true}
              />
            </div>
          ))}
        </div>

        {/* Overlay z podstawowymi danymi */}
        <div className={styles.overlay}>
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
        <>
          <div className="w-full mt-6 bg-gray-50 rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Dodatkowe informacje</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Przyspieszenie 0-100 km/h: {car.acceleration}</li>
              <li>Maksymalny moment obrotowy: {car.torque}</li>
              <li>Napęd: {car.drive_type}</li>
              <li>Rocznik: {getProductionYears(car.generation)}</li>
            </ul>
          </div>

          <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Historia pojazdu</h1>
            <button
              onClick={fetchHistory}
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading || !vin}
            >
              {loading ? "Pobieranie..." : "Sprawdź historię"}
            </button>

            {error && <p className="text-red-600 mt-3">{error}</p>}

            {timeline && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Oś czasu</h2>
                <div
                  className="border p-3 mt-2"
                  dangerouslySetInnerHTML={{ __html: timeline.timeline_html }}
                />
              </div>
            )}
          </div>

          {/* Formularz dodawania wpisu serwisowego */}
          <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Dodaj wpis serwisowy</h2>

            <form onSubmit={handleAddServiceEntry} className="space-y-4">
              {/* Pole opisu */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Opis serwisu *</label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Wymiana oleju, filtrów, klocków hamulcowych..."
                  required
                />
              </div>

              {/* Pole przebiegu */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Przebieg (km) *</label>
                <input
                  type="number"
                  name="mileage"
                  min="0"
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pole daty */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Data wykonania *</label>
                <input
                  type="date"
                  name="date"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Pole kosztu */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Koszt (PLN)</label>
                <input
                  type="number"
                  name="cost"
                  min="0"
                  step="0.01"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pole zdjęcia faktury */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Zdjęcie faktury</label>
                <input
                  type="file"
                  name="invoice_image"
                  accept="image/*"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Dodaj wpis
              </button>
            </form>

            {/* Lista wpisów serwisowych */}
            <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Historia serwisowa</h2>
              {serviceEntries.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {serviceEntries.map((entry) => (
                    <li key={entry.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-800 font-medium">
                          📅 {entry.date || "Brak daty"}
                        </p>
                        {entry.mileage && (
                          <p className="text-gray-500 text-sm">Przebieg: {entry.mileage} km</p>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{entry.description || "Brak opisu"}</p>
                      {entry.cost && (
                        <p className="text-gray-500 text-sm mt-1">Koszt: {entry.cost} PLN</p>
                      )}
                      {entry.invoice_image && (
                        <div className="mt-2">
                          <img
                            src={entry.invoice_image.startsWith("http")
                              ? entry.invoice_image
                              : `http://localhost:8000${entry.invoice_image}`}
                            alt="Faktura"
                            className="w-32 h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Brak wpisów serwisowych.</p>
              )}
            </div>

            {/* Formularz dodawania uszkodzenia */}
            <DamageForm></DamageForm>
            { /* Lista uszkodzeń pojazdu */}
            <DamageHistory></DamageHistory>
          </div>
        </>
      )}
    </>
  );
}
