"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);      // zapis tokenów w localStorage
      router.push("/home");   // przekierowanie na Twoją stronę główną
    } catch (err) {
      alert(err.response?.data || "Błąd logowania");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}>
      <h2>Logowanie</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button type="submit" style={{ padding: "0.5rem 1rem" }}>Zaloguj</button>
    </form>
  );
}
