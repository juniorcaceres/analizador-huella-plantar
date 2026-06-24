import AnalizadorHuella from "@/components/AnalizadorHuella";

// Página principal (ruta "/"). Es un Server Component: arma la estructura
// visual y monta adentro el componente interactivo AnalizadorHuella.
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* --- Encabezado fijo arriba --- */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          {/* Logo: ícono de huellas dentro de un cuadrito teal */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
              <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
              <path d="M16 17h4" />
              <path d="M4 13h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-800">
              Analizador de Huella Plantar
            </h1>
            <p className="text-xs text-slate-500">
              Asistente clínico de clasificación podológica
            </p>
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
