'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  async function getPosts() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/posts/", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      showTemporaryToast("Błąd podczas pobierania postów", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  const showTemporaryToast = (message, type = "success") => {
    setToast({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setTimeout(() => setToast(null), 3500);
  };

  const deletePost = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== id));
        showTemporaryToast("Post został usunięty", "success");
      } else {
        showTemporaryToast("Nie udało się usunąć posta", "error");
      }
    } catch (error) {
      console.error(error);
      showTemporaryToast("Błąd sieci", "error");
    }
  };

  const addPost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      showTemporaryToast("Wypełnij wszystkie pola", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]); // dodaje nowy post na górze listy
        setTitle("");
        setContent("");
        showTemporaryToast("Post został dodany", "success");
      } else {
        const err = await res.json();
        console.error(err);
        showTemporaryToast("Nie udało się dodać posta", "error");
      }
    } catch (error) {
      console.error(error);
      showTemporaryToast("Błąd sieci", "error");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Mój Blog</h1>

      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow transition-opacity duration-500 ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          } ${showToast ? "opacity-100" : "opacity-0"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Formularz dodawania posta */}
      <form onSubmit={addPost} className="mb-6 border p-4 rounded-lg shadow space-y-4">
        <input
          type="text"
          placeholder="Tytuł posta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Treść posta"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={4}
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {submitting ? "Dodawanie..." : "Dodaj post"}
        </button>
      </form>

      {loading ? (
        <p>Ładowanie postów...</p>
      ) : (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p>Brak postów do wyświetlenia.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="border p-4 rounded-lg shadow relative">
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2">{post.content}</p>

                {post.author === token && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Usuń
                  </button>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
}
