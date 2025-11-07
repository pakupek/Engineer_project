import React, { useRef, useState, useEffect, useCallback } from "react";
import "./ImageDamageCreate.css";

export default function ImageDamageCreate({ src, markers = [], onClickPosition }) {
  const imgRef = useRef(null);
  const [imgBox, setImgBox] = useState(null);

  const updateRect = useCallback(() => {
    if (imgRef.current) setImgBox(imgRef.current.getBoundingClientRect());
  }, []);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [updateRect]);

  const handleImgLoad = () => updateRect();

  const handleClick = (e) => {
    if (!onClickPosition || !imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onClickPosition({
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
    });
  };


  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        cursor: "crosshair",
      }}
      onClick={handleClick}
    >
      <img
        ref={imgRef}
        src={src}
        alt="Vehicle"
        style={{ width: "100%", display: "block" }}
      />

      {markers.map((marker, index) => {
        const colorMap = {
          drobne: "yellow",
          umiarkowane: "orange",
          poważne: "red",
        };

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${marker.x_percent}%`,
              top: `${marker.y_percent}%`,
              width: "16px",
              height: "16px",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              backgroundColor: colorMap[marker.severity],
              border: "2px solid white",
              boxShadow: "0 0 3px black",
            }}
          />
        );
      })}
    </div>
  );
}
