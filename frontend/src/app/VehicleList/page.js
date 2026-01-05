"use client";
import { useState, useEffect } from 'react';
import VehicleList from './VehicleList';
import { getToken } from '@/services/auth';
import styles from './VehiclePage.module.css'; 
import DashboardLayout from '../DashboardLayout/page';
import VehicleFilters from './VehicleFilters';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = 'https://engineer-project.onrender.com';

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    setPage(1);
  };



  // Pobieranie danych o pojazdach
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const token = getToken();
        // Zamiana filtrów na string zapytania GET
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            params.append(key, value);
          }
        });

        // Dodajemy paginację
        params.append("page", page);

        const response = await fetch(`${API_URL}/api/vehicles/my-vehicles/?${params}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setVehicles(data.results);
          setTotalPages(Math.ceil(data.count / 10)); 
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
  }, [filters, page]);

  // Funkcja do usuwania pojazdu
  const handleDeleteVehicle = async (vin) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/vehicles/${vin}/delete/`, {
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

        <VehicleFilters onFilterChange={handleFilterChange} />

        <VehicleList 
          vehicles={vehicles} 
          onDeleteVehicle={handleDeleteVehicle}
          onViewDetails={(vehicleVin) => window.location.href = `/vehicleDetails/${vehicleVin}`} 
        />
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            ◀
          </button>

          <span className={styles.pageInfo}>
            Strona {page} / {totalPages}
          </span>

          <button
            className={styles.pageBtn}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            ▶
          </button>
        </div>


      </main>
    </DashboardLayout>
  );
}
