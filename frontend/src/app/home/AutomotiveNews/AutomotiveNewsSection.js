"use client";

import { useEffect, useState } from "react";
import "./AutomotiveNewsSection.css"

export default function AutomotiveNewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'https://backend-production-0265.up.railway.app';;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_URL}/api/automotive-news/`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setArticles(data.articles || data || []);
      } catch (err) {
        console.error("Error loading articles:", err);
        setError("Nie udało się załadować artykułów.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p className="center-text">Ładowanie artykułów...</p>;
  if (error) return <p className="center-text error-text">{error}</p>;

  return (
    <section className="automotive-news-section">
      <div className="container">
        <div className="news-header">
          <h2>Gorące Tematy Motoryzacji</h2>
        </div>

        <div className="news-grid">
          {articles.length > 0 ? (
            articles.map((item, index) => (
              <div
                key={index}
                className={`news-card ${index === 0 ? "news-card-active" : ""}`}
              >
                <div className="news-image-wrapper">
                  <img
                    alt={item.title || "Brak tytułu"}
                    src={item.image_url}
                  />
                </div>
                <div className="news-content">
                    <p className="news-date">{formatDate(item.published_at)}</p>
                    <h3 className="news-title">{item.title || "Brak tytułu"}</h3>
                    <p className="news-summary">{item.summary}</p>
                    
            
                </div>
              </div>
            ))
          ) : (
            <p className="center-text">Brak aktualnych artykułów.</p>
          )}
        </div>
      </div>
    </section>
  );
}
