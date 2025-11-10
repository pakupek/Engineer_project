"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./Forum.css";
import { getToken } from "../Services/auth";

export default function Forum() {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState({
        title: "",
        category: "OGOLNE",
        content: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const [filters, setFilters] = useState({
        category: "ALL",
        status: "ALL",
        search: ""
        });

    const CATEGORY_COLORS = {
        OGOLNE: "tt-color01",
        TECHNICZNE: "tt-color02",
        PORADY: "tt-color03",
        RECENZJE: "tt-color04",
        TUNING: "tt-color05",
        ELEKTRO: "tt-color06",
        HISTORIA: "tt-color07",
    };

    const getCategoryClass = (category) => {
        return CATEGORY_COLORS[category] || "tt-color01";
    };

    const fetchThreads = async () => {
        try {
            const token = getToken();
            const query = new URLSearchParams({
                category: filters.category !== "ALL" ? filters.category : "",
                status: filters.status !== "ALL" ? filters.status : "",
                search: filters.search || ""
                }).toString();
            const res = await fetch(`http://localhost:8000/api/discussions/?${query}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
        
            setThreads(
                data.results.map((d) => ({
                id: d.id,
                avatar: d.author_name ? d.author_name[0].toUpperCase() : "?",
                title: d.title,
                tags: [],
                category: d.category,
                likes: d.likes_count || 0,
                replies: d.comment_count || 0,
                views: d.views || 0,
                locked: d.locked || d.is_closed || false, 
                activity: d.last_activity
                    ? timeAgo(d.last_activity)
                    : timeAgo(d.created_at),
                }))
            );
        } catch (err) {
            console.error("Error fetching discussions:", err);
        } finally {
            setLoading(false);
        }
    };

        useEffect(() => {
            fetchThreads();
    }, [filters]);

    function timeAgo(dateString) {
        const diff = Date.now() - new Date(dateString).getTime();
        const hours = diff / 1000 / 3600;
        if (hours < 24) return Math.floor(hours) + "h";
        if (hours < 24 * 7) return Math.floor(hours / 24) + "d";
        return Math.floor(hours / (24 * 7)) + "w";
    }

    const openDiscussion = async (id) => {
        router.push(`/Forum/${id}`, undefined, { scroll: true });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDiscussion((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateDiscussion = async () => {
        setSubmitting(true);
        try {
            const token = getToken();
            const res = await fetch("http://localhost:8000/api/discussions/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newDiscussion),
            });

            if (!res.ok) throw new Error("Błąd przy tworzeniu dyskusji");

            const data = await res.json();
            setThreads((prev) => [data, ...prev]);
            setModalOpen(false);
            setNewDiscussion({ title: "", category: "OGOLNE", content: "" });
        } catch (err) {
            console.error(err);
            alert("Nie udało się utworzyć dyskusji.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="tt-container">
                <div className="tt-topic-list">
                    {/* Filtry wyszukiwania dyskusji */}
                    <div className="filters">
                        <select
                            value={filters.category}
                            onChange={(e) =>
                            setFilters((prev) => ({ ...prev, category: e.target.value }))
                            }
                            className="filter-select"
                        >
                            <option value="ALL">Wszystkie kategorie</option>
                            {Object.keys(CATEGORY_COLORS).map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) =>
                            setFilters((prev) => ({ ...prev, status: e.target.value }))
                            }
                            className="filter-select"
                        >
                            <option value="ALL">Wszystkie</option>
                            <option value="OPEN">Otwarte</option>
                            <option value="CLOSED">Zamknięte</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Szukaj w tytułach..."
                            value={filters.search}
                            onChange={(e) =>
                            setFilters((prev) => ({ ...prev, search: e.target.value }))
                            }
                            className="filter-input"
                        />
                    </div>

                    <div className="tt-list-header">
                        <div className="tt-col-topic">Tytuł</div>
                        <div className="tt-col-category">Kategoria</div>
                        <div className="tt-col-value hide-mobile">Status</div>
                        <div className="tt-col-value hide-mobile">Polubienia</div>
                        <div className="tt-col-value hide-mobile">Komentarze</div>
                        <div className="tt-col-value hide-mobile">Wyświetlenia</div>
                        <div className="tt-col-value">Ostatnia aktywność</div>
                    </div>

                    {loading ? (
                        <div className="tt-item">
                            <div className="tt-col-message">Ładowanie...</div>
                        </div>
                    ) : (
                    threads.map((t, index) => (
                        <div key={t.id} className={`tt-item ${index < 3 ? "tt-itemselect" : ""}`} onClick={() => openDiscussion(t.id)} >
                            <div className="tt-col-avatar">
                                <svg className="tt-icon">
                                    <use xlinkHref={`#icon-ava-${t.avatar.toLowerCase()}`}></use>
                                </svg>
                            </div>
                            <div className="tt-col-description">
                                <h6 className="tt-title">
                                    {t.title}
                                    {t.locked && (
                                        <span className="tt-status-indicator tt-status-locked" title="Dyskusja zamknięta">
                                            <i className="tt-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12">
                                                    <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                                </svg>
                                            </i>
                                        </span>
                                    )}
                                </h6>
                                <div className="row align-items-center no-gutters">
                                    <div className="col-11">
                                        <ul className="tt-list-badge">
                                            <li className="show-mobile">
                                                <span className={`${getCategoryClass(t.category)} tt-badge`}>
                                                    {t.category}
                                                </span>
                                            </li>
                                            {t.tags.map((tag, idx) => (
                                                <li key={idx}>
                                                    <span className="tt-badge">{tag}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="col-1 ml-auto show-mobile">
                                        <div className="tt-value">{t.activity}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="tt-col-category">
                                <span className={`${getCategoryClass(t.category)} tt-badge`}>
                                    {t.category}
                                </span>
                            </div>
                            <div className="tt-col-value hide-mobile">
                                {t.locked ? (
                                    <span className="tt-status-badge tt-status-closed" title="Zamknięte">
                                        <i className="tt-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12">
                                                <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                            </svg>
                                        </i>
                                        Zamknięte
                                    </span>
                                ) : (
                                    <span className="tt-status-badge tt-status-open" title="Otwarte">
                                        <i className="tt-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="12" height="12">
                                                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                            </svg>
                                        </i>
                                        Otwarte
                                    </span>
                                )}
                            </div>
                            <div className="tt-col-value hide-mobile">{t.likes}</div>
                            <div className="tt-col-value tt-color-select hide-mobile">{t.replies}</div>
                            <div className="tt-col-value hide-mobile">{t.views}</div>
                            <div className="tt-col-value hide-mobile">{t.activity}</div>
                        </div>
                    ))
                )}
            </div>

            <button className="create-discussion-btn" onClick={() => setModalOpen(true)}>+</button>

            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Nowa dyskusja</h3>
                        <input 
                            type="text" 
                            name="title" 
                            placeholder="Tytuł" 
                            value={newDiscussion.title} 
                            onChange={handleInputChange}
                        />
                        <select 
                            name="category" 
                            value={newDiscussion.category} 
                            onChange={handleInputChange}
                        >
                            {Object.keys(CATEGORY_COLORS).map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                        <textarea 
                            name="content" 
                            placeholder="Treść dyskusji" 
                            value={newDiscussion.content} 
                            onChange={handleInputChange}
                        />
                        <button 
                            onClick={handleCreateDiscussion} 
                            disabled={submitting} 
                            className="submit-discussion-btn"
                        >
                            {submitting ? "Tworzenie..." : "Utwórz"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}