import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {  HashRouter } from 'react-router-dom';
import { createStore } from 'redux'; // Changed from legacy_createStore to createStore
import { Provider } from 'react-redux';
import reducer from './Reducer.jsx';
import LogIn from './LogIn.jsx';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';



const appStore = createStore(reducer); // Changed from legacy_createStore to createStore

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={appStore}>
      
    <HashRouter>
      <LogIn/>
    </HashRouter>

    </Provider>
  </React.StrictMode>
);
