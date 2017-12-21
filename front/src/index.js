//react
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//libraries

//project
import configureStore from './config/configureStore';
import App from './App';
import './styles/site.css';

const store = configureStore(); 

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root')
);
