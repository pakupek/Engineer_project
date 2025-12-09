"use client";

import React, { useEffect, useState } from "react";
import "./TimeLine.css"; 


const Timeline = ({ vin }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = 'https://engineer-project.onrender.com';

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/vehicle-history/${vin}/`);
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
