import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiTarget, FiLayers, FiChevronsDown } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { getLeetCodeDryRun } from '../Gemini/DryRun';
import { ComponentProps } from '../types';
import { storageUtils } from '../utils/storage';

const DryRun: React.FC<ComponentProps> = ({ questionName, onBack }) => {
  const [dryRunExplanation, setDryRunExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  // Load cached data on component mount
  useEffect(() => {
    const cachedData = storageUtils.getCachedData(questionName);
    if (cachedData?.dryRun) {
      setDryRunExplanation(cachedData.dryRun);
    }
  }, [questionName]);

  const generateDryRun = useCallback(async () => {
    if (!questionName) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await getLeetCodeDryRun(questionName);
      setDryRunExplanation(result);
      
      // Cache the result
      storageUtils.setCachedData(questionName, 'dryRun', result);
    } catch (err) {
      setError('Failed to generate dry run. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [questionName]);

  // Only load cached dry run, don't auto-generate
  // Remove the useEffect that auto-generates dry runs

  const toggleFullExplanation = () => {
    setShowFullExplanation(!showFullExplanation);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 mb-6"
        onClick={onBack}
      >
        Back Home
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{questionName} - Code Dry Run</h2>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Step-by-step Analysis</h3>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            onClick={generateDryRun}
            disabled={isLoading}
            title="Regenerate explanation"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Generating..." : "Regenerate"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
            <p className="text-red-800 mb-3">{error}</p>
            <button 
              onClick={generateDryRun}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Generating step-by-step dry run explanation...</p>
          </div>
        ) : dryRunExplanation ? (
          <div className="p-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiTarget className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Intuition & Approach</h3>
                </div>
                <div className="relative">
                  {showFullExplanation ? (
                    <div className="prose prose-lg max-w-none">
                      <ReactMarkdown>
                        {dryRunExplanation}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="prose prose-lg max-w-none">
                        <ReactMarkdown>
                          {`${dryRunExplanation.substring(0, 500)}...`}
                        </ReactMarkdown>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none"></div>
                    </div>
                  )}
                </div>
                <button
                  className="flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  onClick={toggleFullExplanation}
                >
                  <FiChevronsDown className={`w-4 h-4 transform transition-transform ${showFullExplanation ? "rotate-180" : ""}`} />
                  {showFullExplanation ? "Show Less" : "Show More"}
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiLayers className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Key Takeaways</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <strong className="text-gray-800">Time Complexity:</strong>
                      <span className="text-gray-600 ml-2">Pay attention to the explanation of time complexity in the dry run</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <strong className="text-gray-800">Pattern Recognition:</strong>
                      <span className="text-gray-600 ml-2">Identify the algorithm pattern being used</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <strong className="text-gray-800">Edge Cases:</strong>
                      <span className="text-gray-600 ml-2">Consider edge cases mentioned in the explanation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
            <p className="text-gray-600 text-center mb-4">
              Click the button to generate a dry run explanation for <strong>{questionName}</strong>
            </p>
            <button 
              onClick={generateDryRun} 
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              Generate Dry Run
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DryRun;
