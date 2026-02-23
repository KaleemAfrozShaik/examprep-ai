const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

export const generateGeminiResponse = async (prompt) => {
  try {
    const response = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const data = await response.json();

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    // Attempt to extract JSON logic
    let cleanText = text.trim();
    
    // Use regex to extract content within first { and last }
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    try {
      return JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON Parse Error. Content:", cleanText);
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (error) {
    console.error("Gemini Fetch Error:", error.message);
    throw new Error(error.message || "Gemini API fetch failed");
  }
};
