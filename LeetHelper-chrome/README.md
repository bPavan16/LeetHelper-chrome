# 🚀 LeetHelper - Your AI-Powered LeetCode Companion

> **Transform your LeetCode journey with AI-powered insights, explanations, and solutions!**

LeetHelper is a modern Chrome extension that supercharges your LeetCode practice with intelligent AI assistance. Whether you're a beginner learning algorithms or a seasoned coder preparing for technical interviews, LeetHelper provides instant explanations, optimized solutions, progressive hints, and detailed code analysis right in your browser.

## ✨ Features That Make You Code Better

### 🧠 **Question Explanations**
- **Instant Understanding**: Get clear, detailed explanations of any LeetCode problem
- **Pattern Recognition**: Learn to identify common algorithmic patterns
- **Complexity Analysis**: Understand time and space complexity requirements
- **Visual Breakdowns**: Complex problems made simple with step-by-step explanations

### 💡 **Smart Solution Generation**
- **Multi-Language Support**: Solutions in Python, JavaScript, Java, C++, and more
- **Multiple Approaches**: From brute force to optimized solutions
- **Best Practices**: Clean, readable code following industry standards
- **Performance Optimized**: Solutions focused on efficiency and clarity

### 🔍 **Interactive Code Analysis**
- **Bug Detection**: Identify potential issues in your code
- **Optimization Suggestions**: Improve performance and readability
- **Code Quality**: Get feedback on coding style and best practices
- **Real-time Feedback**: Analyze your solution as you write it

### 🎯 **Progressive Hints System**
- **Guided Learning**: Step-by-step hints that don't spoil the solution
- **Conceptual Clues**: Understand the approach without seeing the code
- **Difficulty Adaptive**: Hints tailored to your understanding level
- **Learning Focused**: Designed to enhance your problem-solving skills

