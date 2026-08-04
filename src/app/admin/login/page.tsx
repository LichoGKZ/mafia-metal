"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#1a1916", color: "#b0aa98" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8"
        style={{ border: "1px solid rgba(212,175,55,0.15)" }}
      >
        <h1
          className="font-victor text-sm tracking-[0.35em] uppercase mb-8 text-center"
          style={{ color: "#d4af37" }}
        >
          panel · mafia metal
        </h1>

        <div className="mb-5">
          <label className="font-victor text-[9px] tracking-[0.3em] uppercase block mb-2" style={{ color: "rgba(176,170,152,0.4)" }}>
            email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={{ borderBottom: "1px solid rgba(176,170,152,0.15)", color: "#b0aa98" }}
          />
        </div>

        <div className="mb-8">
          <label className="font-victor text-[9px] tracking-[0.3em] uppercase block mb-2" style={{ color: "rgba(176,170,152,0.4)" }}>
            contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={{ borderBottom: "1px solid rgba(176,170,152,0.15)", color: "#b0aa98" }}
          />
        </div>

        {error && (
          <p className="font-victor text-xs mb-6" style={{ color: "#c0392b" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-victor text-xs tracking-[0.35em] disabled:opacity-50"
          style={{ background: "#d4af37", color: "#0a0908" }}
        >
          {loading ? "ingresando..." : "ingresar"}
        </button>
      </form>
    </main>
  );
}
