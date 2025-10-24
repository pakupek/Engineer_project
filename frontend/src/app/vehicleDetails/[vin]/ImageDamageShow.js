import React from "react";

export default function ImageDamageShow({ src, markers }) {
  return (
    <div className="relative w-full h-96 border rounded overflow-hidden">
      {/* Obraz pojazdu */}
      <img
        src={src}
        alt="Damage"
        className="w-full h-full object-contain"
      />

      {/* Markery */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          style={{
            position: "absolute",
            top: `${marker.y_percent}%`,
            left: `${marker.x_percent}%`,
            transform: "translate(-50%, -50%)", // centruje marker
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor:
              marker.severity === "poważne"
                ? "red"
                : marker.severity === "umiarkowane"
                ? "orange"
                : "yellow",
            border: "2px solid white",
            cursor: "pointer",
          }}
          title={`Marker: ${marker.severity}`}
        ></div>
      ))}
    </div>
  );
}