### 🔄 **Code Dry Run**
- **Step-by-Step Execution**: Trace through your code with sample inputs
- **Variable Tracking**: See how variables change throughout execution
- **Logic Validation**: Understand why your code works (or doesn't)
- **Test Case Analysis**: Detailed walkthrough of edge cases

### 🎨 **Beautiful Modern UI**
- **Tailwind CSS Powered**: Clean, responsive, and intuitive design
- **Dark/Light Theme**: Comfortable coding in any lighting
- **Mobile Friendly**: Works perfectly on all screen sizes
- **Accessibility First**: Built with accessibility best practices

## 🛠️ Installation

### Option 1: Install from Chrome Web Store (Recommended)
*Coming soon! This extension will be available on the Chrome Web Store.*

### Option 2: Install from Source
1. **Clone the repository**
   ```bash
   git clone https://github.com/bPavan16/leethelper-chrome.git
   cd leethelper-chrome
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `build` folder
   - The LeetHelper icon should appear in your Chrome toolbar!

## 🔑 Setup Your AI Assistant

### Get Your Gemini API Key
1. **Visit Google AI Studio**: Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Create API Key**: Click "Create API Key" and follow the prompts
3. **Copy Your Key**: Save your API key securely

### Configure LeetHelper
1. **Click the LeetHelper icon** in your Chrome toolbar
2. **Enter your API key** in the secure input field
3. **Start coding smarter!** All features are now unlocked

> 🔒 **Privacy First**: Your API key is stored locally on your device and never shared with anyone.

## 🎮 How to Use

### 1. **Open Any LeetCode Problem**
- Navigate to any problem on LeetCode
- Click the LeetHelper extension icon
- The problem name will automatically be detected

### 2. **Choose Your AI Assistant**
- **📖 Explain Question**: Understand the problem deeply
- **✅ Solution**: Get optimized code solutions
- **🔍 Code Analysis**: Improve your existing code
- **💡 Hints**: Get progressive guidance
- **🔄 Code Dry Run**: Trace through algorithm execution

### 3. **Learn and Improve**
- Read explanations to understand patterns
- Study generated solutions for best practices
- Use hints to develop problem-solving skills
- Analyze your code for continuous improvement

## 🌟 Why LeetHelper?

### **🎯 Focused Learning**
Unlike generic AI assistants, LeetHelper is specifically designed for algorithmic problem-solving. Every feature is crafted to enhance your coding interview preparation and competitive programming skills.

### **� Performance Optimized**
- **Smart Caching**: Responses are cached locally to reduce API calls
- **Instant Loading**: Previously viewed explanations load instantly
- **Efficient Design**: Modern React architecture for smooth performance

### **🔒 Privacy & Security**
- **Local Storage**: All data stays on your device
- **No Account Required**: Start using immediately
- **Secure API Handling**: Your API key is encrypted and stored locally

### **📱 Always Available**
- **Offline Cache**: Previously loaded content works offline
- **Cross-Platform**: Works on any device with Chrome
- **Sync Ready**: Your settings sync across Chrome installations

## 🔧 Development

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI Integration**: Google Gemini API
- **Icons**: React Icons

### Project Structure
```
src/
├── Components/          # React components
│   ├── Home.tsx         # Main dashboard
│   ├── ExplainQuestion.tsx
│   ├── Solution.tsx
│   ├── CodeAnalysis.tsx
│   ├── Hints.tsx
│   └── DryRunComponent.tsx
├── Gemini/             # AI integration modules
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── styles/             # CSS and styling
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## 📈 Roadmap

### **🎯 Coming Soon**
- [ ] **Code Explanation**: Understand existing solutions line by line
- [ ] **Interview Mode**: Practice with timed challenges
- [ ] **Progress Tracking**: Track your improvement over time
- [ ] **Company-Specific Prep**: Targeted practice for FAANG companies
- [ ] **Team Collaboration**: Share insights with study groups

### **🔮 Future Features**
- [ ] **Visual Algorithm Animator**: See algorithms in action
- [ ] **Custom Problem Sets**: Create and share problem collections
- [ ] **Performance Analytics**: Detailed coding performance metrics
- [ ] **Integration with IDEs**: VS Code and other editor extensions

## 🤝 Contributing

We love contributions! Here's how you can help make LeetHelper better:

### **🐛 Found a Bug?**
1. Check if it's already reported in [Issues](https://github.com/bPavan16/leethelper-chrome/issues)
2. Create a detailed bug report with steps to reproduce
3. Include screenshots if applicable

### **💡 Have an Idea?**
1. Open a feature request in [Issues](https://github.com/bPavan16/leethelper-chrome/issues)
2. Describe the problem and proposed solution
3. We'll discuss and prioritize together

### **🔧 Want to Code?**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI**: For providing the powerful AI capabilities
- **LeetCode**: For creating the platform that makes us better developers
- **React Community**: For the amazing ecosystem and tools
- **Tailwind CSS**: For making beautiful UIs effortless
- **All Contributors**: Thank you for making LeetHelper better!

## 📞 Support

### **Need Help?**
- 📧 **Email**: support@leethelper.com
- 💬 **Discord**: [Join our community](https://discord.gg/leethelper)
- 🐛 **Issues**: [GitHub Issues](https://github.com/bPavan16/leethelper-chrome/issues)
- 📖 **Documentation**: [Full Documentation](https://docs.leethelper.com)

### **Stay Updated**
- ⭐ **Star this repo** to show your support
- 🔔 **Watch releases** for updates
- 🐦 **Follow us** on social media for tips and updates

---

<div align="center">

### 💝 Made with ❤️ for the Developer Community

**Happy Coding! 🚀**

[![GitHub stars](https://img.shields.io/github/stars/bPavan16/leethelper-chrome?style=social)](https://github.com/bPavan16/leethelper-chrome)
[![GitHub forks](https://img.shields.io/github/forks/bPavan16/leethelper-chrome?style=social)](https://github.com/bPavan16/leethelper-chrome)
[![GitHub watchers](https://img.shields.io/github/watchers/bPavan16/leethelper-chrome?style=social)](https://github.com/bPavan16/leethelper-chrome)

</div>

---

*LeetHelper - Transform your coding journey, one problem at a time! 🎯*