import React, { useEffect, useState } from "react";
import styles from "./TimeLine.module.css"; 

const Timeline = ({ vin }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:8000/api/vehicle-history/${vin}/`);
        const data = await res.json();

        if (data.success) {
          setTimeline(data.timeline);
        } else {
          setError(data.message || data.error);
        }
      } catch (err) {
        setError("Błąd połączenia z serwerem");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [vin]);

  if (loading) return <p>Ładowanie osi czasu...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!timeline.length) return <p>Brak danych do wyświetlenia.</p>;

  return (
    <div className={styles["timeline-container"]}>
      {timeline.map((item, index) => (
        <div key={index} className={styles["timeline-item"]}>
          <div className={styles["timeline-date"]}>{item.date}</div>
          <div className={styles["timeline-content"]}>
            <div className={styles["timeline-title"]}>{item.title}</div>
            {item.details && Object.keys(item.details).length > 0 && (
              <ul className={styles["timeline-details"]}>
                {Object.entries(item.details).map(([key, value], idx) => (
                  <li key={idx}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
