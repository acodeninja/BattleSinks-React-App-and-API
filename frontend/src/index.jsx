import React from 'react';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);

serviceWorker.unregister();