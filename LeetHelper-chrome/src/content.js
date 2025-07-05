// Content script to scrape code from LeetCode editor
console.log('LeetHelper content script loaded');

// Function to get code from LeetCode editor
function getCodeFromEditor() {
    // Try different selectors for LeetCode editor
    const selectors = [
        '.view-lines',
        '.view-line',
        'textarea',
        '.monaco-editor textarea',
        '.CodeMirror-code',
        '.cm-content'
    ];

    for (const selector of selectors) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                // For CodeMirror
                if (element.closest('.CodeMirror')) {
                    const codeMirror = element.closest('.CodeMirror');
                    if (codeMirror && codeMirror.CodeMirror) {
                        return {
                            code: codeMirror.CodeMirror.getValue(),
                            language: getLanguageFromPage()
                        };
                    }
                }

                // For Monaco Editor
                if (element.closest('.monaco-editor')) {
                    const textarea = element.closest('.monaco-editor').querySelector('textarea');
                    if (textarea && textarea.value) {
                        return {
                            code: textarea.value,
                            language: getLanguageFromPage()
                        };
                    }
                }

                // For other editors with textarea
                if (element.tagName === 'TEXTAREA' && element.value) {
                    return {
                        code: element.value,
                        language: getLanguageFromPage()
                    };
                }

                // For elements with text content
                if (element.textContent) {
                    return {
                        code: element.textContent,
                        language: getLanguageFromPage()
                    };
                }
            }
        } catch (error) {
            console.error('Error with selector:', selector, error);
        }
    }

    return null;
}

// Function to detect the programming language from the page
function getLanguageFromPage() {
    // Try to find language selector
    const languageSelectors = [
        'button[data-testid="language-selector"]',
        '.lang-select',
        '.language-selector',
        '[data-cy="lang-select"]'
    ];

    for (const selector of languageSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            const text = element.textContent || element.innerText;
            if (text) {
                // Map common language names
                const languageMap = {
                    'javascript': 'JavaScript',
                    'python': 'Python',
                    'python3': 'Python',
                    'java': 'Java',
                    'c++': 'C++',
                    'cpp': 'C++',
                    'c': 'C',
                    'csharp': 'C#',
                    'go': 'Go',
                    'rust': 'Rust',
                    'kotlin': 'Kotlin',
                    'swift': 'Swift'
                };

                const langLower = text.toLowerCase();
                return languageMap[langLower] || text;
            }
        }
    }

    // Default to JavaScript if not found
    return 'JavaScript';
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCode') {
        try {
            const result = getCodeFromEditor();
            if (result) {
                sendResponse({
                    success: true,
                    code: result.code,
                    language: result.language
                });
            } else {
                sendResponse({
                    success: false,
                    error: 'Could not find code editor on this page'
                });
            }
        } catch (error) {
            console.error('Error getting code:', error);
            sendResponse({
                success: false,
                error: 'Error accessing code editor: ' + error.message
            });
        }
    }

    return true; // Keep the message channel open for async response
});

// Alternative method: Try to detect when user is on LeetCode and has code
function detectLeetCodeEnvironment() {
    const isLeetCode = window.location.hostname.includes('leetcode.com');
    if (isLeetCode) {
        console.log('LeetCode environment detected');

        // Try to observe DOM changes to detect when editor loads
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check if editor elements are added
                    const editorElements = document.querySelectorAll('.CodeMirror, .monaco-editor');
                    if (editorElements.length > 0) {
                        console.log('Code editor detected');
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize
detectLeetCodeEnvironment();
