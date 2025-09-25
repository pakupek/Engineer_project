"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- zmiana

export default function AddPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter(); // teraz działa w App Router

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8000/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    router.push("/"); // przekierowanie po dodaniu posta
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dodaj nowy post</h1>
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Dodaj post
        </button>
      </form>
    </main>
  );
}
