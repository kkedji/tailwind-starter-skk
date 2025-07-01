const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

export async function generateSynthesis(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error("❌ VITE_GEMINI_API_KEY manquante. Veuillez la définir dans Netlify.");
    return "Erreur : clé API manquante.";
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }], role: "user" }]
        })
      }
    );

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Erreur : réponse vide";
  } catch (err) {
    return "Erreur : échec de la requête Gemini.";
  }
}