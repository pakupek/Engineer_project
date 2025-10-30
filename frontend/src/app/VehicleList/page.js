"use client";
import { useState, useEffect } from 'react';
import VehicleList from './VehicleList';
import { getToken } from "../Services/auth";
import styles from './VehiclePage.module.css'; 
import DashboardLayout from '../DashboardLayout/page';
import VehicleFilters from './VehicleFilters';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);

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
  const handleDeleteVehicle = async (vin) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8000/api/vehicles/${vin}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas usuwania pojazdu');
      }

      const data = await response.json();
      setVehicles((prev) => prev.filter((v) => v.vin !== vin));
      setFilteredVehicles((prev) => prev.filter((v) => v.vin !== vin));
      return data;
    } catch (error) {
      console.error('Błąd usuwania pojazdu:', error);
      throw error;
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
    <DashboardLayout>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Moje pojazdy</h1>
          <p className={styles.subtitle}>Zarządzaj swoimi pojazdami</p>
        </div>

        <div className={styles["button-section"]}>
          <button className={styles["add-button"]} onClick={() => window.location.href = '/AddVehicle'}>
            Dodaj nowy pojazd
          </button>
        </div>

        <VehicleFilters vehicles={vehicles} onFiltered={setFilteredVehicles} />

        <VehicleList 
          vehicles={vehicles} 
          onDeleteVehicle={handleDeleteVehicle}
          onViewDetails={(vehicleVin) => window.location.href = `/VehicleDetails/${vehicleVin}`} 
        />
      </main>
    </DashboardLayout>
  );
}
