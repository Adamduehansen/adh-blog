import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Hand, hands } from './game';

function ai(): Hand {
  return hands[Math.floor(Math.random() * hands.length)];
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App opponentAi={ai} />
  </React.StrictMode>
);
