import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
<Auth0Provider
domain="dev-qxkv2ky72mrmyp1d.us.auth0.com"
clientId="6GBrD4TOP2uA5ISrs4ooKL0j1sL3JZQP"
authorizationParams={{
  redirect_uri: window.location.origin
}}>
<App />
</Auth0Provider>
</React.StrictMode>
);



