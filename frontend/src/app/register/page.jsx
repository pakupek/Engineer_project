"use client";

import { useState } from "react";
import { register } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Rejestracja udana!");
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <input type="password" placeholder="Confirm Password" onChange={(e) => setForm({ ...form, password2: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
}
