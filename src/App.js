import React from 'react';
import HomePage from './components/HomePage';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { ThemeProvider, ThemeStyles } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <SupabaseProvider>
        <ThemeStyles />
        <div className="App">
          <HomePage />
        </div>
      </SupabaseProvider>
    </ThemeProvider>
  );
}

export default App;
