"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DiscussionDetailPage() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [comment, setComment] = useState("");

  // Pobieranie szczegółów dyskusji
  const fetchDiscussion = () => {
    fetch(`http://127.0.0.1:8000/api/discussions/${id}/`)
      .then((res) => res.json())
      .then((data) => setDiscussion(data));
  };

  useEffect(() => {
    if (id) fetchDiscussion();
  }, [id]);

  // Dodanie komentarza
  const handleAddComment = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Musisz być zalogowany, aby dodać komentarz!");
      return;
    }

    await fetch("http://127.0.0.1:8000/api/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        discussion: id, // backend wymaga ID dyskusji
        content: comment,
      }),
    });

    setComment("");
    fetchDiscussion(); // odśwież po dodaniu komentarza
  };

  if (!discussion) {
    return <p className="p-6">Ładowanie...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero sekcja */}
      <div
        className="relative bg-cover bg-center h-64 flex items-center justify-center"
        style={{ backgroundImage: "url('/cars-background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="relative text-4xl md:text-5xl font-bold text-yellow-400">
          {discussion.title}
        </h1>
      </div>

      {/* Szczegóły dyskusji */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <p className="text-gray-800">{discussion.content}</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>Autor: {discussion.author}</span>
            <span>
              {new Date(discussion.created).toLocaleDateString("pl-PL")}
            </span>
          </div>
        </div>

        {/* Komentarze */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Komentarze
        </h2>
        {discussion.comments && discussion.comments.length > 0 ? (
          discussion.comments.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-200"
            >
              <p>{c.content}</p>
              <div className="mt-2 text-sm text-gray-500">
                Autor: {c.author} •{" "}
                {new Date(c.created).toLocaleDateString("pl-PL")}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Brak komentarzy</p>
        )}

        {/* Formularz dodawania komentarza */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Dodaj komentarz</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Napisz komentarz..."
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            rows={4}
          />
          <button
            onClick={handleAddComment}
            className="bg-green-500 text-white px-6 py-2 rounded-full shadow hover:bg-green-600 transition"
          >
            Dodaj komentarz
          </button>
        </div>
      </div>
    </div>
  );
}
