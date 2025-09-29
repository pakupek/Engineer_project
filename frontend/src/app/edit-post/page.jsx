"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function EditPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchPost() {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/`);
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
    }

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:8000/api/blog/posts/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Tytuł"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <textarea
        placeholder="Treść posta"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded p-2 h-40"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Zapisz zmiany
      </button>
    </form>
  );
}

export default function EditPostPage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edytuj post</h1>
      <Suspense fallback={<p>Ładowanie...</p>}>
        <EditPostForm />
      </Suspense>
    </main>
  );
}
