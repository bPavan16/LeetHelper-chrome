import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiPlay, FiCopy, FiHelpCircle } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { getLeetCodeHints } from '../Gemini/GetHints';
import { ComponentProps } from '../types';
import { storageUtils } from '../utils/storage';

const Hints: React.FC<ComponentProps> = ({ questionName, onBack }) => {
  const [hints, setHints] = useState<string | null>(null);
  const [isLoadingHints, setIsLoadingHints] = useState(false);
  const [hintsError, setHintsError] = useState<string | null>(null);

  // Load cached data on component mount
  useEffect(() => {
    const cachedData = storageUtils.getCachedData(questionName);
    if (cachedData?.hints) {
      setHints(cachedData.hints);
    }
  }, [questionName]);

  const fetchHints = useCallback(async () => {
    if (!questionName) return;

    try {
      setIsLoadingHints(true);
      setHintsError(null);
      const result = await getLeetCodeHints(questionName);
      setHints(result);
      
      // Cache the result
      storageUtils.setCachedData(questionName, 'hints', result);
    } catch (err) {
      setHintsError('Failed to fetch hints. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingHints(false);
    }
  }, [questionName]);

  // Only load cached hints, don't auto-generate
  // Remove the useEffect that auto-fetches hints

  const copyHintsToClipboard = () => {
    if (!hints) return;

    navigator.clipboard.writeText(hints)
      .then(() => {
        const copyBtn = document.getElementById('hints-copy-btn');
        if (copyBtn) {
          const originalContent = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span>✓ Copied</span>';
          setTimeout(() => {
            copyBtn.innerHTML = originalContent;
          }, 2000);
        }
      })
      .catch(err => console.error('Failed to copy hints:', err));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 mb-6"
        onClick={onBack}
      >
        Back Home
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{questionName} - Hints</h2>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-b border-yellow-200">
          <div className="flex items-center gap-3">
            <FiHelpCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">Smart Hints</h3>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            onClick={fetchHints}
            disabled={isLoadingHints}
          >
            {isLoadingHints ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <FiPlay className="w-4 h-4" /> Generate Hints
              </>
            )}
          </button>
        </div>

        {hintsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
            <p className="text-red-800 mb-3">{hintsError}</p>
            <button 
              onClick={fetchHints}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {isLoadingHints ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
            <p className="text-gray-600">Generating hints for {questionName}...</p>
          </div>
        ) : hints ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiHelpCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Helpful hints to guide your thinking</span>
              </div>
              <button
                id="hints-copy-btn"
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                onClick={copyHintsToClipboard}
                title="Copy hints to clipboard"
              >
                <FiCopy className="w-4 h-4" /> Copy
              </button>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{hints}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
            <div className="text-gray-400 mb-4">
              <FiHelpCircle className="w-16 h-16" />
            </div>
            <p className="text-gray-600 text-center mb-4">
              Click the button to generate hints for <strong>{questionName}</strong>.
            </p>
            <button 
              onClick={fetchHints} 
              disabled={isLoadingHints}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              Generate Hints
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hints;
