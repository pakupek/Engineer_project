"use client";

import { useState } from "react";
import styles from "./VehicleFilters.module.css";

export default function VehicleFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: "",
    show: "all",
    sort: "newest",
    brand: "",
    model: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className={styles["filters-container"]}>
      <div className={styles["filters-row"]}>
        {/* Wyszukiwanie */}
        <div className={styles["search-wrapper"]}>
          <input
            type="text"
            name="search"
            placeholder="Wyszukaj pojazd"
            value={filters.search}
            onChange={handleChange}
          />
          <img
            src="/icons/search.svg"
            alt="Szukaj"
            className={styles["search-icon"]}
          />
        </div>

        {/* Marka */}
        <input
          type="text"
          name="brand"
          placeholder="Marka"
          value={filters.brand}
          onChange={handleChange}
          className={styles["input"]}
        />

        {/* Model */}
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={filters.model}
          onChange={handleChange}
          className={styles["input"]}
        />

        {/* Cena */}
        <input
          type="number"
          name="minPrice"
          placeholder="Cena od"
          value={filters.minPrice}
          onChange={handleChange}
          className={styles["input"]}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Cena do"
          value={filters.maxPrice}
          onChange={handleChange}
          className={styles["input"]}
        />

        {/* Rok produkcji */}
        <input
          type="number"
          name="minYear"
          placeholder="Rok od"
          value={filters.minYear}
          onChange={handleChange}
          className={styles["input"]}
        />
        <input
          type="number"
          name="maxYear"
          placeholder="Rok do"
          value={filters.maxYear}
          onChange={handleChange}
          className={styles["input"]}
        />
      </div>

      {/* Sortowanie */}
      <div className={styles["sort-row"]}>
        <span>Sortuj wg</span>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className={styles["select"]}
        >
          <option value="newest">od najnowszych</option>
          <option value="oldest">od najstarszych</option>
          <option value="priceHigh">cena: malejąco</option>
          <option value="priceLow">cena: rosnąco</option>
        </select>
      </div>
    </div>
  );
}
