// Firebase bağlantısını yapar. Önemli bilgiler taşır.

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyA9-mhdtDExETYKerSzgu8GnQch5E2qdUQ",
    authDomain: "mealicious-71223.firebaseapp.com",
    projectId: "mealicious-71223",
    storageBucket: "mealicious-71223.appspot.com",
    messagingSenderId: "530293984548",
    appId: "1:530293984548:web:e390905558be8c3b3b37b1"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()
// timestamp
const timestamp = firebase.firestore.Timestamp
export { projectFirestore, projectAuth, timestamp, projectStorage }