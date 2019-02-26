import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';

const config = {
  apiKey: "AIzaSyD4hWFxJyDgXeV7jWa0Gjne2WycHyAhTsI",
  authDomain: "drive-manager-a3954.firebaseapp.com",
  databaseURL: "https://drive-manager-a3954.firebaseio.com",
  projectId: "drive-manager-a3954",
  storageBucket: "drive-manager-a3954.appspot.com",
  messagingSenderId: "1014104695753"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
