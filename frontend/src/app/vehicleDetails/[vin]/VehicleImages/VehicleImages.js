"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./VehicleImages.module.css";

export default function VehicleImages({ car }) {
    const [current, setCurrent] = useState(0);
    const API_URL = 'https://backend-production-15b8.up.railway.app';;
    const images =
        car?.images
        ?.filter((imgObj) => imgObj?.image && imgObj.image.trim() !== "")
        .map((imgObj) =>
            imgObj.image.startsWith("http")
            ? imgObj.image
            : `${API_URL}${imgObj.image}`
        ) || [];

    // Autoplay co 5 sekund
    useEffect(() => {
        if (!images.length) return;
        const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images]);

    if (!images.length) {
        return (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            Brak zdjęć pojazdu
        </div>
        );
    }

    return (
        <div className={styles.slider}>
        {images.map((imgUrl, index) => (
            <div
            key={index}
            className={`${styles.slide} ${
                index === current ? styles.active : ""
            }`}
            >
            <Image
                src={imgUrl}
                alt={
                car?.name
                    ? `Zdjęcie pojazdu: ${car.name}`
                    : `Zdjęcie ${index + 1}`
                }
                fill
                className={styles.image}
                priority={index === current}
                unoptimized
            />
            </div>
        ))}
        </div>
    );
}
