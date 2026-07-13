import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';

export default function DesignRuntime() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
