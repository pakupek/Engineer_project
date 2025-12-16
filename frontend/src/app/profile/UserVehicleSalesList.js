'use client';

import React, { useEffect, useState } from "react";
import { getToken } from "../services/auth";
import UserVehiclesSaleCard from "./UserVehiclesSaleCard";
import styles from "./UserVehicleSalesList.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function UserVehicleSalesList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const API_URL = 'https://backend-production-8ce8.up.railway.app';
  
  const handleDeleteSale = (id) => {
    setSales((prev) => prev.filter((sale) => sale.id !== id));
  };
    
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/sales/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // obsługa paginacji lub zwykłej tablicy
        if (data.results) {
          setSales(data.results);
        } else if (Array.isArray(data)) {
          setSales(data);
        } else {
          setSales([]);
        }
      } catch (error) {
        console.error("Błąd ładowania ogłoszeń:", error);
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return <p>Ładowanie ogłoszeń...</p>;
  }

  if (sales.length === 0) {
    return <p>Brak aktualnie wystawionych aut.</p>;
  }

  return (
    <div className={styles.accordionContainer}>
      {/* Nagłówek akordeonu */}
      <div
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>Twoje auta na sprzedaż ({sales.length})</h3>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>

      {/* Treść akordeonu */}
      {isOpen && (
        <div className={styles.accordionContent}>
          {loading ? (
            <p className={styles.loadingText}>Ładowanie ogłoszeń...</p>
          ) : sales.length === 0 ? (
            <p className={styles.noSalesText}></p>
          ) : (
            <div className={styles.listContainer}>
              {sales.map((sale) => (
                <UserVehiclesSaleCard key={sale.id} sale={sale} onDelete={handleDeleteSale}/>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
