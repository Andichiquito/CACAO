import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Menu from './components/Menu';
import { ThemeProvider, ThemeStyles } from './contexts/ThemeContext';
import './App.css';

type ViewType = 'home' | 'menu' | 'about';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const renderCurrentView = (): React.ReactElement => {
    switch (currentView) {
      case 'menu':
        return <Menu onNavigate={setCurrentView} />;
      case 'about':
        return <HomePage onNavigate={setCurrentView} />;
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <ThemeStyles />
      <div className="App">
        {renderCurrentView()}
      </div>
    </ThemeProvider>
  );
};

export default App;

