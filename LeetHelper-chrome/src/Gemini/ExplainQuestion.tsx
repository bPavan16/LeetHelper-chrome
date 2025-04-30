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
 * Gets a detailed explanation of a LeetCode problem
 * 
 * @param {string} problemName - The name of the LeetCode problem
 * @returns {Promise<string>} - The detailed explanation text in Markdown format
 */
async function getLeetCodeExplanation(problemName: string) {
    const chatSession = model.startChat({
        generationConfig,
    });

    const prompt = `
Provide a detailed explanation of the LeetCode problem "${problemName}".

Format your entire response in Markdown with these sections:

## Problem Breakdown
Break down the problem into simple terms. Explain what the problem is asking for in plain language.

## Key Concepts
Explain the fundamental concepts and data structures needed to understand this problem.

## Examples Explained
Take the examples from the problem statement and walk through them step by step.

## Intuition Development
Explain how someone should think about approaching this problem, starting with naive solutions.

## Common Patterns & Techniques
Identify what algorithmic patterns this problem relates to (e.g., two pointers, sliding window, etc.).

## Edge Cases to Consider
List potential edge cases that need special consideration.

## Learning Value
Explain what this problem teaches and where these skills can be applied in real-world scenarios.

Write in an educational, clear style that helps someone truly understand the problem before they attempt to solve it.
`;

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
}

export { getLeetCodeExplanation };