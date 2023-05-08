import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App.tsx';
import 'sanitize.css';
import '@/src/styles/index.module.scss';

if (import.meta.env.MODE === 'development') {
  const { worker } = await import('./mock/browser.ts');
  worker.start();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
