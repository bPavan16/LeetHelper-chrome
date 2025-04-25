import { useEffect, useState } from 'react'
import './App.css'
import { FaBook, FaCheck, FaCode, FaLightbulb } from 'react-icons/fa'
import { getLeetCodeSolution } from './Gemini/SolutionChat'
import './styles/Solution.css'
import './styles/ExplainQuestion.css'
import './styles/DryRun.css'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { FiCopy, FiCode, FiRefreshCw, FiPlay, FiArrowLeft, FiBook } from 'react-icons/fi';
import { FiChevronsDown, FiTarget, FiLayers } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { getLeetCodeDryRun } from './Gemini/DryRun'

import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLeetCodeExplanation } from './Gemini/ExplainQuestion'



function App() {
  const [questionName, setQuestionName] = useState<string>('Question Name')
  const [activeTab, setActiveTab] = useState<'home' | 'explain' | 'solution' | 'codeDryRun' | 'hints'>('home')
  const [solution, setSolution] = useState('');


  // Dry Run states
  const [dryRunExplanation, setDryRunExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  const problemName = questionName


  // Solution states
  const [programmingLanguage, setProgrammingLanguage] = useState('C++');
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);


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
          setError(null); // Reset error when active tab changes
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

  const Explain = () => {
    const [explanation, setExplanation] = useState('');
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [explanationError, setExplanationError] = useState<string | null>(null);

    // Generate explanation when component mounts if question name is available
    useEffect(() => {
      if (questionName && !explanation) {
        generateExplanation();
      }
    }, [questionName]);

    const generateExplanation = async () => {
      if (!questionName) return;

      try {
        setIsLoadingExplanation(true);
        setExplanationError(null);
        const result = await getLeetCodeExplanation(questionName);
        setExplanation(result);
      } catch (err) {
        setExplanationError('Failed to generate explanation. Please try again.');
        console.error(err);
      } finally {
        setIsLoadingExplanation(false);
      }
    };

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
      <div className="leethelper-explanation__container">
        <div className="leethelper-explanation__header">
          <button
            className="leethelper-explanation__back-button"
            onClick={() => setActiveTab('home')}
          >
            <FiArrowLeft /> Back
          </button>
          <h2 className="leethelper-explanation__title">{questionName} - Explained</h2>
        </div>

        <div className="leethelper-explanation__controls">
          <button
            className="leethelper-explanation__generate-btn"
            onClick={generateExplanation}
            disabled={isLoadingExplanation}
          >
            {isLoadingExplanation ? (
              <>
                <FiRefreshCw className="leethelper-explanation__spinning" /> Generating...
              </>
            ) : (
              <>
                <FiPlay size={14} /> Generate Explanation
              </>
            )}
          </button>
        </div>

        {explanationError && (
          <div className="leethelper-explanation__error">
            <p>{explanationError}</p>
            <button onClick={generateExplanation}>Try Again</button>
          </div>
        )}

        {isLoadingExplanation ? (
          <div className="leethelper-explanation__loading">
            <div className="leethelper-explanation__loader"></div>
            <p>Analyzing and explaining {questionName}...</p>
            <p className="leethelper-explanation__loading-subtext">Breaking down problem concepts and key insights</p>
          </div>
        ) : explanation ? (
          <div className="leethelper-explanation__content">
            <div className="leethelper-explanation__toolbar">
              <div className="leethelper-explanation__info">
                <span className="leethelper-explanation__type">
                  <FiBook /> Question Explanation
                </span>
              </div>
              <button
                id="explanation-copy-btn"
                className="leethelper-explanation__copy-btn"
                onClick={copyExplanationToClipboard}
                title="Copy explanation to clipboard"
              >
                <FiCopy /> Copy
              </button>
            </div>

            <div className="leethelper-explanation__markdown-container">
              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        style={vscDarkPlus}
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
                {explanation}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="leethelper-explanation__empty">
            <div className="leethelper-explanation__empty-icon">
              <FiBook size={32} />
            </div>
            <p>Generate an easy-to-understand explanation for <strong>{questionName}</strong></p>
            <p className="leethelper-explanation__empty-subtext">
              Get key insights, problem patterns, and conceptual breakdowns
            </p>
            <button
              className="leethelper-explanation__generate-btn"
              onClick={generateExplanation}
              disabled={isLoadingExplanation}
            >
              Generate Explanation
            </button>
          </div>
        )}
      </div>
    );
  };


  /* ------------------------Solution--------------------------------------- */


  const Solution: React.FC = () => {


    const languages = [
      'C++', 'JavaScript', 'Python', 'Java', 'C'
    ];

    // Generate solution on initial render if question name is available
    useEffect(() => {
      if (questionName && !solution) {
        generateSolution();
      }
    }, [questionName]);

    const generateSolution = async () => {

      if (solution) return; // Prevent multiple calls if solution already exists

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
      <div className="leethelper-solution__container">
        <div className="leethelper-solution__header">
          <button
            className="leethelper-solution__back-button"
            onClick={() => setActiveTab('home')}
          >
            <FiArrowLeft /> Back
          </button>
          <h2 className="leethelper-solution__title">{questionName} Solution</h2>
        </div>

        <div className="leethelper-solution__controls">
          <div className="leethelper-solution__language-selector">
            <label htmlFor="language-select">Language:</label>
            <select
              id="language-select"
              value={programmingLanguage}
              onChange={(e) => setProgrammingLanguage(e.target.value)}
              className="leethelper-solution__select"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="leethelper-solution__actions">
            <button
              className="leethelper-solution__generate-btn"
              onClick={generateSolution}
              disabled={isLoading}
            >
              <FiPlay size={14} />
              <span>Generate</span>
            </button>

            <button
              className="leethelper-solution__refresh-btn"
              onClick={generateSolution}
              disabled={isLoading}
              title="Regenerate solution"
            >
              <FiRefreshCw className={isLoading ? "leethelper-solution__spinning" : ""} />
            </button>
          </div>
        </div>

        {error && (
          <div className="leethelper-solution__error">
            <p>{error}</p>
            <button onClick={generateSolution}>Try Again</button>
          </div>
        )}

        {isLoading ? (
          <div className="leethelper-solution__loading">
            <div className="leethelper-solution__loader"></div>
            <p>Generating {programmingLanguage} solution for {questionName}...</p>
          </div>
        ) : solution ? (
          <div className="leethelper-solution__content">
            <div className="leethelper-solution__toolbar">
              <div className="leethelper-solution__info">
                <span className="leethelper-solution__language">
                  <FiCode /> {programmingLanguage}
                </span>
              </div>
              <button
                id="solution-copy-btn"
                className="leethelper-solution__copy-btn"
                onClick={copyToClipboard}
                title="Copy solution to clipboard"
              >
                <FiCopy /> Copy
              </button>
            </div>

            <div className="leethelper-solution__markdown-container">
              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = false; // Define inline variable
                    return !isInline && match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        style={vscDarkPlus}
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
          <div className="leethelper-solution__empty">
            <div className="leethelper-solution__empty-icon">
              <FiCode size={32} />
            </div>
            <p>Generate a {programmingLanguage} solution for <strong>{questionName}</strong></p>
            <button
              className="leethelper-solution__generate-btn"
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



  /* ------------------------Solution--------------------------------------- */




  /* ------------------------CodeDryRun--------------------------------------- */





  const DryRunPage: React.FC = () => {


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
