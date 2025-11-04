'use client';

import React, { useEffect, useState } from "react";
import { getToken } from "../Services/auth";
import VehicleSaleCard from "./VehicleSaleCard";
import styles from "./VehicleSalesList.module.css";

export default function VehicleSalesList() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const token = getToken();
      const res = await fetch("http://localhost:8000/api/sales/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.results) {
        setSales(data.results);
      } else if (Array.isArray(data)) {
        setSales(data);
      } else {
        setSales([]); // fallback
      }
    };
    fetchSales();
  }, []);

  return (
    <div className={styles.listContainer}>
      {sales.map((sale) => (
        <VehicleSaleCard key={sale.id} sale={sale} />
      ))}
    </div>
  );
}
