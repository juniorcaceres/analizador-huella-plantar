"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import MarcaIcono from "@/components/MarcaIcono";

// Pantalla de INICIO DE SESIÓN (ruta "/login").
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email o contraseña incorrectos.");
      setCargando(false);
      return;
    }

    // Sesión iniciada: vamos al analizador y refrescamos para que el
    // servidor reconozca al usuario.
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Encabezado con logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <MarcaIcono className="h-12 w-12" />
          <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-800">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Accedé al Analizador de Huella Plantar
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={alEnviar}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
              placeholder="profesional@correo.com"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-slate-700">
            Contraseña
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="mt-6 w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿No tenés cuenta?{" "}
          <Link
            href="/registro"
            className="font-semibold text-teal-700 hover:text-teal-800"
          >
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
