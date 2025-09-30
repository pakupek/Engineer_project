"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./vehicleDetails.module.css";

const cars = [
  {
    name: "911 Carrera 4S",
    img: "/images/911_1.jpg",
    speed: "245 mph",
  },
  {
    name: "911 Turbo S",
    img: "/images/911_2.jpg",
    speed: "205 mph",
  },
  {
    name: "911 GT3 RS",
    img: "/images/911_3.jpg",
    speed: "198 mph",
  },
];

export default function vehicleDetails() {
  const [current, setCurrent] = useState(0);

  // Autoplay co 5 sekund
  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % cars.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
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
        <div className={styles.left}>{cars[current].name}</div>
        <div className={styles.right}>{cars[current].speed}</div>
      </div>
    </div>
  );
}
