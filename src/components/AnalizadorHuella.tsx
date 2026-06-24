"use client";

// "use client": este componente corre en el NAVEGADOR porque usa interactividad
// (estados, eventos, arrastrar y soltar).

import { useState } from "react";

// La "forma" del resultado que esperamos del servidor (los campos que pediste).
type Resultado = {
  tipo_de_pie: string;
  observaciones: string;
};

// Colores de la etiqueta según el tipo de pie. Si llega algo inesperado,
// usamos el estilo "neutro" por defecto.
const ESTILOS_TIPO: Record<string, string> = {
  plano: "bg-amber-100 text-amber-800 ring-amber-200",
  normal: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  cavo: "bg-sky-100 text-sky-800 ring-sky-200",
  indeterminado: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function AnalizadorHuella() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false); // feedback visual del drag

  // Toma un archivo (venga del input o del "soltar"), valida y prepara la vista previa.
  function cargarArchivo(file: File | null) {
    setResultado(null);
    setError(null);

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG o PNG).");
      return;
    }

    setArchivo(file);
    setPreviewUrl(URL.createObjectURL(file)); // dirección temporal para mostrarla
  }

  function alElegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    cargarArchivo(e.target.files?.[0] ?? null);
  }

  function alSoltar(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setArrastrando(false);
    cargarArchivo(e.dataTransfer.files?.[0] ?? null);
  }

  // Manda la imagen a NUESTRA API del servidor (nunca a Gemini directo).
  async function analizar() {
    if (!archivo) return;

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("imagen", archivo);

      const respuesta = await fetch("/api/analizar", {
        method: "POST",
        body: formData,
      });

      if (!respuesta.ok) {
        const data = await respuesta.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo analizar la imagen.");
      }

      setResultado((await respuesta.json()) as Resultado);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setCargando(false);
    }
  }

  const estiloEtiqueta =
    resultado &&
    (ESTILOS_TIPO[resultado.tipo_de_pie.toLowerCase()] ??
      ESTILOS_TIPO.indeterminado);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* --- Zona para subir / arrastrar la imagen --- */}
      <label
        htmlFor="imagen"
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={alSoltar}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
          arrastrando
            ? "border-teal-500 bg-teal-50"
            : "border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-slate-100"
        }`}
      >
        {/* Ícono de subir */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-3 text-teal-600"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        <span className="text-sm font-medium text-slate-700">
          {archivo
            ? "Cambiar imagen"
            : "Arrastrá la imagen acá o hacé clic para seleccionar"}
        </span>
        <span className="mt-1 text-xs text-slate-400">Formatos JPG o PNG</span>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={alElegirArchivo}
          className="hidden"
        />
      </label>

      {/* --- Vista previa de la imagen elegida --- */}
      {previewUrl && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-slate-600">
            Vista previa
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {/* <img> normal porque es una URL temporal local del navegador */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Vista previa de la huella plantar"
              className="mx-auto max-h-80 w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* --- Botón para analizar --- */}
      <button
        onClick={analizar}
        disabled={!archivo || cargando}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {cargando ? (
          <>
            {/* Spinner girando mientras Gemini procesa */}
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4z"
              />
            </svg>
            Analizando…
          </>
        ) : (
          "Analizar huella"
        )}
      </button>

      {/* --- Mensaje de error (si lo hay) --- */}
      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span aria-hidden="true">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* --- Tarjeta de resultado --- */}
      {resultado && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Resultado del análisis
          </p>

          {/* Tipo de pie destacado como etiqueta de color */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-500">Tipo de pie:</span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold capitalize ring-1 ring-inset ${estiloEtiqueta}`}
            >
              {resultado.tipo_de_pie}
            </span>
          </div>

          {/* Observaciones debajo */}
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-600">Observaciones</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {resultado.observaciones}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
