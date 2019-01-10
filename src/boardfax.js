import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyDG4tjXM3xtWdWKz5LPY4WH33mZuW-b9f8",
    authDomain: "boardfax-5cb1f.firebaseapp.com",
    databaseURL: "https://boardfax-5cb1f.firebaseio.com",
    projectId: "boardfax-5cb1f",
    storageBucket: "",
    messagingSenderId: "414255633049"
  };
var boardfax = firebase.initializeApp(config);
export default boardfax


