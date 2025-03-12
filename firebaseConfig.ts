import { initializeApp, getApps, getApp } from "firebase/app"
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

// IMPORTANTE: Para pruebas, puedes colocar directamente tus credenciales aquí
// En producción, usa variables de entorno o un método más seguro

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId:process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase solo si no existe ya una instancia
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Inicializar Auth con persistencia solo si no existe ya
let auth
try {
  auth = getAuth(app)
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
}

const db = getFirestore(app)

export { app, auth, db }

