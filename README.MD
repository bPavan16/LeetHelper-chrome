# LeetHelper - LeetCode Assistant Chrome Extension

LeetHelper is a powerful Chrome extension designed to enhance your LeetCode problem-solving experience. It provides AI-powered solutions, detailed explanations, step-by-step dry runs, and helpful hints for LeetCode problems.



## 🚀 Features

LeetHelper offers four main assistance features for LeetCode problems:

- **Explain Question:** Get clear explanations of problem statements and requirements
- **Solutions:** Generate optimized code solutions in multiple programming languages
- **Code Dry Run:** Visualize how algorithms work with step-by-step execution examples  
- **Hints:** Receive strategic hints without full solutions when you want to solve it yourself

## 📋 Installation

### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "LeetHelper"
3. Click "Add to Chrome"

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/LeetHelper-chrome.git
   ```

2. Install dependencies:
   ```bash
   cd LeetHelper-chrome
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory

## 💡 How to Use

1. **Navigate to a LeetCode problem** on [leetcode.com](https://leetcode.com)
2. **Click the LeetHelper icon** in your browser extensions toolbar
3. **Choose an assistance option:**
   - **Explain Question:** Get a clear breakdown of the problem
   - **Solution:** Generate optimized code in your preferred language
   - **Code Dry Run:** See step-by-step execution with examples
   - **Hints:** Receive guidance without full solutions

## 🛠️ Technologies Used

- **Frontend:** React, TypeScript
- **AI Integration:** Google's Gemini AI API
- **Code Highlighting:** react-syntax-highlighter
- **Markdown Rendering:** react-markdown
- **Icons:** react-icons
- **Building:** Vite, Chrome Extension Manifest V3

## 📁 Project Structure

```
LeetHelper-chrome/
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.css              # Main application styles
│   ├── Gemini/              # AI API integration
│   │   ├── SolutionChat.tsx # Solution generation logic
│   │   └── DryRun.tsx       # Dry run generation logic
│   ├── styles/              # Component-specific styles
│   │   ├── Solution.css     # Styles for Solution component
│   │   └── DryRun.css       # Styles for DryRun component
│   └── components/          # Reusable components
├── public/                  # Static assets
├── manifest.json            # Chrome extension manifest
└── package.json             # Project dependencies
```

## ⚙️ Configuration

To use your own API key for the Gemini AI:

1. Open SolutionChat.tsx and DryRun.tsx
2. Replace the API key with your own:
   ```typescript
   const apiKey = "YOUR_GEMINI_API_KEY";
   ```
   
Alternatively, store your API key in an environment variable and use:
```typescript
const apiKey = process.env.GEMINI_API_KEY;
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔒 Privacy

LeetHelper sends problem names to Google's Gemini AI API to generate solutions and explanations. No personal data or code you write in LeetCode is transmitted.

## 🙏 Acknowledgements

- [Google Generative AI](https://ai.google.dev/) for powering the AI features
- [React](https://reactjs.org/) for the UI framework
- [LeetCode](https://leetcode.com/) for the amazing platform

---

Made with ❤️ for the LeetCode community