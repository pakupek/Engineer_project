"use client";

import { useState, useEffect } from "react";
import "./DamageHistory.css";
import ImageDamageShow from "../ImageDamage/ImageDamageCreate";

export default function DamageHistoryForm({ damageEntries, handleDelete, onEditDamage }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 🔹 Blokada scrollowania strony przy otwartym modalu
  useEffect(() => {
    if (previewImage) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [previewImage]);

  // Scroll zoom
  const handleImageWheel = (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const delta = e.deltaY > 0 ? -1 : 1;

    setZoom(prev => {
      let newZoom = prev + delta * zoomIntensity;
      newZoom = Math.min(Math.max(newZoom, 0.5), 5);

      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }

      return newZoom;
    });
  };

  // Drag start
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  // Drag move
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  // Drag stop
  const stopDragging = () => setDragging(false);

  const closePreview = () => {
    setPreviewImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 5));
  const zoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.25, 0.5);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };
  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="damage-history">
      <h2 className="history-title">Historia uszkodzeń</h2>

      {damageEntries.length > 0 ? (
        <div className="damage-slider">
          {damageEntries.map((entry) => {
            const markers = entry.markers || [];

            const maxSeverity = markers.reduce((acc, m) => {
              const order = { drobne: 1, umiarkowane: 2, poważne: 3 };
              return order[m.severity] > order[acc] ? m.severity : acc;
            }, "drobne");

            return (
              <div key={entry.id} className="damage-slide">
                <div className="damage-card">
                  <div className="damage-header">
                    <span className="damage-date">📅 {entry.date || "Brak daty"}</span>
                    <span className={`damage-severity ${maxSeverity}`}>
                      {maxSeverity}
                    </span>
                  </div>

                  <p className="damage-description">{entry.description}</p>

                  <div className="damage-image">
                    <ImageDamageShow src="/images/auto-linienziehbaren.jpg" markers={markers}/>
                  </div>

                  {/* Miniatury z podglądem w modalu */}
                  {entry.photos && entry.photos.length > 0 && (
                    <div className="damage-photos-container">
                      {entry.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={photo.image}
                          alt="Zdjęcie uszkodzenia"
                          className="damage-photo-thumb"
                          onClick={() => {
                            setPreviewImage(photo.image);
                            setZoom(1);
                            setPosition({ x: 0, y: 0 });
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="actions">
                    <button className="delete-button" onClick={() => handleDelete(entry.id)}>🗑️ Usuń</button>
                    <button className="edit-button" onClick={() => onEditDamage(entry)}>✏️ Edytuj</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : <p className="no-entries">Brak wpisów o uszkodzeniach.</p>}

      {/* Modal dla podglądu zdjęć */}
      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={closePreview}
          onWheel={handleImageWheel}
        >
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="zoom-controls">
              <button onClick={zoomIn}>+</button>
              <button onClick={zoomOut}>-</button>
              <button onClick={resetZoom}>⟳</button>
              <span className="zoom-level">{Math.round(zoom * 100)}%</span>
              <button className="close-btn" onClick={closePreview}>×</button>
            </div>

            <div
              className="image-container"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
            >
              <img
                src={previewImage}
                style={{
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  transition: dragging ? "none" : "transform 0.1s ease",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
