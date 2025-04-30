# LeetHelper Chrome Extension

LeetHelper is a Chrome extension designed to assist developers in solving LeetCode problems more effectively. It provides features such as **problem explanations**, **solutions in multiple programming languages**, **code dry runs**, and **hints** to help users understand and solve problems efficiently.

---

## Features

### 1. **Explain Question**

- Provides a detailed explanation of the problem, breaking it down into simpler terms.
- Includes key concepts, examples, and intuition to approach the problem.
- **Demo Video**: Watch Here

### 2. **Solution**

- Generates optimized solutions in multiple programming languages (C++, Python, JavaScript, Java, and C).
- Includes syntax-highlighted code and detailed explanations of the solution.
- **Demo Video**: Watch Here

### 3. **Code Dry Run**

- Offers a step-by-step dry run of the code to help users understand how it works.
- Highlights key takeaways such as time complexity, pattern recognition, and edge cases.
- **Demo Video**: Watch Here

### 4. **Hints**

- Provides progressively detailed hints to guide users toward solving the problem.
- Includes general hints, specific hints, and detailed algorithmic insights.
- **Demo Video**: Watch Here

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bPavan16/LeetHelper-chrome.git
   cd LeetHelper-chrome
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Load the extension in Chrome:

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer Mode** (toggle in the top-right corner).
   - Click **Load unpacked** and select the build folder from the project directory.

5. Add your **Gemini API Key**:
   - Open the .env file in the root directory.
   - Add your API key:
     ```properties
     GEMINI_API_KEY = "your-api-key-here"
     ```

---

## Usage

1. Open a LeetCode problem in your browser.
2. Click on the LeetHelper extension icon.
3. Use the tabs to:
   - **Explain Question**: Get a detailed explanation of the problem.
   - **Solution**: Generate solutions in your preferred programming language.
   - **Code Dry Run**: Understand the step-by-step execution of the code.
   - **Hints**: Get hints to guide you toward solving the problem.

---

## Demo Videos

- **LeetHelper Demo**: [Watch Video](./videos/demo(5).mp4)
- **Explain Question**: [Watch Video](./videos/demo(1).mp4)
- **Solution**: ![Watch Video](./videos/demo(2).mp4)
- **Code Dry Run**: ![Watch Video](./videos/demo(3).mp4)
- **Hints**: ![Watch Video](./videos/demo(4).mp4)


---

## Project Structure

```
LeetHelper-chrome/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # React components
│   ├── styles/             # CSS files
│   ├── Gemini/             # API integrations with Gemini
│   ├── App.tsx             # Main application file
│   └── index.tsx           # Entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

---

## Contributing

We welcome contributions to improve LeetHelper! Follow these steps to get started:

### 1. Fork the Repository

- Click the **Fork** button at the top-right corner of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/bPavan16/LeetHelper-chrome.git
cd LeetHelper-chrome
```

### 3. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes

- Add your changes to the codebase.
- Ensure your code follows the project's coding standards.

### 5. Test Your Changes

- Run the project locally:
  ```bash
  npm start
  ```
- Test your changes thoroughly.

### 6. Commit and Push

```bash
git add .
git commit -m "Add your commit message here"
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

- Go to the original repository on GitHub.
- Click **New Pull Request** and select your branch.

---

## API Integration

### Gemini API

LeetHelper uses the **Gemini API** to generate explanations, solutions, dry runs, and hints. Ensure you have a valid API key and add it to the .env file.

### Example API Call

```tsx
const getLeetCodeSolution = async (
  problemName: string,
  programmingLanguage: string
) => {
  const prompt = `Generate a solution for the LeetCode problem "${problemName}" in ${programmingLanguage}.`;
  const result = await geminiAPI.sendMessage(prompt);
  return result.response.text();
};
```

---

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type-safe development.
- **Gemini API**: For generating explanations, solutions, and hints.
- **React Markdown**: For rendering Markdown content.
- **Chrome Extensions API**: For integrating with the browser.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For questions or feedback, feel free to reach out:

- **GitHub**: [bPavan16](https://github.com/bPavan16)

---

## Acknowledgments

- Thanks to the **Gemini API** team for providing an excellent generative AI platform.
- Inspired by the need to make LeetCode problems more accessible and understandable.

---

This README provides a comprehensive guide to using, contributing to, and understanding the LeetHelper Chrome extension.
