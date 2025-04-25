import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyZKthndkRJTJACODm3x5gSTIYEQFKLqvQ",
    authDomain: "marketplace-project-lsp.firebaseapp.com",
    databaseURL: "https://marketplace-project-lsp-default-rtdb.firebaseio.com",
    projectId: "marketplace-project-lsp",
    storageBucket: "marketplace-project-lsp.appspot.com",
    messagingSenderId: "427882665191",
    appId: "1:427882665191:web:1b48dd8ca2049c435c0e2c",
    measurementId: "G-KFWLDREJ38"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
