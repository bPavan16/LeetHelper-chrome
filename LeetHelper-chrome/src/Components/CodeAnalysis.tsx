import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft, FiPlay, FiCode, FiCopy, FiAlertTriangle } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { analyzeLeetCodeMistakes } from '../Gemini/CodeAnalysis';
import { ComponentProps } from '../types';
import { storageUtils } from '../utils/storage';
import '../styles/CodeAnalysis.css';

const CodeAnalysis: React.FC<ComponentProps> = ({ questionName, onBack }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScrapingCode, setIsScrapingCode] = useState(false);

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'C'];

  // Load cached data on component mount
  useEffect(() => {
    const cachedData = storageUtils.getCachedData(questionName);
    if (cachedData?.mistakes) {
      setAnalysis(cachedData.mistakes);
    }
  }, [questionName]);

  const scrapeCodeFromEditor = useCallback(async () => {
    setIsScrapingCode(true);
    try {
      // Try to scrape code from LeetCode editor
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getCode' }, (response) => {
              if (response?.code) {
                setCode(response.code);
                setLanguage(response.language || 'JavaScript');
              } else {
                setError('Could not scrape code from editor. Please paste your code manually.');
              }
            });
          }
        });
      }
    } catch (err) {
      setError('Failed to scrape code from editor. Please paste your code manually.');
      console.error(err);
    } finally {
      setIsScrapingCode(false);
    }
  }, []);

  const analyzeCode = useCallback(async () => {
    if (!code.trim() || !questionName) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await analyzeLeetCodeMistakes(questionName, code, language);
      setAnalysis(result);
      
      // Cache the result
      storageUtils.setCachedData(questionName, 'mistakes', result);
    } catch (err) {
      setError('Failed to analyze code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [questionName, code, language]);

  const copyAnalysisToClipboard = () => {
    navigator.clipboard.writeText(analysis)
      .then(() => {
        const copyBtn = document.getElementById('analysis-copy-btn');
        if (copyBtn) {
          const originalContent = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span>✓ Copied</span>';
          setTimeout(() => {
            copyBtn.innerHTML = originalContent;
          }, 2000);
        }
      })
      .catch(err => console.error('Failed to copy analysis:', err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="btn-secondary flex items-center gap-2"
            onClick={onBack}
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {questionName} - Code Analysis
          </h1>
          <div></div> {/* Spacer for centering */}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Language Selector */}
            <div className="flex items-center gap-3">
              <label htmlFor="language-select" className="font-medium text-gray-700">
                Language:
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field min-w-[140px]"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                className={`btn-primary flex items-center gap-2 ${isScrapingCode ? 'opacity-75' : ''}`}
                onClick={scrapeCodeFromEditor}
                disabled={isScrapingCode}
                title="Scrape code from LeetCode editor"
              >
                {isScrapingCode ? (
                  <>
                    <div className="loading-spinner"></div>
                    Scraping...
                  </>
                ) : (
                  <>
                    <FiCode size={16} />
                    Scrape Code
                  </>
                )}
              </button>

              <button
                className={`btn-success flex items-center gap-2 ${isLoading || !code.trim() ? 'opacity-75' : ''}`}
                onClick={analyzeCode}
                disabled={isLoading || !code.trim()}
              >
                <FiPlay size={16} />
                Analyze Code
              </button>
            </div>
          </div>
        </div>

        {/* Code Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label htmlFor="code-input" className="block text-lg font-semibold text-gray-800 mb-3">
            Your Code:
          </label>
          <textarea
            id="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste your ${language} code here or click "Scrape Code" to get it from the LeetCode editor...`}
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg font-code text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            rows={12}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <FiAlertTriangle className="text-danger-600" size={20} />
              <p className="text-danger-800 flex-1">{error}</p>
              <button
                className="btn-danger"
                onClick={analyzeCode}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Analyzing your code for {questionName}...
            </h3>
            <p className="text-gray-600">
              Checking for bugs, optimizations, and edge cases
            </p>
          </div>
        ) : analysis ? (
          /* Analysis Results */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="text-red-600" size={20} />
                <span className="font-semibold text-gray-800">Code Analysis Results</span>
              </div>
              <button
                className="btn-secondary flex items-center gap-2"
                onClick={copyAnalysisToClipboard}
                title="Copy analysis to clipboard"
              >
                <FiCopy size={16} />
                Copy
              </button>
            </div>

            {/* Analysis Content */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              <div className="prose max-w-none">
                <ReactMarkdown
                  components={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <SyntaxHighlighter
                          language={match[1]}
                          // @ts-expect-error Something is wrong with the types
                          style={vscDarkPlus}
                          PreTag="div"
                          className="rounded-lg"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-code" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-6">
              <FiAlertTriangle size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Paste your code and get detailed analysis for <span className="text-red-600">{questionName}</span>
            </h3>
            <p className="text-gray-600 mb-6">
              Find bugs, optimization opportunities, and edge cases in your solution
            </p>
            <button
              className={`btn-success ${isLoading || !code.trim() ? 'opacity-75' : ''}`}
              onClick={analyzeCode}
              disabled={isLoading || !code.trim()}
            >
              Analyze Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeAnalysis;
