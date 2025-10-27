import React from 'react';
import HomePage from './components/HomePage';
import { ThemeProvider, ThemeStyles } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ThemeStyles />
      <div className="App">
        <HomePage />
      </div>
    </ThemeProvider>
  );
}

export default App;
