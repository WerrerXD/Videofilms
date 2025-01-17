import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";
import { Provider } from 'react-redux';
import { store } from 'store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <MantineProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </MantineProvider>
  </Provider>
);
