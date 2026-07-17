import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

export default function DesignRuntime({ theme, onThemeToggle }) {
  return (
    <BrowserRouter>
      <div className="design-runtime">
        <App theme={theme} onThemeToggle={onThemeToggle} />
      </div>
    </BrowserRouter>
  );
}
