import { NextResponse } from "next/server";
import { analizarHuella } from "@/lib/gemini";

// Esta función se ejecuta SOLO en el servidor cuando llega un POST a /api/analizar.
// Al correr en el servidor, la API key queda protegida y nunca llega al navegador.
export async function POST(request: Request) {
  try {
    // Leemos el formulario que mandó el navegador (con la imagen adentro).
    const formData = await request.formData();
    const imagen = formData.get("imagen");

    // Validamos que realmente haya llegado un archivo de imagen.
    if (!imagen || !(imagen instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen." },
        { status: 400 } // 400 = pedido incorrecto del cliente
      );
    }

    // Convertimos la imagen a base64 (texto), que es el formato que espera Gemini.
    const bytes = await imagen.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Llamamos a nuestra función que se comunica con Gemini.
    const resultado = await analizarHuella(base64, imagen.type);

    // Devolvemos el resultado al navegador como JSON.
    return NextResponse.json(resultado);
  } catch (error) {
    // Si algo falla, lo registramos en la consola del servidor (para depurar)
    // y devolvemos un mensaje genérico al navegador.
    console.error("Error en /api/analizar:", error);
    return NextResponse.json(
      { error: "No se pudo analizar la imagen. Intentá de nuevo." },
      { status: 500 } // 500 = error del servidor
    );
  }
}
