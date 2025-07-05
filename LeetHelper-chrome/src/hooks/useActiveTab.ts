import { useState, useEffect } from 'react';
import { TabType } from '../types';

export const useActiveTab = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

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

  return { activeTab, setActiveTab };
};
