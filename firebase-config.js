// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyCaNSvhJU24aDSEW7zM-OHGzlHGVxmO9gg",
  authDomain: "graffiti-report-tool.firebaseapp.com",
  projectId: "graffiti-report-tool",
  storageBucket: "graffiti-report-tool.appspot.com", // ✅ THIS is correct
  messagingSenderId: "707394343738",
  appId: "1:707394343738:web:892c29ab6c510ccf373603"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();
