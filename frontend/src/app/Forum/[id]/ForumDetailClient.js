"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ForumDetail.module.css";
import { getToken, getCurrentUser } from '@/services/auth';

export default function ForumDetailClient({ initialDiscussion, initialComments, discussionId }) {
  const [discussion, setDiscussion] = useState(initialDiscussion);
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(!initialDiscussion);
  const [userVotes, setUserVotes] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [userDiscussionVote, setUserDiscussionVote] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const editorRef = useRef();
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [images, setImages] = useState([]);
  const [sort, setSort] = useState("recent");
  const sortMap = {
    recent: "-created_at",
    liked: "-likes",
    longest: "-length",
    shortest: "length",
  };
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = 'https://engineer-project.onrender.com';


  const handleSortClick = (type) => {
    setSort(type);
    setPage(1);
  };

  const handleSelectChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Można dodać maksymalnie 5 zdjęć");
      return;
    }
    setImages(files);
  };
  


  // Pobierz aktualnego użytkownika przy ładowaniu komponentu
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser(); 
        setCurrentUser(user);
      } catch (error) {
        console.error("Błąd podczas pobierania użytkownika: ", error);
      }
    };

    fetchCurrentUser();
  }, []);


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

  const fetchDiscussion = async () => {
    try {
      const res = await fetch(`${API_URL}/api/discussions/${discussionId}/`);
      const data = await res.json();
      setDiscussion(data);
    } catch (error) {
      console.error("Error fetching discussion:", error);
    }
  };

  const handleCloseDiscussion = async () => {
    if (confirm("Czy na pewno chcesz zamknąć tę dyskusję?")) {
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/discussions/${discussionId}/close/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          fetchDiscussion();
          alert("Dyskusja została zamknięta.");
        } else {
          alert("Nie udało się zamknąć dyskusji.");
        }
      } catch (error) {
        console.error("Error closing discussion:", error);
        alert("Wystąpił błąd podczas zamykania dyskusji.");
      }
    }
  };

  // Funkcja do głosowania na dyskusję
  const handleDiscussionVote = async (action) => {
    try {
      const token = getToken();
      if (!token) {
        alert("Musisz być zalogowany, aby głosować");
        return;
      }

      const res = await fetch(`${API_URL}/api/discussions/${discussionId}/vote/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error('Nie udało się zaktualizować głosu');

        const result = await res.json();
            
        setDiscussion(prev => ({
          ...prev,
          likes_count: result.likes_count,
          dislikes_count: result.dislikes_count
        }));
            
        setUserDiscussionVote(result.user_vote);

      } catch (err) {
        console.error("Błąd głosowania:", err);
        alert(err.message || "Wystąpił błąd podczas głosowania");
      }
  };

  // Funkcja do obsługi ulubionych
  const handleFavorite = async () => {
    try {
      const token = getToken();
      if (!token) {
        alert("Musisz być zalogowany, aby dodawać do ulubionych");
        return;
      }

      const res = await fetch(`${API_URL}/api/discussions/${discussionId}/favorite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Nie udało się zaktualizować ulubionych');

        const result = await res.json();
            
        setDiscussion(prev => ({
          ...prev,
          favorites_count: result.favorites_count
        }));
            
        setIsFavorited(result.is_favorited);

      } catch (err) {
        console.error("Błąd ulubionych:", err);
        alert(err.message || "Wystąpił błąd");
      }
  };

  const fetchComments = async () => {
    try {
      const token = getToken();
      setLoading(true);
      // Budujemy query params
      const params = new URLSearchParams({
        page: page.toString(),
        sort: sort,
      });

      const res = await fetch(`${API_URL}/api/discussions/${discussionId}/comments/?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      const data = await res.json();
      console.log("Fetched comments data:", data);
      const commentsData = data.results || data;
      setComments(commentsData);
      // Ustaw liczbę stron
      if (data.count) {
        setTotalPages(Math.ceil(data.count / 10));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page, sort]);


  const postComment = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("content", content);
      formData.append("discussion", discussionId);
      images.forEach((file) => formData.append("images", file));

      await fetch(`http://localhost:8000/api/discussions/${discussionId}/comments/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      setContent("");
       if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }

      setActiveStyles({
        bold: false,
        italic: false,
        underline: false,
      });
      fetchComments();
      setImages([]);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };


  // Aktualizowanie statystyk komentarza
  const handleVote = async (commentId, action) => {
    try {
      const token = getToken();
      if (!token) {
        alert("Musisz być zalogowany, aby głosować");
        return;
      }

      const res = await fetch(`http://localhost:8000/api/comments/${commentId}/vote/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
       },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Nie udało się zaktualizować głosu');
      }

      const result = await res.json();

      // Aktualizuj stan komentarzy
      setComments(prev => prev.map(comment =>
        comment.id === commentId 
          ? { 
              ...comment, 
              likes_count: result.likes_count, 
              dislikes_count: result.dislikes_count 
            } 
          : comment
      ));

      // Aktualizuj stan głosów użytkownika
      setUserVotes(prev => ({
        ...prev,
        [commentId]: result.user_vote
      }));

    } catch (err) {
      console.error("Błąd głosowania:", err);
      alert(err.message || "Wystąpił błąd podczas głosowania");
    }
  };

  const renderVoteButtons = (comment) => {
    const currentVote = userVotes[comment.id];

    return(
      <div className={styles.boxLeft}>
        <a className={styles.iconBtn} onClick={() => {
          if (currentVote === 'like') {
            // Jeśli już mamy like, usuwamy głos
            handleVote(comment.id, 'remove');
          } else {
            // Jeśli nie mamy like, dodajemy like (usuwając ewentualny dislike)
            handleVote(comment.id, 'like');
          }
        }}>
          <i className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M144 224C161.7 224 176 238.3 176 256L176 512C176 529.7 161.7 544 144 544L96 544C78.3 544 64 529.7 64 512L64 256C64 238.3 78.3 224 96 224L144 224zM334.6 80C361.9 80 384 102.1 384 129.4L384 133.6C384 140.4 382.7 147.2 380.2 153.5L352 224L512 224C538.5 224 560 245.5 560 272C560 291.7 548.1 308.6 531.1 316C548.1 323.4 560 340.3 560 360C560 383.4 543.2 402.9 521 407.1C525.4 414.4 528 422.9 528 432C528 454.2 513 472.8 492.6 478.3C494.8 483.8 496 489.8 496 496C496 522.5 474.5 544 448 544L360.1 544C323.8 544 288.5 531.6 260.2 508.9L248 499.2C232.8 487.1 224 468.7 224 449.2L224 262.6C224 247.7 227.5 233 234.1 219.7L290.3 107.3C298.7 90.6 315.8 80 334.6 80z"/>
            </svg>
          </i>
          <span className={styles.text}>{comment.likes_count || 0}</span>
        </a>
        <a className={styles.iconBtn} onClick={() => {
          if (currentVote === 'dislike') {
            // Jeśli już mamy dislike, usuwamy głos
            handleVote(comment.id, 'remove');
          } else {
            // Jeśli nie mamy dislike, dodajemy dislike (usuwając ewentualny like)
            handleVote(comment.id, 'dislike');
          }
        }}>
          <i className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M448 96C474.5 96 496 117.5 496 144C496 150.3 494.7 156.2 492.6 161.7C513 167.2 528 185.8 528 208C528 217.1 525.4 225.6 521 232.9C543.2 237.1 560 256.6 560 280C560 299.7 548.1 316.6 531.1 324C548.1 331.4 560 348.3 560 368C560 394.5 538.5 416 512 416L352 416L380.2 486.4C382.7 492.7 384 499.5 384 506.3L384 510.5C384 537.8 361.9 559.9 334.6 559.9C315.9 559.9 298.8 549.3 290.4 532.6L234.1 420.3C227.4 407 224 392.3 224 377.4L224 190.8C224 171.4 232.9 153 248 140.8L260.2 131.1C288.6 108.4 323.8 96 360.1 96L448 96zM144 160C161.7 160 176 174.3 176 192L176 448C176 465.7 161.7 480 144 480L96 480C78.3 480 64 465.7 64 448L64 192C64 174.3 78.3 160 96 160L144 160z"/>
            </svg>
          </i>
          <span className={styles.text}>{comment.dislikes_count || 0}</span>
        </a>
      </div>
    );
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Komenda do edycji komentarza
  const exec = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    refreshActiveStyles();
  };

  const handleInput = () => {
    setContent(editorRef.current.innerHTML);
  };

  const refreshActiveStyles = () => {
    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  useEffect(() => {
    const handler = () => refreshActiveStyles();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);


  useEffect(() => {
    // Jeśli dane nie zostały przekazane z serwera, pobierz je
    if (!initialDiscussion) {
      fetchDiscussion();
    }
    if (!initialComments) {
      fetchComments();
    }
  }, [discussionId, initialDiscussion, initialComments]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.singleTopicList}>
          <div className={styles.item}>
            <div className={styles.singleTopic}>
              <div className={styles.itemDescription}>
                <p>Ładowanie...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className={styles.container}>
        <div className={styles.singleTopicList}>
          <div className={styles.item}>
            <div className={styles.singleTopic}>
              <div className={styles.itemDescription}>
                <p>Nie znaleziono dyskusji.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.singleTopicList}>
        {/* Główny post */}
        <div className={styles.item}>
          <div className={styles.singleTopic}>
            <div className={styles.itemHeader}>
              <div className={styles.itemHeaderRow}>
                <div className={`${styles.itemInfo} ${styles.itemInfoTop}`}>
                  <div className={styles.avatarIcon}>
                    <img 
                      src={discussion.author_avatar} 
                      alt={discussion.author_name} 
                      className={styles.iconAvatar}
                    />
                  </div>
                  <div className={styles.avatarTitle}>
                    <a>{discussion.author_name}</a>
                  </div>
                  <a className={styles.infoTime}>
                    <i className={styles.icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/>
                      </svg>
                    </i>
                    {formatDate(discussion.created_at)}
                  </a>
                </div>
                
                {/* Przycisk zamknięcia dyskusji - widoczny tylko dla autora */}
                {discussion.author === currentUser?.id && !discussion.locked && (
                  <div className={styles.itemActions}>
                    <h3 className={styles.itemTitle}>
                      <a>{discussion.title}</a>
                      {discussion.locked && (
                        <span className={`${styles.statusBadge} ${styles.statusClosed}`}>Zamknięte</span>
                      )}
                    </h3>
                    <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={handleCloseDiscussion} title="Zamknij dyskusję">
                      <i className={styles.icon}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                        </svg>
                      </i>
                      Zamknij dyskusje
                    </button>
                  </div>
                )}
              </div>
              
              <div className={styles.itemTag}>
                <ul className={styles.listBadge}>
                  <li>
                    <a>
                      <span className={`${getCategoryClass(discussion.category)} ${styles.badge}`}>
                        {discussion.category}
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className={styles.itemDescription}>
              <div dangerouslySetInnerHTML={{ __html: discussion.content.replace(/\n/g, '<br/>') }} />

              {/* Wyświetlanie zdjęć dyskusji */}
              {discussion.images && discussion.images.length > 0 && (
                <div className={styles.discussionImages}>
                  {discussion.images.map((imgObj) => (
                    <img
                      key={imgObj.id}
                      src={imgObj.image}
                      alt={`Załącznik ${imgObj.id}`}
                      className={styles.discussionImage}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className={`${styles.itemInfo} ${styles.itemInfoBottom}`}>
              <div className={styles.boxLeft}>
                <a className={styles.iconBtn} onClick={() => {
                    if (userDiscussionVote === 'like') {
                      handleDiscussionVote('remove');
                    } else {
                      handleDiscussionVote('like');
                    }
                  }}
                >
                  <i className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path d="M144 224C161.7 224 176 238.3 176 256L176 512C176 529.7 161.7 544 144 544L96 544C78.3 544 64 529.7 64 512L64 256C64 238.3 78.3 224 96 224L144 224zM334.6 80C361.9 80 384 102.1 384 129.4L384 133.6C384 140.4 382.7 147.2 380.2 153.5L352 224L512 224C538.5 224 560 245.5 560 272C560 291.7 548.1 308.6 531.1 316C548.1 323.4 560 340.3 560 360C560 383.4 543.2 402.9 521 407.1C525.4 414.4 528 422.9 528 432C528 454.2 513 472.8 492.6 478.3C494.8 483.8 496 489.8 496 496C496 522.5 474.5 544 448 544L360.1 544C323.8 544 288.5 531.6 260.2 508.9L248 499.2C232.8 487.1 224 468.7 224 449.2L224 262.6C224 247.7 227.5 233 234.1 219.7L290.3 107.3C298.7 90.6 315.8 80 334.6 80z"/>
                    </svg>
                  </i>
                  <span className={styles.text}>{discussion.likes_count}</span>
                </a>
                <a className={styles.iconBtn} onClick={() => {
                  if (userDiscussionVote === 'dislike') {
                    handleDiscussionVote('remove');
                  } else {
                    handleDiscussionVote('dislike');
                  }
                }}>
                  <i className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path d="M448 96C474.5 96 496 117.5 496 144C496 150.3 494.7 156.2 492.6 161.7C513 167.2 528 185.8 528 208C528 217.1 525.4 225.6 521 232.9C543.2 237.1 560 256.6 560 280C560 299.7 548.1 316.6 531.1 324C548.1 331.4 560 348.3 560 368C560 394.5 538.5 416 512 416L352 416L380.2 486.4C382.7 492.7 384 499.5 384 506.3L384 510.5C384 537.8 361.9 559.9 334.6 559.9C315.9 559.9 298.8 549.3 290.4 532.6L234.1 420.3C227.4 407 224 392.3 224 377.4L224 190.8C224 171.4 232.9 153 248 140.8L260.2 131.1C288.6 108.4 323.8 96 360.1 96L448 96zM144 160C161.7 160 176 174.3 176 192L176 448C176 465.7 161.7 480 144 480L96 480C78.3 480 64 465.7 64 448L64 192C64 174.3 78.3 160 96 160L144 160z"/>
                    </svg>
                  </i>
                  <span className={styles.text}>{discussion.dislikes_count}</span>
                </a>
                <a className={styles.iconBtn} onClick={handleFavorite}>
                  <i className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"/>
                    </svg>
                  </i>
                  <span className={styles.text}>{discussion.favorites_count}</span>
                </a>
              </div>
              
              <a className={styles.iconBtn}>
                <i className={styles.icon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M448 256C501 256 544 213 544 160C544 107 501 64 448 64C395 64 352 107 352 160C352 165.4 352.5 170.8 353.3 176L223.6 248.1C206.7 233.1 184.4 224 160 224C107 224 64 267 64 320C64 373 107 416 160 416C184.4 416 206.6 406.9 223.6 391.9L353.3 464C352.4 469.2 352 474.5 352 480C352 533 395 576 448 576C501 576 544 533 544 480C544 427 501 384 448 384C423.6 384 401.4 393.1 384.4 408.1L254.7 336C255.6 330.8 256 325.5 256 320C256 314.5 255.5 309.2 254.7 304L384.4 231.9C401.3 246.9 423.6 256 448 256z"/>
                  </svg>
                </i>
              </a>
            </div>
          </div>
        </div>

        {/* Statystyki wątku */}
        <div className={styles.item}>
          <div className={styles.infoBox}>
            <h6 className={styles.title}>Statystyki dyskusji</h6>
            <div className={styles.rowIcon}>
              <div className={styles.item}>
                <a className={`${styles.iconBtn} ${styles.positionBottom}`}>
                  <i className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path d="M268.2 82.4C280.2 87.4 288 99 288 112L288 192L400 192C497.2 192 576 270.8 576 368C576 481.3 494.5 531.9 475.8 542.1C473.3 543.5 470.5 544 467.7 544C456.8 544 448 535.1 448 524.3C448 516.8 452.3 509.9 457.8 504.8C467.2 496 480 478.4 480 448.1C480 395.1 437 352.1 384 352.1L288 352.1L288 432.1C288 445 280.2 456.7 268.2 461.7C256.2 466.7 242.5 463.9 233.3 454.8L73.3 294.8C60.8 282.3 60.8 262 73.3 249.5L233.3 89.5C242.5 80.3 256.2 77.6 268.2 82.6z"/>
                    </svg>
                  </i>
                  <span className={styles.text}>{comments.length}</span>
                </a>
              </div>
              <div className={styles.item}>
                <a className={`${styles.iconBtn} ${styles.positionBottom}`}>
                  <i className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z"/>
                    </svg>
                  </i>
                  <span className={styles.text}>{discussion.views || 0}</span>
                </a>
              </div>
              <div className={styles.item}>
                <a className={`${styles.iconBtn} ${styles.positionBottom}`}>
                  <i className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"/>
                    </svg>
                  </i>
                  <span className={styles.text}>{new Set(comments.map(c => c.author)).size}</span>
                </a>
              </div>
              <div className={styles.item}>
                <a className={`${styles.iconBtn} ${styles.positionBottom}`}>
                  <i className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path d="M144 224C161.7 224 176 238.3 176 256L176 512C176 529.7 161.7 544 144 544L96 544C78.3 544 64 529.7 64 512L64 256C64 238.3 78.3 224 96 224L144 224zM334.6 80C361.9 80 384 102.1 384 129.4L384 133.6C384 140.4 382.7 147.2 380.2 153.5L352 224L512 224C538.5 224 560 245.5 560 272C560 291.7 548.1 308.6 531.1 316C548.1 323.4 560 340.3 560 360C560 383.4 543.2 402.9 521 407.1C525.4 414.4 528 422.9 528 432C528 454.2 513 472.8 492.6 478.3C494.8 483.8 496 489.8 496 496C496 522.5 474.5 544 448 544L360.1 544C323.8 544 288.5 531.6 260.2 508.9L248 499.2C232.8 487.1 224 468.7 224 449.2L224 262.6C224 247.7 227.5 233 234.1 219.7L290.3 107.3C298.7 90.6 315.8 80 334.6 80z"/>
                    </svg>
                  </i>
                  <span className={styles.text}>{discussion.likes_count || 0}</span>
                </a>
              </div>
            </div>
            <div className={styles.hr} />
            <h6 className={styles.title}>Często publikujący</h6>
            <div className={styles.rowIcon}>
              {Array.from( new Map( comments.map((c) => [ c.author,{ name: c.author_name, avatar: c.author_avatar }])).values()).slice(0, 6)
                .map((user, index) => (
                  <div className={styles.item} key={index}>
                    <img 
                      src={user.avatar}
                      alt={user.name}
                      className={styles.iconAvatar}
                    />
                  </div>
              ))}
            </div>
            <div className={styles.hr} />
            <div className={styles.rowObjectInline}>
              <h6 className={styles.title}>Sortowanie komentarzy:</h6>
              <ul className={`${styles.listBadge} ${styles.sizeLg}`}>
                <li>
                  <span className={`${styles.badge} ${sort === "recent" ? styles.active : ""}`} onClick={() => handleSortClick("recent")}>
                    Ostatnie
                  </span>
                </li>
                <li>
                  <span className={`${styles.badge} ${sort === "liked" ? styles.active : ""}`} onClick={() => handleSortClick("liked")}>
                    Najczęściej lubiane
                  </span>
                </li>
                <li>
                  <span className={`${styles.badge} ${sort === "longest" ? styles.active : ""}`} onClick={() => handleSortClick("longest")}>
                    Najdłuższe
                  </span>
                </li>
                <li>
                  <span className={`${styles.badge} ${sort === "shortest" ? styles.active : ""}`} onClick={() => handleSortClick("shortest")}>
                    Najkrótsze
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Komentarze */}
        {comments.map((comment) => (
          <div className={styles.item} key={comment.id}>
            <div className={styles.singleTopic}>
              <div className={`${styles.itemHeader} ${styles.ptNoborder}`}>
                <div className={`${styles.itemInfo} ${styles.itemInfoTop}`}>
                  <div className={styles.avatarIcon}>
                    <img 
                      src={comment.author_avatar} 
                      alt={comment.author_name} 
                      className={styles.iconAvatar}
                    />
                  </div>
                  <div className={styles.avatarTitle}>
                    <a>{comment.author_name}</a>
                  </div>
                  <a className={styles.infoTime}>
                    <i className={styles.icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/>
                      </svg>
                    </i>
                    {formatDate(comment.created_at)}
                  </a>
                </div>
              </div>
              <div className={styles.itemDescription}>
                <div dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, '<br/>') }} />
                
                {/* Wyświetlenie zdjęcia */}
                {comment.images && comment.images.length > 0 && (
                <div className={styles.discussionImages}>
                  {comment.images.map((imgObj) => (
                    <img
                      key={imgObj.id}
                      src={imgObj.image}
                      alt={`Załącznik ${imgObj.id}`}
                      className={styles.discussionImage}
                    />
                  ))}
                </div>
              )}
              </div>
              <div className={`${styles.itemInfo} ${styles.itemInfoBottom}`}>
                {renderVoteButtons(comment)}
                <div>
                  <a className={styles.iconBtn}>
                    <i className={styles.icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M268.2 82.4C280.2 87.4 288 99 288 112L288 192L400 192C497.2 192 576 270.8 576 368C576 481.3 494.5 531.9 475.8 542.1C473.3 543.5 470.5 544 467.7 544C456.8 544 448 535.1 448 524.3C448 516.8 452.3 509.9 457.8 504.8C467.2 496 480 478.4 480 448.1C480 395.1 437 352.1 384 352.1L288 352.1L288 432.1C288 445 280.2 456.7 268.2 461.7C256.2 466.7 242.5 463.9 233.3 454.8L73.3 294.8C60.8 282.3 60.8 262 73.3 249.5L233.3 89.5C242.5 80.3 256.2 77.6 268.2 82.6z"/>
                      </svg>
                    </i>
                  </a>

                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Paginacja */}
        <div className={styles.paginationWrapper}>
          <button className={styles.paginationBtn} onClick={handlePrev} disabled={page === 1}>
            Poprzednia
          </button>

          <span className={styles.pageNumber}>
            Strona {page} z {totalPages}
          </span>

          <button className={styles.paginationBtn} onClick={handleNext} disabled={page === totalPages}>
            Następna
          </button>
        </div>


        {/* Edytor odpowiedzi */}
        {!discussion.locked ? (
          <>
            <div className={styles.wrapperInner}>
              <div className={styles.ptEditor}>
                <h6 className={styles.ptTitle}>Dodaj komentarz</h6>
                <div className={styles.ptRow}>
                  <div className={styles.colLeft}>
                    <ul className={styles.ptEditBtn}>
                      <li>
                        <a className={`${styles.btnIcon} ${activeStyles.bold ? styles.active : ""}`} onMouseDown={(e) => { e.preventDefault(); exec("bold"); }}>
                          <i className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                              <path d="M160 96C142.3 96 128 110.3 128 128C128 145.7 142.3 160 160 160L192 160L192 480L160 480C142.3 480 128 494.3 128 512C128 529.7 142.3 544 160 544L384 544C454.7 544 512 486.7 512 416C512 369.5 487.2 328.7 450 306.3C468.7 284 480 255.3 480 224C480 153.3 422.7 96 352 96L160 96zM416 224C416 259.3 387.3 288 352 288L256 288L256 160L352 160C387.3 160 416 188.7 416 224zM256 480L256 352L384 352C419.3 352 448 380.7 448 416C448 451.3 419.3 480 384 480L256 480z"/>
                            </svg>
                          </i>
                        </a>
                      </li>

                      <li>
                        <a className={`${styles.btnIcon} ${activeStyles.italic ? styles.active : ""}`} onMouseDown={(e) => { e.preventDefault(); exec("italic"); }}>
                          <i className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                              <path d="M256 128C256 110.3 270.3 96 288 96L480 96C497.7 96 512 110.3 512 128C512 145.7 497.7 160 480 160L421.3 160L288 480L352 480C369.7 480 384 494.3 384 512C384 529.7 369.7 544 352 544L160 544C142.3 544 128 529.7 128 512C128 494.3 142.3 480 160 480L218.7 480L352 160L288 160C270.3 160 256 145.7 256 128z"/>
                            </svg>
                          </i>
                        </a>
                      </li>

                      <li>
                        <a className={`${styles.btnIcon} ${activeStyles.underline ? styles.active : ""}`} onMouseDown={(e) => { e.preventDefault(); exec("underline"); }}>
                          <i className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                              <path d="M128 96C128 78.3 142.3 64 160 64L224 64C241.7 64 256 78.3 256 96C256 113.7 241.7 128 224 128L224 288C224 341 267 384 320 384C373 384 416 341 416 288L416 128C398.3 128 384 113.7 384 96C384 78.3 398.3 64 416 64L480 64C497.7 64 512 78.3 512 96C512 113.7 497.7 128 480 128L480 288C480 376.4 408.4 448 320 448C231.6 448 160 376.4 160 288L160 128C142.3 128 128 113.7 128 96zM128 544C128 526.3 142.3 512 160 512L480 512C497.7 512 512 526.3 512 544C512 561.7 497.7 576 480 576L160 576C142.3 576 128 561.7 128 544z"/>
                            </svg>
                          </i>
                        </a>
                      </li>

                      <li>
                        <a className={styles.btnIcon} onClick={() => document.querySelector('input[type="file"]').click()}>
                  
                          <i className={styles.icon}>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ display: "none" }}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                              <path d="M288.6 76.8C344.8 20.6 436 20.6 492.2 76.8C548.4 133 548.4 224.2 492.2 280.4L328.2 444.4C293.8 478.8 238.1 478.8 203.7 444.4C169.3 410 169.3 354.3 203.7 319.9L356.5 167.3C369 154.8 389.3 154.8 401.8 167.3C414.3 179.8 414.3 200.1 401.8 212.6L249 365.3C239.6 374.7 239.6 389.9 249 399.2C258.4 408.5 273.6 408.6 282.9 399.2L446.9 235.2C478.1 204 478.1 153.3 446.9 122.1C415.7 90.9 365 90.9 333.8 122.1L169.8 286.1C116.7 339.2 116.7 425.3 169.8 478.4C222.9 531.5 309 531.5 362.1 478.4L492.3 348.3C504.8 335.8 525.1 335.8 537.6 348.3C550.1 360.8 550.1 381.1 537.6 393.6L407.4 523.6C329.3 601.7 202.7 601.7 124.6 523.6C46.5 445.5 46.5 318.9 124.6 240.8L288.6 76.8z"/>
                            </svg>
                          </i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <form onSubmit={postComment}>
                  {images.length > 0 && (
                    <div className={styles.imagePreviewContainer}>
                      {images.map((img, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(img)}
                          alt={`preview-${i}`}
                          className={styles.imagePreview}
                        />
                      ))}
                    </div>
                  )}
                  <div
                    ref={editorRef}
                    className={styles.formControl}
                    contentEditable={true}
                    onInput={handleInput}
                    suppressContentEditableWarning={true}
                    style={{ minHeight: "150px", cursor: "text" }}
                  ></div>
                  <div className={styles.ptRow}>
                    <div className={styles.colAuto}></div>
                    <div className={styles.colAuto}>
                      <button type="submit" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnWidthLg}`}>Wyślij</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          /* Komunikat gdy dyskusja jest zamknięta */
          <div className={styles.wrapperInner}>
            <div className={`${styles.alert} ${styles.alertDefault} ${styles.alertDisabled}`}>
              <div className={styles.alertIcon}>
                <i className={styles.icon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                  </svg>
                </i>
              </div>
              <div className={styles.alertContent}>
                <h6 className={styles.alertTitle}>Dyskusja została zamknięta</h6>
                <p>Ta dyskusja jest zamknięta dla nowych odpowiedzi.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}