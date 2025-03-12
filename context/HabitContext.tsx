"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { format } from "date-fns"

// Importar las dependencias de Firebase
import { db } from "../firebaseConfig"
import { useAuth } from "./AuthContext"
import { collection, doc, setDoc, getDoc, query, where, getDocs, addDoc, orderBy } from "firebase/firestore"

export type HabitType = "water" | "exercise" | "food"

// Reemplazar la interfaz HabitLog para incluir un ID de Firestore
export interface HabitLog {
  id: string
  type: HabitType
  value: number
  date: string
  timestamp: number
  userId?: string
}

export interface HabitGoal {
  water: number // in ml
  exercise: number // in minutes
  food: number // in portions
}

export interface HabitStreak {
  water: number
  exercise: number
  food: number
}

interface HabitContextType {
  logs: HabitLog[]
  goals: HabitGoal
  streaks: HabitStreak
  addLog: (type: HabitType, value: number) => void
  updateGoal: (type: HabitType, value: number) => void
  getTodayProgress: (type: HabitType) => number
  getWeeklyProgress: (type: HabitType) => number[]
}

const defaultGoals: HabitGoal = {
  water: 2000, // 2000ml (2L)
  exercise: 30, // 30 minutes
  food: 5, // 5 healthy portions
}

const defaultStreaks: HabitStreak = {
  water: 0,
  exercise: 0,
  food: 0,
}

const HabitContext = createContext<HabitContextType | undefined>(undefined)

// Modificar el HabitProvider para usar Firestore
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [goals, setGoals] = useState<HabitGoal>(defaultGoals)
  const [streaks, setStreaks] = useState<HabitStreak>(defaultStreaks)
  const { user } = useAuth()

  // Cargar datos desde Firestore cuando el usuario cambia
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        // Si no hay usuario, usar valores predeterminados
        setLogs([])
        setGoals(defaultGoals)
        setStreaks(defaultStreaks)
        return
      }

      try {
        // Cargar metas
        const goalsDocRef = doc(db, `users/${user.uid}/habitGoals`, "goals")
        const goalsDoc = await getDoc(goalsDocRef)

        if (goalsDoc.exists()) {
          setGoals(goalsDoc.data() as HabitGoal)
        } else {
          // Si no existen, crear con valores predeterminados
          await setDoc(goalsDocRef, defaultGoals)
        }

        // Cargar rachas
        const streaksDocRef = doc(db, `users/${user.uid}/habitStreaks`, "streaks")
        const streaksDoc = await getDoc(streaksDocRef)

        if (streaksDoc.exists()) {
          setStreaks(streaksDoc.data() as HabitStreak)
        } else {
          // Si no existen, crear con valores predeterminados
          await setDoc(streaksDocRef, defaultStreaks)
        }

        // Cargar registros
        const today = new Date()
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(today.getDate() - 7)

        const logsQuery = query(
          collection(db, `users/${user.uid}/habitLogs`),
          where("date", ">=", format(sevenDaysAgo, "yyyy-MM-dd")),
          orderBy("date", "desc"),
        )

        const logsSnapshot = await getDocs(logsQuery)
        const logsData: HabitLog[] = []

        logsSnapshot.forEach((doc) => {
          logsData.push({ id: doc.id, ...doc.data() } as HabitLog)
        })

        setLogs(logsData)
      } catch (error) {
        console.error("Error loading habit data:", error)
      }
    }

    loadData()
  }, [user])

  // Actualizar rachas cuando cambian los registros
  useEffect(() => {
    updateStreaks()
  }, [logs])

  // Modificar la función addLog para usar Firestore
  const addLog = async (type: HabitType, value: number) => {
    if (!user) return

    try {
      const newLog = {
        type,
        value,
        date: format(new Date(), "yyyy-MM-dd"),
        timestamp: Date.now(),
        userId: user.uid,
      }

      const docRef = await addDoc(collection(db, `users/${user.uid}/habitLogs`), newLog)

      setLogs((prevLogs) => [...prevLogs, { ...newLog, id: docRef.id }])
    } catch (error) {
      console.error("Error adding log:", error)
    }
  }

  // Modificar la función updateGoal para usar Firestore
  const updateGoal = async (type: HabitType, value: number) => {
    if (!user) return

    try {
      const newGoals = {
        ...goals,
        [type]: value,
      }

      await setDoc(doc(db, `users/${user.uid}/habitGoals`, "goals"), newGoals)

      setGoals(newGoals)
    } catch (error) {
      console.error("Error updating goal:", error)
    }
  }

  // El resto de las funciones permanecen iguales
  const updateStreaks = () => {
    const today = format(new Date(), "yyyy-MM-dd")
    const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd")

    const todayLogs = logs.filter((log) => log.date === today)
    const yesterdayLogs = logs.filter((log) => log.date === yesterday)

    const newStreaks = { ...streaks }

    // Check each habit type
    ;(["water", "exercise", "food"] as HabitType[]).forEach((type) => {
      const todayTotal = todayLogs.filter((log) => log.type === type).reduce((sum, log) => sum + log.value, 0)

      const yesterdayTotal = yesterdayLogs.filter((log) => log.type === type).reduce((sum, log) => sum + log.value, 0)

      // If today's goal is met, increment streak
      if (todayTotal >= goals[type]) {
        newStreaks[type]++
      }
      // If yesterday's goal wasn't met, reset streak
      else if (yesterdayTotal < goals[type]) {
        newStreaks[type] = 0
      }
    })

    setStreaks(newStreaks)
  }

  const getTodayProgress = (type: HabitType): number => {
    const today = format(new Date(), "yyyy-MM-dd")
    return logs.filter((log) => log.type === type && log.date === today).reduce((sum, log) => sum + log.value, 0)
  }

  const getWeeklyProgress = (type: HabitType): number[] => {
    const result: number[] = [0, 0, 0, 0, 0, 0, 0] // 7 days
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = format(date, "yyyy-MM-dd")

      const dayTotal = logs
        .filter((log) => log.type === type && log.date === dateStr)
        .reduce((sum, log) => sum + log.value, 0)

      result[6 - i] = dayTotal
    }

    return result
  }

  return (
    <HabitContext.Provider
      value={{
        logs,
        goals,
        streaks,
        addLog,
        updateGoal,
        getTodayProgress,
        getWeeklyProgress,
      }}
    >
      {children}
    </HabitContext.Provider>
  )
}

export const useHabit = () => {
  const context = useContext(HabitContext)
  if (context === undefined) {
    throw new Error("useHabit must be used within a HabitProvider")
  }
  return context
}

