// Local Storage utility for caching LeetCode data
export interface CachedData {
  explanation?: string;
  solution?: string;
  hints?: string;
  dryRun?: string;
  mistakes?: string;
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_PREFIX = 'leethelper_';

export const storageUtils = {
  // Get cached data for a specific question
  getCachedData: (questionName: string): CachedData | null => {
    try {
      const cached = localStorage.getItem(`${CACHE_PREFIX}${questionName}`);
      if (!cached) return null;
      
      const data: CachedData = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is expired
      if (now - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(`${CACHE_PREFIX}${questionName}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  },

  // Store data in cache
  setCachedData: (questionName: string, type: keyof Omit<CachedData, 'timestamp'>, data: string) => {
    try {
      const existing = storageUtils.getCachedData(questionName) || { timestamp: Date.now() };
      const updated: CachedData = {
        ...existing,
        [type]: data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`${CACHE_PREFIX}${questionName}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error setting cached data:', error);
    }
  },

  // Clear cache for a specific question
  clearCache: (questionName: string) => {
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${questionName}`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  // Clear all cache
  clearAllCache: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  }
};
