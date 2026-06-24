"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// Botón para cerrar la sesión del usuario y volver al login.
export default function CerrarSesion() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  async function salir() {
    setCargando(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={salir}
      disabled={cargando}
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
    >
      {cargando ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
