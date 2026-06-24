"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import MarcaIcono from "@/components/MarcaIcono";

// Pantalla de REGISTRO (ruta "/registro").
export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revisarEmail, setRevisarEmail] = useState(false);

  async function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setCargando(false);
      return;
    }

    // Si Supabase ya creó una sesión, el usuario quedó logueado: vamos al inicio.
    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    // Si no hay sesión, Supabase pide confirmar el email primero.
    setRevisarEmail(true);
    setCargando(false);
  }

  // Vista de "revisá tu email" (cuando la confirmación está activada).
  if (revisarEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <MarcaIcono className="mx-auto h-12 w-12" />
          <h1 className="mt-4 text-lg font-bold text-slate-800">
            ¡Revisá tu email!
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Te enviamos un enlace de confirmación a{" "}
            <span className="font-medium text-slate-800">{email}</span>.
            Confirmá tu cuenta y después iniciá sesión.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <MarcaIcono className="h-12 w-12" />
          <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-800">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Registrate para usar el analizador
          </p>
        </div>

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
              placeholder="Mínimo 6 caracteres"
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
            {cargando ? "Creando cuenta…" : "Registrarme"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal-700 hover:text-teal-800"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
