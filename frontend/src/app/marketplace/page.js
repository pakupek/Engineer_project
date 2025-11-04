'use client';

import React, { useEffect, useState } from "react";
import { getToken } from "../Services/auth";
import VehicleSaleCard from "./VehicleSaleCard";
import styles from "./VehicleSalesList.module.css";

export default function VehicleSalesList() {
  const [sales, setSales] = useState([]);
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    priceMin: 0,
    priceMax: 100000,
  });
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  // Pobranie listy ogłoszeń + filtrów
  useEffect(() => {
    const fetchSales = async () => {
      const token = getToken();
      const queryParams = new URLSearchParams();

      if (filters.make) queryParams.append("make", filters.make);
      if (filters.model) queryParams.append("model", filters.model);
      if (filters.priceMin) queryParams.append("price_min", filters.priceMin);
      if (filters.priceMax) queryParams.append("price_max", filters.priceMax);

      const res = await fetch(`http://localhost:8000/api/sales/?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.results) {
        setSales(data.results);
      } else if (Array.isArray(data)) {
        setSales(data);
      } else {
        setSales([]);
      }
    };

    fetchSales();
  }, [filters]);

  // Pobieramy listę marek i modeli (można wystawić osobne endpointy w Django)
  useEffect(() => {
    const fetchMakes = async () => {
      const res = await fetch("http://localhost:8000/api/makes/");
      const data = await res.json();
      setMakes(data);
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    if (filters.make) {
      const fetchModels = async () => {
        const res = await fetch(`http://localhost:8000/api/models/?make=${filters.make}`);
        const data = await res.json();
        setModels(data);
      };
      fetchModels();
    } else {
      setModels([]);
    }
  }, [filters.make]);

  return (
    <div className={styles.pageContainer}>
      {/* 🔍 Sekcja filtrów */}
      <div className={styles.filters}>
        <h2>Filtruj ogłoszenia</h2>

        <div className={styles.filterRow}>
          <label>Marka:</label>
          <select
            value={filters.make}
            onChange={(e) => setFilters({ ...filters, make: e.target.value, model: "" })}
          >
            <option value="">Wybierz markę</option>
            {makes.map((make) => (
              <option key={make.id} value={make.name}>{make.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterRow}>
          <label>Model:</label>
          <select
            value={filters.model}
            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
            disabled={!filters.make}
          >
            <option value="">Wybierz model</option>
            {models.map((model) => (
              <option key={model.id} value={model.name}>{model.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterRow}>
          <label>Cena: {filters.priceMin}$ – {filters.priceMax}$</label>
          <input
            type="range"
            min="0"
            max="200000"
            step="1000"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
          />
          <input
            type="range"
            min="0"
            max="200000"
            step="1000"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
          />
        </div>

        <button className={styles.resetBtn} onClick={() => setFilters({
          make: "", model: "", priceMin: 0, priceMax: 100000
        })}>
          Resetuj filtry
        </button>
      </div>

      {/* 🧾 Lista ogłoszeń */}
      <div className={styles.listContainer}>
        {sales.map((sale) => (
          <VehicleSaleCard key={sale.id} sale={sale} />
        ))}
      </div>
    </div>
  );
}
