"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function DiscussionDetailPage() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]); // Oddzielny stan dla komentarzy
  const router = useRouter();

  // Sprawdź autoryzację przy załadowaniu komponentu
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Nie przekierowuj od razu, tylko ustaw stan
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Pobieranie szczegółów dyskusji
  const fetchDiscussion = async () => {
    try {
      console.log('Fetching discussion with ID:', id);
      const response = await fetch(`http://127.0.0.1:8000/api/discussions/${id}/`);
      
      console.log('Discussion response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Discussion data:', data);
        setDiscussion(data);
        
        // Jeśli dyskusja ma komentarze w odpowiedzi, użyj ich
        if (data.comments) {
          setComments(data.comments);
        } else {
          // Jeśli nie, pobierz komentarze osobno
          fetchComments();
        }
      } else {
        throw new Error('Błąd podczas pobierania dyskusji');
      }
    } catch (error) {
      console.error('Error fetching discussion:', error);
      alert('Błąd podczas pobierania dyskusji');
    }
  };

  // Pobieranie komentarzy osobno
  const fetchComments = async () => {
    try {
      console.log('Fetching comments for discussion:', id);
      const response = await fetch(`http://127.0.0.1:8000/api/discussions/${id}/comments/`);
      
      console.log('Comments response status:', response.status);
      
      if (response.ok) {
        const commentsData = await response.json();
        console.log('Comments data:', commentsData);
        setComments(commentsData);
      } else {
        console.log('No comments found or error');
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDiscussion();
    }
  }, [id]);

  // Dodanie komentarza
  const handleAddComment = async () => {
    if (!isAuthenticated) {
      alert("Musisz być zalogowany, aby dodać komentarz!");
      router.push('/login');
      return;
    }

    if (!comment.trim()) {
      alert("Komentarz nie może być pusty!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`http://127.0.0.1:8000/api/discussions/${id}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: comment,
        }),
      });

      console.log('Add comment response status:', response.status);

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        alert("Sesja wygasła. Zaloguj się ponownie.");
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Comment error:', errorData);
        throw new Error(errorData.detail || 'Błąd podczas dodawania komentarza');
      }

      const newComment = await response.json();
      console.log('New comment created:', newComment);
      
      setComment("");
      // Odśwież komentarze po dodaniu nowego
      fetchComments();
      alert("Komentarz został dodany pomyślnie!");
      
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error.message || "Błąd podczas dodawania komentarza");
    } finally {
      setLoading(false);
    }
  };

  // Debug: wyświetl stan komponentu
  console.log('Component state:', {
    discussion,
    comments,
    commentsCount: comments.length,
    discussionComments: discussion?.comments
  });

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Ładowanie dyskusji...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero sekcja */}
      <div
        className="relative bg-cover bg-center h-64 flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{discussion.title}</h1>
          <p className="text-lg opacity-90">Autor: {discussion.author_name || discussion.author}</p>
        </div>
      </div>

      {/* Szczegóły dyskusji */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {discussion.category}
            </span>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Wyświetleń: {discussion.views || 0}</span>
              <span>Komentarzy: {comments.length}</span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
              {discussion.content}
            </p>
          </div>
          
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500 border-t pt-4">
            <span>Stworzono: {new Date(discussion.created_at || discussion.created).toLocaleDateString("pl-PL")}</span>
            {discussion.updated_at && discussion.updated_at !== discussion.created_at && (
              <span>Zaktualizowano: {new Date(discussion.updated_at).toLocaleDateString("pl-PL")}</span>
            )}
          </div>
        </div>

        {/* Komentarze */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Komentarze ({comments.length})
            </h2>
            <button 
              onClick={fetchComments}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Odśwież
            </button>
          </div>
          
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <p className="text-gray-800 mb-2">{comment.content}</p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{comment.author_name || comment.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(comment.created_at || comment.created).toLocaleDateString("pl-PL", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <p className="text-gray-600 text-lg mb-2">Brak komentarzy</p>
              <p className="text-gray-500">Bądź pierwszy, który skomentuje tę dyskusję!</p>
            </div>
          )}
        </div>

        {/* Formularz dodawania komentarza */}
        {isAuthenticated ? (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Dodaj komentarz</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Napisz swój komentarz..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {comment.length} znaków
              </span>
              <button
                onClick={handleAddComment}
                disabled={loading || !comment.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Dodawanie...
                  </span>
                ) : (
                  "Dodaj komentarz"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 mb-2">
              Musisz być zalogowany, aby dodać komentarz.
            </p>
            <button 
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Zaloguj się
            </button>
          </div>
        )}
      </div>
    </div>
  );
}