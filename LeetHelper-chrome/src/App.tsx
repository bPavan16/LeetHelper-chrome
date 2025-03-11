import { useEffect, useState } from 'react'
import './App.css'
import { FaBook, FaCheck, FaCode, FaLightbulb } from 'react-icons/fa'
import { getLeetCodeSolution } from './Gemini/SolutionChat'
import './styles/Solution.css'
import './styles/DryRun.css'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FiCopy, FiCode, FiClock, FiRefreshCw, FiPlay } from 'react-icons/fi';
import { FiChevronsDown, FiTarget, FiLayers } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { getLeetCodeDryRun } from './Gemini/DryRun'


function App() {
  const [questionName, setQuestionName] = useState<string>('Question Name')
  const [activeTab, setActiveTab] = useState<'home' | 'explain' | 'solution' | 'codeDryRun' | 'hints'>('home')
  const [solution, setSolution] = useState('');


  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          const url = tabs[0].url;
          console.log('Active tab URL:', url);

          const urlParts = url.split('/');
          const FirstquestionName = urlParts[urlParts.length - 1];

          if (FirstquestionName === "")
            setQuestionName(urlParts[urlParts.length - 2]);

          console.log('Question Name:', questionName);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['activeTab'], (result) => {
        if (result.activeTab) {
          setActiveTab(result.activeTab);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ activeTab });
    }
  }, [activeTab]);


  /* ------------------------Explain--------------------------------------- */

  const Explain = () => (

    <div className="component-container">
      <button className="back-button" onClick={() => setActiveTab('home')}>Back Home</button>
      <h2>{questionName} - Explain Question</h2>
      <p>This is where the explanation for the question will be displayed.</p>
    </div>
  )

  /* ------------------------Solution--------------------------------------- */


  const Solution: React.FC = () => {
    const [programmingLanguage, setProgrammingLanguage] = useState('C++');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const languages = [
      'C++', 'JavaScript', 'Python', 'Java', 'C'
    ];

    // Generate solution when component mounts
    useEffect(() => {
    }, []);

    const generateSolution = async () => {
      if (!questionName) return;

      try {
        setIsLoading(true);
        setError(null);
        const result = await getLeetCodeSolution(questionName, programmingLanguage);
        setSolution(result);
      } catch (err) {
        setError('Failed to fetch solution. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const copyToClipboard = () => {
      navigator.clipboard.writeText(solution)
        .then(() => {
          const copyBtn = document.getElementById('copy-btn');
          if (copyBtn) {
            copyBtn.innerText = 'Copied!';
            setTimeout(() => { copyBtn.innerText = 'Copy'; }, 2000);
          }
        })
        .catch(err => console.error('Failed to copy solution:', err));
    };

    // Helper function to detect language for syntax highlighting
    const detectLanguage = () => {
      const languageMap: Record<string, string> = {
        'JavaScript': 'javascript',
        'Python': 'python',
        'Java': 'java',
        'C++': 'cpp',
        'C': 'c'
      };
      return languageMap[programmingLanguage] || 'cpp';
    };

    return (
      <div className="solution-wrapper">
        <div className="solution-header">
          <button className="back-button" onClick={() => setActiveTab('home')}>
            <span>←</span> Back
          </button>
          <h2>{questionName} Solution</h2>
        </div>

        <div className="solution-controls">
          <div className="language-selector">
            <label htmlFor="language-select">Language:</label>
            <select
              id="language-select"
              value={programmingLanguage}
              onChange={(e) => setProgrammingLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="control-buttons">
            <button
              className="generate-btn"
              onClick={generateSolution}
              disabled={isLoading}
            >
              <FiPlay size={12} /> Generate
            </button>

            <button
              className="refresh-btn"
              onClick={generateSolution}
              disabled={isLoading}
              title="Regenerate solution"
            >
              <FiRefreshCw className={isLoading ? 'spinning' : ''} />
            </button>
          </div>
        </div>

        {error && (
          <div className="solution-error">
            <p>{error}</p>
            <button onClick={generateSolution}>Try Again</button>
          </div>
        )}

        {isLoading ? (
          <div className="solution-loading">
            <div className="loader"></div>
            <p>Generating {programmingLanguage} solution...</p>
          </div>
        ) : solution ? (
          <div className="solution-content">
            <div className="solution-toolbar">
              <div className="solution-info">
                <FiCode /> <span>{programmingLanguage}</span>
                <FiClock /> <span>Optimized solution</span>
              </div>
              <button
                id="copy-btn"
                className="copy-btn"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                <FiCopy /> Copy
              </button>
            </div>
            <div className="code-container">
              <SyntaxHighlighter
                language={detectLanguage()}
                style={vs2015}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '0 0 4px 4px',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
                wrapLines={true}
                showLineNumbers={true}
              >
                {solution}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div className="solution-empty">
            <p>Click the button to generate a solution for {questionName}</p>
            <button onClick={generateSolution} disabled={isLoading}>
              Generate Solution
            </button>
          </div>
        )}
      </div>
    );
  };

  /* ------------------------Solution--------------------------------------- */




  /* ------------------------CodeDryRun--------------------------------------- */





  const DryRunPage: React.FC = () => {
    const [dryRunExplanation, setDryRunExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFullExplanation, setShowFullExplanation] = useState(false);

    const problemName = questionName


    const generateDryRun = async () => {


      if (!problemName) return;

      try {
        setIsLoading(true);
        setError(null);
        const result = await getLeetCodeDryRun(problemName);
        setDryRunExplanation(result);
      } catch (err) {
        setError('Failed to generate dry run. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const toggleFullExplanation = () => {
      setShowFullExplanation(!showFullExplanation);
    };

    return (
      <div className="dr-container">
      
        <div className="dr-controls">
          <button
            className="dr-refresh-btn"
            onClick={generateDryRun}
            disabled={isLoading}
            title="Regenerate explanation"
          >
            <FiRefreshCw className={isLoading ? "dr-spinning" : ""} />
            {isLoading ? "Generating..." : "Regenerate"}
          </button>
        </div>

        {error && (
          <div className="dr-error">
            <p>{error}</p>
            <button onClick={generateDryRun}>Try Again</button>
          </div>
        )}

        {isLoading ? (
          <div className="dr-loading">
            <div className="dr-loader"></div>
            <p>Generating step-by-step dry run explanation...</p>
          </div>
        ) : dryRunExplanation ? (
          <div className="dr-content">
            <div className="dr-sections">
              <div className="dr-section dr-intuition">
                <div className="dr-section-header">
                  <FiTarget className="dr-icon" />
                  <h3>Intuition & Approach</h3>
                </div>
                <div className="dr-section-content">
                  {showFullExplanation ? (
                    <div className="dr-markdown" >
                      <ReactMarkdown >
                        {dryRunExplanation}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="dr-preview">
                      <div className="dr-markdown" >

                        <ReactMarkdown>
                          {`${dryRunExplanation.substring(0, 500)}...`}
                        </ReactMarkdown>

                      </div>
                      <div className="dr-fade-overlay"></div>
                    </div>
                  )}
                </div>
                <button
                  className="dr-expand-btn"
                  onClick={toggleFullExplanation}
                >
                  <FiChevronsDown className={showFullExplanation ? "dr-flip" : ""} />
                  {showFullExplanation ? "Show Less" : "Show More"}
                </button>
              </div>

              <div className="dr-section dr-breakdown">
                <div className="dr-section-header">
                  <FiLayers className="dr-icon" />
                  <h3>Key Takeaways</h3>
                </div>
                <div className="dr-takeaways">
                  <div className="dr-takeaway">
                    <div className="dr-takeaway-number">1</div>
                    <div className="dr-takeaway-text">
                      <strong>Time Complexity:</strong> Pay attention to the explanation of time complexity in the dry run
                    </div>
                  </div>
                  <div className="dr-takeaway">
                    <div className="dr-takeaway-number">2</div>
                    <div className="dr-takeaway-text">
                      <strong>Pattern Recognition:</strong> Identify the algorithm pattern being used
                    </div>
                  </div>
                  <div className="dr-takeaway">
                    <div className="dr-takeaway-number">3</div>
                    <div className="dr-takeaway-text">
                      <strong>Edge Cases:</strong> Consider edge cases mentioned in the explanation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dr-resources">
              
            </div>
          </div>
        ) : (
          <div className="dr-empty">
            <p>Click the button to generate a dry run explanation for {problemName}</p>
            <button onClick={generateDryRun} disabled={isLoading}>
              Generate Dry Run
            </button>
          </div>
        )}
      </div>
    );
  };


  const CodeDryRun = () => (
    <div className="component-container">
      <button className="back-button" onClick={() => setActiveTab('home')}>Back Home</button>
      <h2>{questionName} - Code Dry Run</h2>
      <DryRunPage />
    </div>
  )

  /* ------------------------Hints--------------------------------------- */


  const Hints = () => (
    <div className="component-container">
      <button className="back-button" onClick={() => setActiveTab('home')}>Back Home</button>
      <h2>{questionName} - Hints</h2>
      <p>This is where hints will be provided.</p>
    </div>
  )

  /* ------------------------renderTabContent--------------------------------------- */


  const renderTabContent = () => {
    switch (activeTab) {
      case 'explain':
        return <Explain />
      case 'solution':
        return <Solution />
      case 'codeDryRun':
        return <CodeDryRun />
      case 'hints':
        return <Hints />
      default:
        return null
    }
  }

  /* ------------------------Home Screen--------------------------------------- */


  return (
    <div className="app-container">
      <header className="header">
        <h1> Question : {questionName}</h1>
      </header>
      {activeTab === 'home' ? (
        <div className="card-grid">
          <div className="card" onClick={() => setActiveTab('explain')}>
            <FaBook size={40} />
            <h3>Explain Question</h3>
          </div>
          <div className="card" onClick={() => setActiveTab('solution')}>
            <FaCheck size={40} />
            <h3>Solution</h3>
          </div>
          <div className="card" onClick={() => setActiveTab('codeDryRun')}>
            <FaCode size={40} />
            <h3>Code Dry run</h3>
          </div>
          <div className="card" onClick={() => setActiveTab('hints')}>
            <FaLightbulb size={40} />
            <h3>Hints</h3>
          </div>
        </div>
      ) : (
        <div className="tab-content">
          {renderTabContent()}
        </div>
      )}
    </div>
  )
}

export default App
