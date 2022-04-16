import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.scss';
import App from './App';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
