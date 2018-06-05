import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';

import './index.css';
import App from './App';
import SigninScreen from './Screens/Login'

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    ReactDOM.render(<App />, document.getElementById('root'));
  } else {
    // User is signed out.
    
    ReactDOM.render(<SigninScreen />, document.getElementById('root'));
    // alert('signed out');
  }
});
