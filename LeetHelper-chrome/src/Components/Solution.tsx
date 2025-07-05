import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft, FiRefreshCw, FiPlay, FiCode, FiCopy } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { prism  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLeetCodeSolution } from '../Gemini/SolutionChat';
import { ComponentProps } from '../types';
import { storageUtils } from '../utils/storage';

const Solution: React.FC<ComponentProps> = ({ questionName, onBack }) => {
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [programmingLanguage, setProgrammingLanguage] = useState('C++');

  const languages = ['C++', 'JavaScript', 'Python', 'Java', 'C'];

  // Load cached data on component mount
  useEffect(() => {
    const cachedData = storageUtils.getCachedData(questionName);
    if (cachedData?.solution) {
      setSolution(cachedData.solution);
    }
  }, [questionName]);

  const generateSolution = useCallback(async () => {
    if (!questionName || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await getLeetCodeSolution(questionName, programmingLanguage);
      setSolution(result);
      
      // Cache the result
      storageUtils.setCachedData(questionName, 'solution', result);
    } catch (err) {
      setError('Failed to fetch solution. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [questionName, programmingLanguage, isLoading]);

  // Only load cached solution, don't auto-generate
  // Remove the useEffect that auto-generates solutions

  const copyToClipboard = () => {
    if (!solution) return;

    navigator.clipboard.writeText(solution)
      .then(() => {
        const copyBtn = document.getElementById('solution-copy-btn');
        if (copyBtn) {
          const originalContent = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span>✓ Copied</span>';
          setTimeout(() => {
            copyBtn.innerHTML = originalContent;
          }, 2000);
        }
      })
      .catch(err => console.error('Failed to copy solution:', err));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
          onClick={onBack}
        >
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{questionName} Solution</h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <label htmlFor="language-select" className="text-sm font-medium text-gray-700">
            Language:
          </label>
          <select
            id="language-select"
            value={programmingLanguage}
            onChange={(e) => setProgrammingLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            onClick={generateSolution}
            disabled={isLoading}
          >
            <FiPlay className="w-4 h-4" />
            <span>Generate</span>
          </button>

          <button
            className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            onClick={generateSolution}
            disabled={isLoading}
            title="Regenerate solution"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 mb-3">{error}</p>
          <button 
            onClick={generateSolution}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Generating {programmingLanguage} solution for {questionName}...</p>
        </div>
      ) : solution ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-3">
            <div className="flex items-center gap-2">
              <FiCode className="w-4 h-4" />
              <span className="font-medium">{programmingLanguage}</span>
            </div>
            <button
              id="solution-copy-btn"
              className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors duration-200"
              onClick={copyToClipboard}
              title="Copy solution to clipboard"
            >
              <FiCopy className="w-4 h-4" /> Copy
            </button>
          </div>

          <div className="prose prose-lg max-w-none p-4 solution-markdown">
            <ReactMarkdown
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      language={match[1]}
                      // @ts-expect-error Something is wrong with the types
                      style={prism}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {solution}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <FiCode className="w-16 h-16" />
          </div>
          <p className="text-gray-600 text-center mb-4">
            Generate a {programmingLanguage} solution for <strong>{questionName}</strong>
          </p>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            onClick={generateSolution}
            disabled={isLoading}
          >
            Generate Solution
          </button>
        </div>
      )}
    </div>
  );
};

export default Solution;

//     // Helper function to detect language for syntax highlighting
//     const detectLanguage = () => {
//         const languageMap: Record<string, string> = {
//             'JavaScript': 'javascript',
//             'Python': 'python',
//             'Java': 'java',
//             'C++': 'cpp',
//             'C': 'c'
//         };
//         return languageMap[programmingLanguage] || 'javascript';
//     };

//     return (
//         <div className="solution-wrapper">
//             <div className="solution-header">
//                 <button className="back-button" onClick={() => setActiveTab('home')}>
//                     <span>←</span> Back
//                 </button>
//                 <h2>{questionName} Solution</h2>
//             </div>

//             <div className="solution-controls">
//                 <div className="language-selector">
//                     <label htmlFor="language-select">Language:</label>
//                     <select
//                         id="language-select"
//                         value={programmingLanguage}
//                         onChange={(e) => setProgrammingLanguage(e.target.value)}
//                     >
//                         {languages.map((lang) => (
//                             <option key={lang} value={lang}>{lang}</option>
//                         ))}
//                     </select>
//                 </div>
                
//                 <button 
//                     className="refresh-btn"
//                     onClick={generateSolution}
//                     disabled={isLoading}
//                     title="Regenerate solution"
//                 >
//                     <FiRefreshCw className={isLoading ? 'spinning' : ''} />
//                 </button>
//             </div>

//             {error && (
//                 <div className="solution-error">
//                     <p>{error}</p>
//                     <button onClick={generateSolution}>Try Again</button>
//                 </div>
//             )}

//             {isLoading ? (
//                 <div className="solution-loading">
//                     <div className="loader"></div>
//                     <p>Generating {programmingLanguage} solution...</p>
//                 </div>
//             ) : solution ? (
//                 <div className="solution-content">
//                     <div className="solution-toolbar">
//                         <div className="solution-info">
//                             <FiCode /> <span>{programmingLanguage}</span>
//                             <FiClock /> <span>Optimized solution</span>
//                         </div>
//                         <button 
//                             id="copy-btn" 
//                             className="copy-btn" 
//                             onClick={copyToClipboard}
//                             title="Copy to clipboard"
//                         >
//                             <FiCopy /> Copy
//                         </button>
//                     </div>
//                     <div className="code-container">
//                         <SyntaxHighlighter
//                             language={detectLanguage()}
//                             style={vs2015}
//                             customStyle={{
//                                 margin: 0,
//                                 padding: '16px',
//                                 borderRadius: '0 0 4px 4px',
//                                 fontSize: '14px',
//                                 lineHeight: '1.5'
//                             }}
//                             wrapLines={true}
//                             showLineNumbers={true}
//                         >
//                             {solution}
//                         </SyntaxHighlighter>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="solution-empty">
//                     <p>Click the button to generate a solution for {questionName}</p>
//                     <button onClick={generateSolution} disabled={isLoading}>
//                         Generate Solution
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };