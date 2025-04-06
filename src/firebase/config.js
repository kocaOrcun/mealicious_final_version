// Firebase bağlantısını yapar. Önemli bilgiler taşır.

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'




// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()
// timestamp
const timestamp = firebase.firestore.Timestamp
export { projectFirestore, projectAuth, timestamp, projectStorage }
