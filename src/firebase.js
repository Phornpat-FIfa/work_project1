import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDmQl74kNOq5VMPFRiVWiGxkNV32xD2zpE",
  authDomain: "solid-build-105e0.firebaseapp.com",
  projectId: "solid-build-105e0",
  storageBucket: "solid-build-105e0.firebasestorage.app",
  messagingSenderId: "419536619969",
  appId: "1:419536619969:web:dc2e00b2c88ce2fe8d8740",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
