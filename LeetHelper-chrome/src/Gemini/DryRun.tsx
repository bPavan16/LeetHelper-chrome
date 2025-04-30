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

async function getLeetCodeDryRun(problemName: string) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    { text: "Given LeetCode Question \"three-sum\" for this question give me a detailed dry run with a random example and explain me how it works and suggest me some intution how can work this out do not give me any code just explain me the logic" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "Let's dry-run the Three Sum problem with the example array `nums = [-1, 0, 1, 2, -1, -4]`.  Our goal is to find all unique triplets that sum to zero.\n\n**Logic and Intuition:**\n\nThe core idea is to avoid brute-force checking of all possible combinations (which would be O(n^3)). We can optimize using sorting and two pointers.\n\n1. **Sorting:** First, sort the array. This allows us to efficiently skip duplicate values and apply the two-pointer approach.  Our sorted array becomes `[-4, -1, -1, 0, 1, 2]`.\n\n2. **Outer Loop (Fixing one number):** Iterate through the sorted array from left to right, fixing one number at a time. Let's call this number `a`.\n\n3. **Inner Loop (Two Pointers):** For each `a`, use two pointers, `left` and `right`.  `left` starts immediately after `a`, and `right` starts at the end of the array.  We're looking for two numbers `b` (at the `left` pointer) and `c` (at the `right` pointer) such that `a + b + c = 0`.\n\n4. **Checking and Moving Pointers:**\n    * If `a + b + c == 0`: We found a triplet! Add it to our result set.  To avoid duplicates, skip any subsequent occurrences of the same values of `b` and `c` by incrementing `left` and decrementing `right` until they point to different values.\n    * If `a + b + c < 0`: The sum is too small. We need a larger number. Increment the `left` pointer to consider the next larger value for `b`.\n    * If `a + b + c > 0`: The sum is too large. We need a smaller number. Decrement the `right` pointer to consider the next smaller value for `c`.\n\n5. **Skipping Duplicates in the Outer Loop:** After processing a value `a`, skip any subsequent occurrences of the same value to avoid generating duplicate triplets.\n\n**Dry Run with `nums = [-4, -1, -1, 0, 1, 2]`: **\n\n1. **a = -4:**\n   * `left = -1`, `right = 2`.  `-4 + (-1) + 2 = -3 < 0`. Increment `left`.\n   * `left = -1`, `right = 2`.  `-4 + (-1) + 2 = -3 < 0`. Increment `left`.\n   * `left = 0`, `right = 2`.  `-4 + 0 + 2 = -2 < 0`. Increment `left`.\n   * `left = 1`, `right = 2`.  `-4 + 1 + 2 = -1 < 0`. Increment `left`.\n   * `left` and `right` have crossed, so we move on to the next `a`.\n\n2. **a = -1:**\n   * `left = -1`, `right = 2`.  `-1 + (-1) + 2 = 0`. Found a triplet! Add `[-1, -1, 2]` to the result. Skip the duplicate `-1` by incrementing `left`.\n   * `left = 0`, `right = 1`.  `-1 + 0 + 1 = 0`. Found a triplet! Add `[-1, 0, 1]` to the result.\n\n3. **a = -1 (duplicate):** Skip this `-1` since we've already processed it.\n\n4. **a = 0:**\n   * `left = 1`, `right = 2`.  `0 + 1 + 2 = 3 > 0`. Decrement `right`.\n   * `left = 1`, `right = 1`. `left` and `right` have crossed, so we move on.\n\n5. **a = 1:**  At this point, since the array is sorted and the remaining elements are positive, it's impossible to find two other numbers that will sum to zero with `a`.  We can stop here.\n\n\n**Result:** `[[-1, -1, 2], [-1, 0, 1]]`\n\n\n**Key Intuition:**  Sorting allows us to use the two-pointer technique.  The two pointers effectively narrow down the search space for `b` and `c` for every `a` we consider. This brings the time complexity down from O(n^3) to O(n^2) (dominated by the nested loops).  Sorting takes O(n log n), but this is less significant compared to the quadratic term.\n" },
                ],
            },
        ],
    });

    const prompt = `Given LeetCode Question "${problemName}" for this question give me a detailed dry run with a random example and explain me how it works and suggest me some intution how can work this out do not give me any code just explain me the logic `;

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
}



export { getLeetCodeDryRun };
