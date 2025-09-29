"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/discussions/")
      .then((res) => res.json())
      .then((data) => setDiscussions(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sekcja hero podobna do strony głównej */}
      <div className="relative bg-cover bg-center h-64 flex items-center justify-center"
           style={{ backgroundImage: "url('/cars-background.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="relative text-4xl md:text-5xl font-bold text-yellow-400">
          Forum Dyskusyjne
        </h1>
      </div>

      {/* Lista dyskusji */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Najnowsze dyskusje</h2>
          <Link href="/discussions/new">
            <button className="bg-green-500 text-white px-5 py-2 rounded-full shadow hover:bg-green-600 transition">
              + Dodaj dyskusję
            </button>
          </Link>
        </div>

        {discussions.length === 0 ? (
          <p className="text-gray-600">Brak dyskusji. Bądź pierwszy!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {discussions.map((d) => (
              <Link key={d.id} href={`/discussions/${d.id}`}>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{d.title}</h3>
                  <p className="text-gray-700 line-clamp-3">{d.content}</p>
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <span>Autor: {d.author}</span>
                    <span>{new Date(d.created).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
