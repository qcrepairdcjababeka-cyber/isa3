
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateHandoverSummary = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional, concise summary for an inventory handover report. 
      Sender: ${data.senderName}
      Receiver: ${data.receiverName}
      From SLOC: ${data.fromSloc}
      To SLOC: ${data.toSloc}
      Items: ${JSON.stringify(data.items)}
      Context: Handover for official assignment between storage locations.
      Please write it in a professional Indonesian formal tone.`,
    });
    return response.text || "Summary generated successfully.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal menghasilkan ringkasan otomatis.";
  }
};

export const getInventoryInsights = async (inventory: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this inventory data and provide 3 brief strategic insights or warnings. 
      Data: ${JSON.stringify(inventory)}
      Identify low stock or imbalances between SLOC 1000 (Main) and 1001 (Secondary).
      Language: Indonesian.`,
    });
    return response.text || "Analisis selesai.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal menganalisis inventory.";
  }
};
