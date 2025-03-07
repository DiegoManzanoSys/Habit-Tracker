"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Define the theme colors
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

type Theme = typeof lightTheme

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  const theme = isDark ? darkTheme : lightTheme

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

