import {
  ThemeProvider
} from '@ui5/webcomponents-react';
import React from 'react';
import './App.css';
import { MainApp } from './MainApp';
import { HashRouter } from "react-router-dom";
import { Main } from './components/Main';

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;


