import React from "react";

export default function ImageDamageCreate({ src, markers = [], onClickPosition }) {
  const handleClick = (e) => {
    if (!onClickPosition) return;

    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onClickPosition({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
  };

  return (
    <div className="relative w-full h-96 border rounded overflow-hidden cursor-crosshair" onClick={handleClick}>
      <img src={src} alt="Vehicle" className="w-full h-full object-contain" />

      {markers.map((marker, index) => {
        const colors = { drobne: "yellow", umiarkowane: "orange", poważne: "red" };
        const color = colors[marker.severity] || "yellow";

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${marker.x_percent}%`,
              top: `${marker.y_percent}%`,
              transform: "translate(-50%, -50%)",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: color,
              border: "2px solid white",
              boxShadow: "0 0 2px #000",
            }}
            title={marker.severity}
          />
        );
      })}
    </div>
  );
}
