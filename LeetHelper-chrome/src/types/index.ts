export type TabType = 'home' | 'explain' | 'solution' | 'codeDryRun' | 'hints' | 'codeAnalysis';

export interface AppState {
  questionName: string;
  activeTab: TabType;
  solution: string;
  dryRunExplanation: string;
  isLoading: boolean;
  error: string | null;
  showFullExplanation: boolean;
  programmingLanguage: string;
  explanation: string;
  isLoadingExplanation: boolean;
  explanationError: string | null;
  hints: string | null;
  isLoadingHints: boolean;
  hintsError: string | null;
}

export interface ComponentProps {
  questionName: string;
  onBack: () => void;
}
