import React, { useState, useEffect } from 'react';
import { FaBook, FaCheck, FaCode, FaLightbulb, FaBug, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { TabType } from '../types';

interface HomeProps {
  questionName: string;
  onTabChange: (tab: TabType) => void;
}

const Home: React.FC<HomeProps> = ({ questionName, onTabChange }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeyValid(true);
    }
  }, []);

  // Save API key to localStorage and validate
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    const isValid = value.trim().length > 0;
    setIsApiKeyValid(isValid);
    
    if (isValid) {
      localStorage.setItem('gemini_api_key', value);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">
            LeetHelper
          </h1>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary-500">
            <h2 className="text-xl font-semibold text-gray-700">
              Question: <span className="text-primary-600">{questionName}</span>
            </h2>
          </div>
        </div>

        {/* API Key Input Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FaKey className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-700">Gemini API Key</h3>
          </div>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your Gemini API key to enable AI features"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={toggleApiKeyVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showApiKey ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {!isApiKeyValid && (
            <p className="text-sm text-red-600 mt-2">
              Please enter a valid Gemini API key to use AI features
            </p>
          )}
          {isApiKeyValid && (
            <p className="text-sm text-green-600 mt-2">
              ✓ API key configured successfully
            </p>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {/* Explain Question Card */}
          <div 
            className="card p-6 text-center group hover:border-blue-500"
            onClick={() => onTabChange('explain')}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaBook size={32} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Explain Question</h3>
            <p className="text-gray-600 text-sm">
              Get detailed explanations and understand problem patterns
            </p>
          </div>

          {/* Solution Card */}
          <div 
            className="card p-6 text-center group hover:border-green-500"
            onClick={() => onTabChange('solution')}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <FaCheck size={32} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Solution</h3>
            <p className="text-gray-600 text-sm">
              Generate optimized solutions in multiple programming languages
            </p>
          </div>

          {/* Code Dry Run Card */}
          <div 
            className="card p-6 text-center group hover:border-purple-500"
            onClick={() => onTabChange('codeDryRun')}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                <FaCode size={32} className="text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Code Dry Run</h3>
            <p className="text-gray-600 text-sm">
              Step-by-step execution walkthrough and algorithm insights
            </p>
          </div>

          {/* Hints Card */}
          <div 
            className="card p-6 text-center group hover:border-yellow-500"
            onClick={() => onTabChange('hints')}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors">
                <FaLightbulb size={32} className="text-yellow-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Hints</h3>
            <p className="text-gray-600 text-sm">
              Progressive hints to guide you toward the solution
            </p>
          </div>

          {/* Code Analysis Card */}
          <div 
            className="card p-6 text-center group hover:border-red-500 md:col-span-2 lg:col-span-1"
            onClick={() => onTabChange('codeAnalysis')}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                <FaBug size={32} className="text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Code Analysis</h3>
            <p className="text-gray-600 text-sm">
              Analyze your code for bugs, optimizations, and improvements
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Powered by AI • Built for LeetCode Success
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
