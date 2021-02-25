import firebase from 'firebase/app';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBRm3Lh9dUIRO6bV80eTKeFhCO--wfUyTs",
    authDomain: "lista-42fc5.firebaseapp.com",
    projectId: "lista-42fc5",
    storageBucket: "lista-42fc5.appspot.com",
    messagingSenderId: "236679300117",
    appId: "1:236679300117:web:e26cb361951e9d8a5bfa1c"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //es muy importante que se encuentre aqui

  export {firebase};