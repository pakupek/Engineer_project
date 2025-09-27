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
      const res = await fetch(
        `http://localhost:8000/api/posts/${id}/delete/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert("Nie udało się usunąć posta");
      }
    } catch (err) {
      console.error("Błąd usuwania posta", err);
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

  
if (loading) return <p>Ładowanie...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Mój Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="border p-4 rounded-lg shadow relative"
          >
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 text-sm">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <p className="mt-2">{post.content}</p>

            
            {user && Number(post.author) === user.id && (
              <button
                onClick={() => deletePost(post.id)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Usuń
              </button>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
