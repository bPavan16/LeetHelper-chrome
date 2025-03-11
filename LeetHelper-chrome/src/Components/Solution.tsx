// /* ------------------------Solution--------------------------------------- */
// import React, { useState, useEffect } from 'react';
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import { getLeetCodeSolution } from './Gemini/SolutionChat';
// import { FiCopy, FiCode, FiClock, FiRefreshCw } from 'react-icons/fi';

// const Solution: React.FC = () => {
//     const [programmingLanguage, setProgrammingLanguage] = useState('JavaScript');
//     const [solution, setSolution] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const languages = [
//         'JavaScript', 'Python', 'Java', 'C++', 'C'
//     ];

//     // Generate solution when language changes or on first load
//     useEffect(() => {
//         generateSolution();
//     }, [programmingLanguage]);

//     const generateSolution = async () => {
//         if (!questionName) return;
        
//         try {
//             setIsLoading(true);
//             setError(null);
//             const result = await getLeetCodeSolution(questionName, programmingLanguage);
//             setSolution(result);
//         } catch (err) {
//             setError('Failed to fetch solution. Please try again.');
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(solution)
//             .then(() => {
//                 const copyBtn = document.getElementById('copy-btn');
//                 if (copyBtn) {
//                     copyBtn.innerText = 'Copied!';
//                     setTimeout(() => { copyBtn.innerText = 'Copy'; }, 2000);
//                 }
//             })
//             .catch(err => console.error('Failed to copy solution:', err));
//     };

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