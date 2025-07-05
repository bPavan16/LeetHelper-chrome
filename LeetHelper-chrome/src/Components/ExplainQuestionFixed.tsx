import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft, FiRefreshCw, FiPlay, FiBook, FiCopy } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLeetCodeExplanation } from '../Gemini/ExplainQuestion';
import { ComponentProps } from '../types';
import '../styles/ExplainQuestion.css';

const ExplainQuestion: React.FC<ComponentProps> = ({ questionName, onBack }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [explanationError, setExplanationError] = useState<string | null>(null);
    const [programmingLanguage] = useState('C++');

    const generateExplanation = useCallback(async () => {
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
    }, [questionName]);

    // Generate explanation when component mounts if question name is available
    useEffect(() => {
        if (!explanation && questionName) {
            generateExplanation();
        }
    }, [questionName, explanation, generateExplanation]);

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
                    onClick={onBack}
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
                                code({ node, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return match ? (
                                        <SyntaxHighlighter
                                            language={programmingLanguage}
                                            // @ts-expect-error Something is wrong with the types
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

export default ExplainQuestion;
