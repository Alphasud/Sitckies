import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyDanDW-Dfh_yZF3oTpkf8R_GsBze-Grdtw",
  authDomain: "stickies-4b27c.firebaseapp.com",
  projectId: "stickies-4b27c",
  storageBucket: "stickies-4b27c.appspot.com",
  messagingSenderId: "92157252031",
  appId: "1:92157252031:web:0b3f6f56e7107789dcd10a"

};
// Initialize Firebase
firebase.initializeApp(config);
const db = firebase.firestore();

export default db;