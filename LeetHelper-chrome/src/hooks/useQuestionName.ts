import { useState, useEffect } from 'react';

export const useQuestionName = () => {
  const [questionName, setQuestionName] = useState<string>('Question Name');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          const url = tabs[0].url;
          console.log('Active tab URL:', url);

          const urlParts = url.split('/');
          const firstQuestionName = urlParts[urlParts.length - 1];

          if (firstQuestionName === "") {
            setQuestionName(urlParts[urlParts.length - 2]);
          } else {
            setQuestionName(firstQuestionName);
          }

          console.log('Question Name extracted from URL');
        }
      });
    }
  }, []);

  return questionName;
};
