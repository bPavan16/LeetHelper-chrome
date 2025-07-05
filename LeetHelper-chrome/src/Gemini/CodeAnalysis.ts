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
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

/**
 * Analyzes code for mistakes and provides suggestions
 * 
 * @param {string} problemName - The name of the LeetCode problem
 * @param {string} code - The user's code to analyze
 * @param {string} language - Programming language of the code
 * @returns {Promise<string>} - Analysis of mistakes and suggestions
 */

export async function analyzeLeetCodeMistakes(problemName: string, code: string, language: string): Promise<string> {
    const model = createModel();
    const chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    { text: "Given a LeetCode problem 'two-sum' and the following Python code:\n\n```python\ndef twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []\n```\n\nAnalyze this code for potential issues, bugs, edge cases, and optimizations. Provide specific suggestions for improvement." },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "## Code Analysis for Two Sum Problem\n\n### Current Code Analysis:\n\n**The Good:**\n- ✅ Correct basic logic for finding two numbers that sum to target\n- ✅ Proper nested loop structure\n- ✅ Correct indexing to avoid using same element twice\n- ✅ Returns the correct format [index1, index2]\n\n**Issues & Improvements:**\n\n### 1. **Edge Case Handling**\n- ❌ **Missing input validation**: What if `nums` is empty or has less than 2 elements?\n- ❌ **No solution case**: Returns empty array instead of handling properly\n\n### 2. **Time Complexity Issues**\n- ❌ **O(n²) time complexity**: Current brute force approach is inefficient\n- ❌ **Inefficient for large inputs**: Will timeout on LeetCode for large test cases\n\n### 3. **Space Complexity**\n- ✅ **O(1) space**: Good space efficiency with current approach\n\n### 4. **Optimization Opportunities**\n\n**Recommended Approach - Hash Map Solution:**\n```python\ndef twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []  # No solution found\n```\n\n**Benefits:**\n- ⚡ **O(n) time complexity** - Single pass through array\n- 📦 **O(n) space complexity** - Trade-off for better time\n- 🎯 **More efficient** - Handles large inputs without timeout\n\n### 5. **Code Quality Improvements**\n\n**Add Input Validation:**\n```python\ndef twoSum(nums, target):\n    if not nums or len(nums) < 2:\n        return []\n    # ... rest of logic\n```\n\n**Add Type Hints:**\n```python\nfrom typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    # ... implementation\n```\n\n### 6. **Edge Cases to Consider**\n- Empty array: `nums = []`\n- Single element: `nums = [1]`\n- No valid solution exists\n- Duplicate numbers: `nums = [3, 3], target = 6`\n- Negative numbers: `nums = [-1, -2, -3], target = -5`\n\n### 7. **Alternative Approaches**\n\n**Two-Pointer Approach (if sorting allowed):**\n- Sort array with original indices\n- Use two pointers from start and end\n- Time: O(n log n), Space: O(n)\n\n**Verdict:** Your current solution is correct but not optimal. The hash map approach is the preferred solution for LeetCode submissions due to its O(n) time complexity." },
                ],
            },
        ],
    });

    const prompt = `Given the LeetCode problem "${problemName}" and the following ${language} code:\n\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\`\n\nAnalyze this code for potential issues, bugs, edge cases, and optimizations. Provide specific suggestions for improvement, including:\n1. Correctness issues\n2. Edge cases not handled\n3. Time/Space complexity analysis\n4. Optimization opportunities\n5. Code quality improvements\n6. Alternative approaches if applicable\n\nBe specific and provide examples where relevant.`;

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
}
