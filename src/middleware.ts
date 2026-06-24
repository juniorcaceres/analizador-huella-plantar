import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Next.js ejecuta esta función automáticamente antes de cada pedido.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// El "matcher" define en qué rutas corre el middleware.
// Excluimos archivos estáticos e imágenes para no frenarlos de gusto.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
