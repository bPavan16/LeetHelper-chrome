import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft, FiPlay, FiBook, FiCopy } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLeetCodeExplanation } from '../Gemini/ExplainQuestion';
import { ComponentProps } from '../types';
import { storageUtils } from '../utils/storage';
import '../styles/ExplainQuestion.css';

const ExplainQuestion: React.FC<ComponentProps> = ({ questionName, onBack }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);
  const [programmingLanguage] = useState('C++');

  // Load cached data on component mount
  useEffect(() => {
    const cachedData = storageUtils.getCachedData(questionName);
    if (cachedData?.explanation) {
      setExplanation(cachedData.explanation);
    }
  }, [questionName]);

  const generateExplanation = useCallback(async () => {
    if (!questionName) return;

    try {
      setIsLoadingExplanation(true);
      setExplanationError(null);
      const result = await getLeetCodeExplanation(questionName);
      setExplanation(result);
      
      // Cache the result
      storageUtils.setCachedData(questionName, 'explanation', result);
    } catch (err) {
      setExplanationError('Failed to generate explanation. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingExplanation(false);
    }
  }, [questionName]);

  // Only load cached explanation, don't auto-generate
  // Remove the useEffect that auto-generates explanations

  const copyExplanationToClipboard = () => {
    navigator.clipboard.writeText(explanation)
      .then(() => {
        const copyBtn = document.getElementById('explanation-copy-btn');
        if (copyBtn) {
          const originalContent = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span>✓ Copied</span>';
          setTimeout(() => {
            copyBtn.innerHTML = originalContent;
          }, 2000);
        }
      })
      .catch(err => console.error('Failed to copy explanation:', err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
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
            {questionName} - Explained
          </h1>
          <div></div> {/* Spacer for centering */}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <button
            className={`btn-primary flex items-center gap-2 ${isLoadingExplanation ? 'opacity-75' : ''}`}
            onClick={generateExplanation}
            disabled={isLoadingExplanation}
          >
            {isLoadingExplanation ? (
              <>
                <div className="loading-spinner"></div>
                Generating...
              </>
            ) : (
              <>
                <FiPlay size={16} />
                Generate Explanation
              </>
            )}
          </button>
        </div>

        {/* Error State */}
        {explanationError && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-danger-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-danger-800">{explanationError}</p>
              <button
                className="btn-danger ml-auto"
                onClick={generateExplanation}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingExplanation ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Analyzing and explaining {questionName}...
            </h3>
            <p className="text-gray-600">
              Breaking down problem concepts and key insights
            </p>
          </div>
        ) : explanation ? (
          /* Content State */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiBook className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-800">Question Explanation</span>
              </div>
              <button
                className="btn-secondary flex items-center gap-2"
                onClick={copyExplanationToClipboard}
                title="Copy explanation to clipboard"
              >
                <FiCopy size={16} />
                Copy
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              <div className="prose max-w-none">
                <ReactMarkdown
                  components={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <SyntaxHighlighter
                          language={programmingLanguage}
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
                  {explanation}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-6">
              <FiBook size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generate an easy-to-understand explanation for <span className="text-primary-600">{questionName}</span>
            </h3>
            <p className="text-gray-600 mb-6">
              Get key insights, problem patterns, and conceptual breakdowns
            </p>
            <button
              className="btn-primary"
              onClick={generateExplanation}
              disabled={isLoadingExplanation}
            >
              Generate Explanation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplainQuestion;
