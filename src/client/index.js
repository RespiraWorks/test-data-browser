import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './app.scss';
import './old_app.css';
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
