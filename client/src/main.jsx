import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import App from './App.jsx';
import './index.css'; // Import our Tailwind styles

// This sets the dark mode class on the <html> element by default.
// You can build a theme toggler to change this later.
document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provide the Redux store to the entire app */}
    <Provider store={store}>
      {/* Enable client-side routing */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);