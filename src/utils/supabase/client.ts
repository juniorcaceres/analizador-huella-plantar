import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para usar en el NAVEGADOR (componentes "use client").
// Sirve para registrarse, iniciar y cerrar sesión desde los formularios.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
