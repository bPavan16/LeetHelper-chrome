/**
 * Utility functions for managing Gemini API key
 */

export const getGeminiApiKey = (): string => {
  const apiKey = localStorage.getItem('gemini_api_key');
  return apiKey || '';
};

export const setGeminiApiKey = (apiKey: string): void => {
  if (apiKey.trim()) {
    localStorage.setItem('gemini_api_key', apiKey);
  } else {
    localStorage.removeItem('gemini_api_key');
  }
};

export const hasValidGeminiApiKey = (): boolean => {
  const apiKey = getGeminiApiKey();
  return apiKey.trim().length > 0;
};
