"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

// Importar las dependencias de Firebase
import { db } from "../firebaseConfig"
import { doc, getDoc, setDoc } from "firebase/firestore"

// Define the theme colors
// Definición de los colores del tema claro
const lightTheme = {
  background: "#f5f5f7",
  card: "#ffffff",
  text: "#1a1a1a",
  border: "#e0e0e0",
  shadow: "rgba(0, 0, 0, 0.1)",
  water: ["#4facfe", "#00f2fe"],
  exercise: ["#ff8177", "#ff867a"],
  food: ["#56ab2f", "#a8e063"],
  accent: "#6c5ce7",
  success: "#00b894",
  warning: "#fdcb6e",
  error: "#d63031",
}

// Definición de los colores del tema oscuro
const darkTheme = {
  background: "#121212",
  card: "#1e1e1e",
  text: "#f5f5f7",
  border: "#2a2a2a",
  shadow: "rgba(0, 0, 0, 0.3)",
  water: ["#4facfe", "#00f2fe"],
  exercise: ["#ff8177", "#ff867a"],
  food: ["#56ab2f", "#a8e063"],
  accent: "#6c5ce7",
  success: "#00b894",
  warning: "#fdcb6e",
  error: "#d63031",
}

// Definición del tipo Theme basado en el tema claro
type Theme = typeof lightTheme

// Definición de la interfaz del contexto del tema
interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

// Creación del contexto del tema con un valor inicial indefinido
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Componente proveedor del tema
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  const { user } = useAuth()

  // Cargar el tema desde Firestore cuando el usuario cambia
  useEffect(() => {
    const loadTheme = async () => {
      if (!user) return

      try {
        const userDocRef = doc(db, `users/${user.uid}`)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          setIsDark(userData.Settings?.theme === "dark")
        }
      } catch (error) {
        console.error("Error loading theme:", error)
      }
    }

    loadTheme()
  }, [user])

  // Guardar el tema en Firestore cuando cambia
  useEffect(() => {
    const saveTheme = async () => {
      if (!user) return

      try {
        const userDocRef = doc(db, `users/${user.uid}`)
        await setDoc(userDocRef, { Settings: { theme: isDark ? "dark" : "light" } }, { merge: true })
      } catch (error) {
        console.error("Error saving theme:", error)
      }
    }

    saveTheme()
  }, [isDark, user])

  // Selección del tema basado en el estado isDark
  const theme = isDark ? darkTheme : lightTheme

  // Función para alternar entre el tema oscuro y claro
  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // Proveedor del contexto del tema
  return <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

// Hook personalizado para usar el contexto del tema
export const useTheme = () => {
  // Obtención del contexto del tema
  const context = useContext(ThemeContext)
  // Lanzar un error si el hook se usa fuera del proveedor del tema
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

