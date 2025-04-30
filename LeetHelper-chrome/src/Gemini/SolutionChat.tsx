import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "" 
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

/**
 * Gets a detailed solution for a LeetCode problem in the specified programming language
 * 
 * @param {string} problemName - The name of the LeetCode problem
 * @param {string} programmingLanguage - The programming language for the solution
 * @returns {Promise<string>} - The detailed solution text
 */

async function getLeetCodeSolution(problemName: string, programmingLanguage: string) {
    const chatSession = model.startChat({
        generationConfig,
    });

    const prompt = `Given LeetCode Question "${problemName}" for this question give me detailed solution in the programming language "${programmingLanguage}" and explain me every bit of code and also explain where I can use this pattern again.`;

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
}

// Example usage


// Export the function for use in other files
export { getLeetCodeSolution };

// Uncomment to run the example
// run();