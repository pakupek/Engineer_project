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
import DamageFormContainer from "./DamageForm/DamageFormContainer";

export default function CarDetails() {
  const { vin } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [reloadKey, setReloadKey] = useState(0); 
  const [damageReloadKey, setDamageReloadKey] = useState(0);
  const [editingDamage, setEditingDamage] = useState(null);
  const handleEditEntry = (entry) => setEditingEntry(entry);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleSave = () => {
    setEditingEntry(null);
    setReloadKey((prev) => prev + 1);
  };

  const handleDamageAdded = () => {
    setDamageReloadKey((prev) => prev + 1);
  };


  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const token = getToken();
      
      const response = await fetch(
        `http://localhost:8000/api/vehicles/${vin}/history/pdf/`,
        {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${vin}_historia.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Błąd pobierania PDF:", error);
      alert("Nie udało się wygenerować PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };


  const [showSaleForm, setShowSaleForm] = useState(false);

  const openSaleForm = () => setShowSaleForm(true);
  const closeSaleForm = () => setShowSaleForm(false);

  const handleSaleCreated = () => {
    alert("Ogłoszenie zostało wystawione!");
    closeSaleForm();
  };


  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleEditDamage = (damage) => setEditingDamage(damage);

  const handleEditComplete = () => {
    setEditingDamage(null);
    setDamageReloadKey((prev) => prev + 1); 
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
    
    <div style={{ 
      background: "linear-gradient(to bottom, white, black)",
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
      <VehicleInformation car={car}/>

      {/* Dane techniczne */}
      <TechnicalData vin={vin} />

      {/* Oś czasu */}
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
              <button onClick={() => toggleSection("service")} className={sectionStyle["accordion-button"]}>
                <span className={sectionStyle["accordion-title"]}>🧰 Historia serwisowa</span>
                <span>{openSection === "service" ? "−" : "+"}</span>
              </button>
              {openSection === "service" && (
                <div className={sectionStyle["accordion-content"]}>
                  <ServiceEntryCreate vin={vin} editingEntry={editingEntry} onSave={handleSave} />
                </div>
              )}
            </div>

            {/* Sekcja uszkodzeń */}
            <div className={sectionStyle["accordion"]}>
              <button onClick={() => toggleSection("damage")} className={sectionStyle["accordion-button"]}>
                <span className={sectionStyle["accordion-title"]}>🚗 Historia szkód</span>
                <span>{openSection === "damage" ? "−" : "+"}</span>
              </button>
              {openSection === "damage" && (
                <div className={sectionStyle["accordion-content"]}>
                  <DamageFormContainer onDamageAdded={handleDamageAdded} damageToEdit={editingDamage} onEditComplete={handleEditComplete}/>
                </div>
              )}
            </div>

            {/* Przycisk pobierania PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className={sectionStyle["download-btn"]}
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                background: downloadingPdf ? "#6b7280" : "#1f2937",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: downloadingPdf ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                if (!downloadingPdf) {
                  e.target.style.background = "#374151";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseOut={(e) => {
                if (!downloadingPdf) {
                  e.target.style.background = "#1f2937";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {downloadingPdf ? (
                <>
                  <span>⏳</span>
                  Generowanie PDF...
                </>
              ) : (
                <>
                  <span>📄</span>
                  Pobierz historię pojazdu (PDF)
                </>
              )}
            </button>
          </div>

          {/* Prawa Strona */}
          <div className={sectionStyle["vehicle-right"]}>
            {/* Serwis */}
            <div className={sectionStyle["card-section dark"]}>
              <div className={sectionStyle["scroll-container"]}>
                <ServiceEntriesList vin={vin} key={reloadKey} onEditEntry={handleEditEntry} />
              </div>
            </div>

            {/* Uszkodzenia */}
            <div className={sectionStyle["card-section yellow"]}>
              <div className={sectionStyle["scroll-container"]}>
                <DamageHistory key={damageReloadKey} onEditDamage={handleEditDamage}/>
              </div>
            </div>
          </div>
        </div>
      </section> 
    </div>
  );
}
