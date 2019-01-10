import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyCe1eXS5OoxQzwGLZjVSsHG7XynhPrtuIA",
  authDomain: "boardgrabshop.firebaseapp.com",
  databaseURL: "https://boardgrabshop.firebaseio.com",
  projectId: "boardgrabshop",
  storageBucket: "boardgrabshop.appspot.com",
  messagingSenderId: "223171477607"
  };
var fire = firebase.initializeApp(config);
export default fire;
