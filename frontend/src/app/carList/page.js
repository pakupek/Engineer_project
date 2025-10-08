"use client";
import { useState, useEffect } from 'react';
import VehicleList from './VehicleList';
import { getToken } from "../services/auth";
import styles from './carList.module.css'; 

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie danych o pojazdach
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch('http://localhost:8000/api/vehicles/my-vehicles/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setVehicles(data);
        } else {
          setError(JSON.stringify(data));
        }
      } catch (err) {
        setError('Wystąpił błąd podczas ładowania danych');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Funkcja do usuwania pojazdu
  const handleDeleteVehicle = async (vehicleId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      } else {
        alert('Błąd podczas usuwania pojazdu');
      }
    } catch (error) {
      alert('Wystąpił błąd podczas usuwania pojazdu');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>Ładowanie pojazdów...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.message .error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Moje pojazdy</h1>
        <p className={styles.subtitle}>Zarządzaj swoimi pojazdami</p>
      </div>

      <div className={styles["button-section"]}>
        <button 
          className={styles["add-button"]}
          onClick={() => window.location.href = 'http://localhost:8000/api/vehicles/create/'}
        >
          Dodaj nowy pojazd
        </button>
      </div>

      <VehicleList 
        vehicles={vehicles} 
        onDeleteVehicle={handleDeleteVehicle}
      />
    </div>
  );
}
