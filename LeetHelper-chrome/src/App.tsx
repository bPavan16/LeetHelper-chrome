import './App.css';
import { useQuestionName } from './hooks/useQuestionName';
import { useActiveTab } from './hooks/useActiveTab';
import Home from './Components/Home';
import ExplainQuestion from './Components/ExplainQuestion';
import Solution from './Components/Solution';
import DryRun from './Components/DryRunComponent';
import Hints from './Components/Hints';
import CodeAnalysis from './Components/CodeAnalysis';

function App() {

  const questionName = useQuestionName();
  const { activeTab, setActiveTab } = useActiveTab();

  const handleBack = () => {
    setActiveTab('home');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'explain':
        return <ExplainQuestion questionName={questionName} onBack={handleBack} />;
      case 'solution':
        return <Solution questionName={questionName} onBack={handleBack} />;
      case 'codeDryRun':
        return <DryRun questionName={questionName} onBack={handleBack} />;
      case 'hints':
        return <Hints questionName={questionName} onBack={handleBack} />;
      case 'codeAnalysis':
        return <CodeAnalysis questionName={questionName} onBack={handleBack} />;
      default:
        return <Home questionName={questionName} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {renderTabContent()}
    </div>
  );
}

export default App;
