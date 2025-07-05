import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from "../utils/apiKey";

const getApiKey = (): string => {
  return getGeminiApiKey() || process.env.GEMINI_API_KEY || "";
};

const createModel = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please configure it in the settings.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
};

const generationConfig = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 1024,
    responseMimeType: "text/plain",
};

/**
 * Fetches hints for a LeetCode problem
 * 
 * @param {string} problemName - The name of the LeetCode problem
 * @returns {Promise<string>} - The hints in Markdown format
 */
async function getLeetCodeHints(problemName: string): Promise<string> {
    const model = createModel();
    const chatSession = model.startChat({
        generationConfig,
    });

    const prompt = `
Provide helpful hints for solving the LeetCode problem "${problemName}".

Format your response in Markdown with these sections:

## Hint 1
Provide a general hint to guide the user toward the solution.

## Hint 2
Offer a more specific hint that narrows down the approach.

## Hint 3
Provide a detailed hint that explains the key concept or algorithm needed.

Make sure the hints are clear, concise, and progressively more detailed.
`;

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
}

export { getLeetCodeHints };