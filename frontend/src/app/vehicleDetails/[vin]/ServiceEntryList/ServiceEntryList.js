"use client";

import { useState, useEffect } from "react";
import { getToken } from "../../../Services/auth";
import "./ServiceEntryList.css";

export default function ServiceEntriesList({ vin, onEditEntry }) {
  const [serviceEntries, setServiceEntries] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 🔹 Blokada scrollowania strony gdy modal jest otwarty
  useEffect(() => {
    if (previewImage) {
      // Zapisz aktualną pozycję scrolla
      const scrollY = window.scrollY;
      
      // Zablokuj scrollowanie strony
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Przywróć scrollowanie gdy komponent się odmontuje
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [previewImage]);

  // Funkcja do obsługi scrolla (zoom)
  const handleImageWheel = (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const delta = e.deltaY > 0 ? -1 : 1;
    
    setZoom(prevZoom => {
      let newZoom = prevZoom + delta * zoomIntensity;
      newZoom = Math.min(Math.max(newZoom, 0.5), 5); // min 0.5x, max 5x
      
      // Reset pozycji gdy zoom = 1
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      
      return newZoom;
    });
  };

  // Funkcje do przeciągania obrazu
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Reset zoom i pozycji przy zamknięciu podglądu
  const closePreview = () => {
    setPreviewImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Funkcja do przycisków zoom
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 5));
  };

  const zoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.25, 0.5);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Funkcja do pobierania wpisów
  const fetchServiceEntries = async () => {
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:8000/api/service-entry/${vin}/`, {
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

  // Załaduj wpisy po załadowaniu VIN
  useEffect(() => {
    if (vin) fetchServiceEntries();
  }, [vin]);

  // Kliknięcie przycisku "Edytuj"
  const handleEditClick = (entry) => {
    if (onEditEntry) {
      onEditEntry(entry);
    }
  };

  // Usuń wpis
  const handleDelete = async (entryId) => {
    if (!confirm("Czy na pewno chcesz usunąć ten wpis serwisowy?")) return;

    try {
      const token = getToken();
      const res = await fetch(
        `http://localhost:8000/api/service-entry/${vin}/${entryId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Błąd podczas usuwania wpisu");

      alert("Wpis został usunięty");
      fetchServiceEntries();
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd przy usuwaniu wpisu");
    }
  };

  return (
    <div className="service-history">
      <h2 className="history-title">Historia serwisowa</h2>

      {serviceEntries.length > 0 ? (
        <div className="service-slider">
          {serviceEntries.map((entry) => (
            <div key={entry.id} className="service-slide">
              <div className="service-card">
                <div className="service-header">
                  <p className="service-date">📅 {entry.date || "Brak daty"}</p>
                  {entry.mileage && (
                    <p className="service-mileage">Przebieg: {entry.mileage} km</p>
                  )}
                </div>

                <p className="service-description">{entry.description || "Brak opisu"}</p>

                {entry.cost && <p className="service-cost">Koszt: {entry.cost} PLN</p>}

                {entry.invoice_image && (
                  <div className="service-image">
                    <img
                      src={
                        entry.invoice_image.startsWith("http")
                          ? entry.invoice_image
                          : `http://localhost:8000${entry.invoice_image}`
                      }
                      alt="Faktura"
                      className="thumbnail"
                      onClick={() => {
                        setPreviewImage(
                          entry.invoice_image.startsWith("http")
                            ? entry.invoice_image
                            : `http://localhost:8000${entry.invoice_image}`
                        );
                        setZoom(1);
                        setPosition({ x: 0, y: 0 });
                      }}
                    />
                  </div>
                )}

                <div className="service-actions">
                  <button className="edit-btn" onClick={() => handleEditClick(entry)}>
                    ✏️ Edytuj
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                    🗑️ Usuń
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-entries">Brak wpisów serwisowych.</p>
      )}

      {/* Modal podglądu zdjęcia */}
      {previewImage && (
        <div 
          className="image-preview-overlay" 
          onClick={closePreview}
          onWheel={handleImageWheel}
        >
          <div 
            className="image-preview-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kontrolki zoom */}
            <div className="zoom-controls">
              <button onClick={zoomIn} title="Przybliż">+</button>
              <button onClick={zoomOut} title="Oddal">-</button>
              <button onClick={resetZoom} title="Reset zoom">⟳</button>
              <span className="zoom-level">{Math.round(zoom * 100)}%</span>
              <button className="close-btn" onClick={closePreview} title="Zamknij">×</button>
            </div>

            {/* Kontener obrazu z możliwością przeciągania */}
            <div 
              className="image-container"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={previewImage}
                alt="Podgląd faktury"
                style={{
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  transition: dragging ? 'none' : 'transform 0.1s ease'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
