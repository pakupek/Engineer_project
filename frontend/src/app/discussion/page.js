// app/discussion/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from './Discussion.module.css';

export default function Discussion() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    sort: 'newest',
    search: ''
  });
  const router = useRouter();
  const categories = [
    'Ogólne',
    'Techniczne pytania',
    'Porady mechaniczne',
    'Recenzje samochodów',
    'Tuning',
    'Elektromobilność',
    'Motoryzacja historyczna'
  ];

  // Pobieranie dyskusji z API
  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/discussions/');
      if (response.ok) {
        const data = await response.json();
        setDiscussions(data);
      } else {
        throw new Error('Błąd podczas pobierania dyskusji');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Błąd podczas pobierania dyskusji');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Filtrowanie i sortowanie dyskusji
  const filteredDiscussions = discussions
    .filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           discussion.content.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || discussion.category === filters.category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'most_comments':
          return b.comment_count - a.comment_count;
        case 'most_views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleDiscussionClick = (discussionId) => {
    router.push(`/discussion/${discussionId}`);
  };

  const handleCreateDiscussion = () => {
    router.push('/discussion/create');
  };


  return (
    <div className={styles.discussionContainer}>
      {/* Overlay z blurem na całym tle */}
      <div className={styles.backgroundOverlay}></div>

      {/* Kontener z zawartością */}
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          {/* Nagłówek */}
          <div className={styles.headerSection}>
            <h1 className={styles.pageTitle}>Forum Dyskusyjne</h1>
            <p className={styles.pageSubtitle}>Dołącz do dyskusji z miłośnikami motoryzacji</p>
            <button 
              className={styles.createButton}
              onClick={handleCreateDiscussion}
            >
              + Nowa Dyskusja
            </button>
          </div>

          {/* Panel z filtrami */}
          <div className={styles.filtersPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Wyszukaj</label>
              <input
                type="text"
                placeholder="Szukaj dyskusji..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Kategoria</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Wszystkie kategorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sortuj według</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="newest">Najnowsze</option>
                <option value="oldest">Najstarsze</option>
                <option value="most_comments">Najwięcej komentarzy</option>
                <option value="most_views">Najwięcej wyświetleń</option>
              </select>
            </div>
          </div>

          {/* Lista dyskusji */}
          <div className={styles.discussionsList}>
            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <p>Ładowanie dyskusji...</p>
              </div>
            ) : filteredDiscussions.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Brak dyskusji</h3>
                <p>Nie znaleziono dyskusji spełniających kryteria wyszukiwania</p>
                <button 
                  className={styles.createButton}
                  onClick={handleCreateDiscussion}
                >
                  Stwórz pierwszą dyskusję
                </button>
              </div>
            ) : (
              filteredDiscussions.map(discussion => (
                <div 
                  key={discussion.id} 
                  className={styles.discussionCard}
                  onClick={() => handleDiscussionClick(discussion.id)}
                >
                  <div className={styles.discussionMain}>
                    <div className={styles.discussionHeader}>
                      <span className={styles.categoryBadge}>{discussion.category}</span>
                      <h3 className={styles.discussionTitle}>{discussion.title}</h3>
                    </div>
                    <p className={styles.discussionExcerpt}>
                      {discussion.content.substring(0, 150)}...
                    </p>
                    <div className={styles.discussionMeta}>
                      <span className={styles.author}>
                        👤 {discussion.author_name}
                      </span>
                      <span className={styles.date}>
                        📅 {new Date(discussion.created_at).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.discussionStats}>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>{discussion.comment_count}</span>
                      <span className={styles.statLabel}>Komentarzy</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>{discussion.views}</span>
                      <span className={styles.statLabel}>Wyświetleń</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>
                        {discussion.last_activity ? new Date(discussion.last_activity).toLocaleDateString('pl-PL') : 'Brak'}
                      </span>
                      <span className={styles.statLabel}>Ostatnia aktywność</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}