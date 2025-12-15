"use client";

import React, { useEffect, useState } from "react";
import "./TimeLine.css"; 


const Timeline = ({ vin }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const API_URL = 'https://engineer-project.onrender.com';

  useEffect(() => {
    if (!vin) return;

    const startFetch = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Wywołanie endpointu, który startuje zadanie Celery
        const res = await fetch(`${API_URL}/api/vehicle-history/${vin}/`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Błąd serwera");
          setLoading(false);
          return;
        }

        const id = data.task_id;
        setTaskId(id);

        // 2. Polling co 2s aż zadanie się zakończy
        const poll = async () => {
          const statusRes = await fetch(`${API_URL}/api/vehicle-history/status/${id}/`);
          const statusData = await statusRes.json();

          if (statusData.status === "success") {
            setTimeline(statusData.timeline_html);
            setLoading(false);
          } else if (statusData.status === "failure") {
            setError(statusData.error || "Błąd w zadaniu Celery");
            setLoading(false);
          } else {
            // PENDING lub inne stany → czekaj 2s i odpytywanie ponownie
            setTimeout(poll, 2000);
          }
        };

        poll();

      } catch (err) {
        setError("Błąd połączenia z serwerem");
        setLoading(false);
      }
    };

    startFetch();
  }, [vin, API_URL]);


  if (loading) return <p>Ładowanie osi czasu...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!timeline) return <p>Brak danych do wyświetlenia.</p>;

  return (
    <section id="cd-timeline" className="cd-container">
      {timeline.map((item, index) => (
        <div key={index} className="cd-timeline-block">
          
          
          <div className={`cd-timeline-img ${item.iconClass || "cd-picture"}`}>
          </div>

          <div className="cd-timeline-content">
         
            <h2>{item.title}</h2>

          
            {item.info && (
              <div className="timeline-content-info">
                {item.info.title && (
                  <span className="timeline-content-info-title">
                    <i className="fa fa-certificate" aria-hidden="true"></i>
                    {item.info.title}
                  </span>
                )}
                {item.info.date && (
                  <span className="timeline-content-info-date">
                    <i className="fa fa-calendar-o" aria-hidden="true"></i>
                    {item.info.date}
                  </span>
                )}
              </div>
            )}

          
            <p>{item.description}</p>

            
            {item.details && Object.keys(item.details).length > 0 && (
              <ul className="content-skills">
                {Object.entries(item.details).map(([key, value], idx) => (
                  <li key={idx}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            )}

            {item.date && !item.info?.date && (
              <span className="cd-date">{item.date}</span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Timeline;
