import { initializeApp, getApps, getApp } from "firebase/app"
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

// IMPORTANTE: Para pruebas, puedes colocar directamente tus credenciales aquí
// En producción, usa variables de entorno o un método más seguro

const firebaseConfig = {
  apiKey: "AIzaSyDPMdvL6lf9uqNw9x6JcREjFWQ6rkx4JGY",
  authDomain: "habit-tracker-b438a.firebaseapp.com",
  projectId: "habit-tracker-b438a",
  storageBucket: "habit-tracker-b438a.firebasestorage.app",
  messagingSenderId: "917001546228",
  appId: "1:917001546228:web:b46c5ef68539b28514f1a1",
  measurementId: "G-MVYRB7JX2M"
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

