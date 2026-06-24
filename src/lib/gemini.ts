import { GoogleGenAI } from "@google/genai";

// El modelo de visión de Google que vamos a usar.
const MODELO = "gemini-2.5-flash";

// Creamos el cliente leyendo la API key desde las variables de entorno
// (process.env). La clave NUNCA aparece escrita en el código.
function obtenerCliente() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta la variable de entorno GEMINI_API_KEY. Revisá tu archivo .env.local."
    );
  }
  return new GoogleGenAI({ apiKey });
}

// El "prompt" es la instrucción que le damos a la IA. Le pedimos que clasifique
// el tipo de pie y que responda SIEMPRE con un JSON con la forma que necesitamos.
const PROMPT = `Sos un asistente clínico especializado en podología.
Analizá la imagen de una huella plantar tomada con un podoscopio y clasificá el tipo de pie.

Respondé ÚNICAMENTE con un objeto JSON válido, sin texto adicional, con esta forma exacta:
{
  "tipo_de_pie": "plano | normal | cavo",
  "observaciones": "Un breve informe en lenguaje clínico (2 a 4 oraciones) que justifique la clasificación."
}

Si la imagen no parece ser una huella plantar, usá "tipo_de_pie": "indeterminado" y explicá el motivo en las observaciones.`;

// La "forma" del resultado que esperamos. Coincide con los campos que pediste.
export type ResultadoAnalisis = {
  tipo_de_pie: string;
  observaciones: string;
};

// Recibe la imagen (en base64 + su tipo) y devuelve la clasificación.
export async function analizarHuella(
  imagenBase64: string,
  mimeType: string
): Promise<ResultadoAnalisis> {
  const ai = obtenerCliente();

  const respuesta = await ai.models.generateContent({
    model: MODELO,
    contents: [
      {
        role: "user",
        parts: [
          { text: PROMPT },
          // Así se manda una imagen a Gemini: su tipo (jpg/png) y los datos en base64.
          { inlineData: { mimeType, data: imagenBase64 } },
        ],
      },
    ],
    config: {
      // Le pedimos a Gemini que su respuesta sea JSON puro (sin texto alrededor).
      responseMimeType: "application/json",
    },
  });

  const texto = respuesta.text;
  if (!texto) {
    throw new Error("Gemini no devolvió ninguna respuesta.");
  }

  // Convertimos el texto JSON que devolvió Gemini en un objeto de JavaScript.
  return JSON.parse(texto) as ResultadoAnalisis;
}
