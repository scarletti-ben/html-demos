// < ======================================================
// < Imports
// < ======================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAnalytics
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";

import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// < ======================================================
// < Declarations
// < ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyAXwUAQEW3neiyQ1jVD5rkOHA9Q4gy9b1w",
    authDomain: "guessing-game-alpha.firebaseapp.com",
    projectId: "guessing-game-alpha",
    storageBucket: "guessing-game-alpha.firebasestorage.app",
    messagingSenderId: "720639526399",
    appId: "1:720639526399:web:c085d7994d2a013530d3ca",
    measurementId: "G-RHCD7YM3P3"
};

// > ======================================================
// > Exports
// > ======================================================

export {
    firebaseConfig,
    initializeApp,
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    updateProfile
}