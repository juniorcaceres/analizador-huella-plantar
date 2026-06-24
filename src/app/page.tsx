import AnalizadorHuella from "@/components/AnalizadorHuella";
import CerrarSesion from "@/components/CerrarSesion";
import MarcaIcono from "@/components/MarcaIcono";
import { createClient } from "@/utils/supabase/server";

// Página principal (ruta "/"). Está protegida por el middleware: si no hay
// sesión, el usuario es redirigido a /login antes de llegar acá.
export default async function Home() {
  // Obtenemos el usuario logueado desde el servidor (para mostrar su email).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* --- Encabezado fijo arriba --- */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-4">
          {/* Izquierda: logo + nombre */}
          <div className="flex items-center gap-3">
            <MarcaIcono />
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-800">
                Analizador de Huella Plantar
              </h1>
              <p className="text-xs text-slate-500">
                Asistente clínico de clasificación podológica
              </p>
            </div>
          </div>

          {/* Derecha: email del profesional + cerrar sesión */}
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden text-xs text-slate-500 sm:inline">
                {user.email}
              </span>
            )}
            <CerrarSesion />
          </div>
        </div>
      </header>

      {/* --- Contenido principal --- */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:py-14">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Clasificá el tipo de pie en segundos
          </h2>
          <p className="mt-2 max-w-xl text-slate-600">
            Subí una imagen de la huella tomada con podoscopio y obtené una
            clasificación (plano, normal o cavo) junto con un breve informe en
            lenguaje clínico.
          </p>
        </div>

        <AnalizadorHuella />
      </main>

      {/* --- Pie de página --- */}
      <footer className="border-t border-slate-200 py-6">
        <p className="mx-auto max-w-3xl px-6 text-center text-xs text-slate-400">
          Herramienta de apoyo diagnóstico. No reemplaza el criterio
          profesional.
        </p>
      </footer>
    </div>
  );
}
