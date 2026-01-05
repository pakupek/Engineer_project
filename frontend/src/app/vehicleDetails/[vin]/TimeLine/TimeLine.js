"use client";

import React, { useEffect, useState } from "react";
import "./TimeLine.css";

const Timeline = ({ vin }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const API_URL = 'https://backend-production-0265.up.railway.app';;

  useEffect(() => {
    if (!vin) return;

    const startTask = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1️⃣ Startujemy zadanie Celery
        const res = await fetch(`${API_URL}/api/vehicle-history/${vin}/`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Błąd serwera");
          setLoading(false);
          return;
        }

        const id = data.task_id;
        setTaskId(id);

        // Polling co 2s
        const poll = async () => {
          try {
            const statusRes = await fetch(`${API_URL}/api/vehicle-history/status/${id}/`);
            const statusData = await statusRes.json();

            if (statusData.status === "success") {
              const timelineData = statusData.timeline || [];
              setTimeline(timelineData);
              setLoading(false);
            } else if (statusData.status === "failure") {
              setError(statusData.error || "Błąd w zadaniu Celery");
              setLoading(false);
            } else {
              // PENDING → odpytywanie ponownie za 2 sekundy
              setTimeout(poll, 2000);
            }
          } catch (err) {
            console.error("❌ Błąd pollingu:", err);
            setError("Błąd podczas sprawdzania statusu zadania");
            setLoading(false);
          }
        };

        poll();
      } catch (err) {
        console.error("❌ Błąd startowania:", err);
        setError("Błąd połączenia z serwerem");
        setLoading(false);
      }
    };

    startTask();
  }, [vin]);

  if (loading) return <p>Ładowanie osi czasu...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!timeline.length) return <p>Brak danych do wyświetlenia.</p>;

  return (
    <section id="cd-timeline" className="cd-container">
      {timeline.map((item, index) => (
        <div key={index} className="cd-timeline-block">
          <div className={`cd-timeline-img ${item.iconClass || "cd-picture"}`}></div>
          <div className="cd-timeline-content">
            <h2>{item.title}</h2>

            {item.details && Object.keys(item.details).length > 0 && (
              <ul className="content-skills">
                {Object.entries(item.details).map(([key, value], idx) => (
                  <li key={idx}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            )}

            {item.date && <span className="cd-date">{item.date}</span>}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Timeline;