"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getToken } from "../../Services/auth";
import styles from "./VehicleDetails.module.css";
import sectionStyle from "./SectionStyle.module.css"

// Importy komponentów
import DamageForm from "./DamageForm/DamageForm";
import DamageHistory from "./DamageHistory/DamageHistory";
import Timeline from "./TimeLine/TimeLine";
import TechnicalData from "./TechnicalData/TechnicalData";
import ServiceEntriesList from "./ServiceEntryList/ServiceEntryList";
import ServiceEntryCreate from "./ServiceEntryCreate/ServiceEntryCreate";
import VehicleImages from "./VehicleImages/VehicleImages";
import { VehicleInformation, VehicleInformationOverlay } from "./VehicleInformation/VehicleInformation";

export default function CarDetails() {
  const { vin } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Jedno zapytanie do API
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
        if (!response.ok) throw new Error(`Błąd pobierania auta: ${response.status}`);

        const data = await response.json();
        setCar(data);
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vin) fetchCar();
  }, [vin]);

  if (loading) return <div className="p-6 text-gray-600">Ładowanie danych pojazdu...</div>;
  if (error) return <div className="p-6 text-red-500">Błąd: {error}</div>;
  if (!car) return <div className="p-6 text-gray-500">Nie znaleziono danych pojazdu.</div>;

  return (
    
    <div style={{ background: "linear-gradient(to bottom, white, black)",
      minHeight: "100vh",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      paddingBottom: "40px", }}>

      {/* Slider z obrazami auta */}
      <div className={styles.hero}>
        <VehicleImages car={car} />
        <VehicleInformationOverlay car={car} />
      </div>

      {/* Podstawowe informacje */}
      <VehicleInformation car={car} showMore={showMore} setShowMore={setShowMore} />

      {/* Dodatkowe sekcje po kliknięciu */}
      {showMore && (
        <>
          <TechnicalData vin={vin} />
          <Timeline vin={vin} />
          
          
          <section className={sectionStyle["vehicle-history"]}>
            <div className={sectionStyle["vehicle-history-container"]}>
              {/* LEWA STRONA */}
              <div className={sectionStyle["vehicle-left"]}>
                <h2 className={sectionStyle["vehicle-title"]}>Historia pojazdu</h2>
                <p className={sectionStyle["vehicle-subtitle"]}>
                  Sprawdź przeszłość swojego auta — naprawy, przeglądy i uszkodzenia.
                  Dodawaj nowe wpisy i śledź stan pojazdu w jednym miejscu.
                </p>

                {/* Sekcja serwisowa */}
                <div className={sectionStyle["accordion"]}>
                  <button
                    onClick={() => toggleSection("service")}
                    className={sectionStyle["accordion-button"]}
                  >
                    <span className={sectionStyle["accordion-title"]}>🧰 Historia serwisowa</span>
                    <span>{openSection === "service" ? "−" : "+"}</span>
                  </button>
                  {openSection === "service" && (
                    <div className={sectionStyle["accordion-content"]}>
                      <ServiceEntryCreate vin={vin} />
                    </div>
                  )}
                </div>

                {/* Sekcja uszkodzeń */}
                <div className={sectionStyle["accordion"]}>
                  <button
                    onClick={() => toggleSection("damage")}
                    className={sectionStyle["accordion-button"]}
                  >
                    <span className={sectionStyle["accordion-title"]}>🚗 Historia szkód</span>
                    <span>{openSection === "damage" ? "−" : "+"}</span>
                  </button>
                  {openSection === "damage" && (
                    <div className={sectionStyle["accordion-content"]}>
                      <DamageForm vin={vin} />
                    </div>
                  )}
                </div>
              </div>

              {/* PRAWA STRONA */}
              <div className={sectionStyle["vehicle-right"]}>
                {/* Suwak: Serwis */}
                <div className={sectionStyle["card-section dark"]}>
                  <div className={sectionStyle["scroll-container"]}>
                    <ServiceEntriesList vin={vin} />
                  </div>
                </div>

                {/* Suwak: Uszkodzenia */}
                <div className={sectionStyle["card-section yellow"]}>
                  <div className={sectionStyle["scroll-container"]}>
                    <DamageHistory vin={vin} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
