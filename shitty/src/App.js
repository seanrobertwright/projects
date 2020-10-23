import {
  ThemeProvider
} from '@ui5/webcomponents-react';
import React from 'react';
import './App.css';
import { MainApp } from './MainApp';
import { HashRouter } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
