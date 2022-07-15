import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.scss';
import App from './App';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//for Auth0
import { Auth0Provider } from "@auth0/auth0-react";
import LoginButton from './login';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-gi520dy8.us.auth0.com"
    clientId="LUsIqguU5pbiZ7fWzz2AQKcLZ91luUEt"
    redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>  
);
