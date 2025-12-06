import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CalendarEvent, EVENT_COLORS } from "../types";

const parseEventSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The title of the event" },
    startDate: { type: Type.STRING, description: "ISO 8601 string for start date and time" },
    endDate: { type: Type.STRING, description: "ISO 8601 string for end date and time" },
    description: { type: Type.STRING, description: "Optional description or notes" },
    isAllDay: { type: Type.BOOLEAN, description: "True if the event lasts all day" },
  },
  required: ["title", "startDate", "endDate", "isAllDay"],
};

export const parseNaturalLanguageEvent = async (
  input: string,
  referenceDate: Date
): Promise<Partial<CalendarEvent> | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key not found");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Provide context about "today" so relative dates work (e.g., "next Friday")
    const prompt = `
      Current Reference Date: ${referenceDate.toISOString()} (${referenceDate.toLocaleDateString()}).
      
      User Input: "${input}"
      
      Extract the event details into a JSON object. 
      If no specific duration is mentioned, assume 1 hour.
      If no specific year is mentioned, assume the current or next upcoming occurrence based on the reference date.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: parseEventSchema,
        temperature: 0.1, // Low temperature for deterministic extraction
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    
    // Assign a random color
    const color = EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)];

    return {
      ...parsed,
      id: crypto.randomUUID(),
      color,
    };

  } catch (error) {
    console.error("Error parsing event with Gemini:", error);
    return null;
  }
};
