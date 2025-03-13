"use client"

// Importaciones necesarias de React y Firebase
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { auth, db } from "../firebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import { Settings } from "react-native"

// Definición de la interfaz del contexto de autenticación
interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Creación del contexto de autenticación con un valor inicial indefinido
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Componente proveedor de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para manejar el usuario autenticado
  const [user, setUser] = useState<User | null>(null)
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState(true)

  // Efecto para suscribirse a los cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Limpieza de la suscripción al desmontar el componente
    return () => unsubscribe()
  }, [])

  // Función para registrar un nuevo usuario
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      const user = userCredential.user;

      // Crear un documento en Firestore con el UID del usuario
      await setDoc(doc(db, "users", user.uid), {
        createdAt: new Date(),
        displayedName: user.displayName,
        email: email,
        lastLoginAt: new Date(),
        Settings: {
          notifications: true,
          theme: "light"
        }
      })
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  // Función para iniciar sesión
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      // Actualizar la última fecha de inicio de sesión en Firestore
      await setDoc(doc(db, `users/${user.uid}`), {
        lastLoginAt: new Date()
      }, { merge: true })

    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  // Proveedor del contexto de autenticación
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  // Obtención del contexto de autenticación
  const context = useContext(AuthContext)
  // Lanzar un error si el hook se usa fuera del proveedor de autenticación
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

