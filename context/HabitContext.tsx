"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { format } from "date-fns"

export type HabitType = "water" | "exercise" | "food"

export interface HabitLog {
  id: string
  type: HabitType
  value: number
  date: string
  timestamp: number
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

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [goals, setGoals] = useState<HabitGoal>(defaultGoals)
  const [streaks, setStreaks] = useState<HabitStreak>(defaultStreaks)

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem("habitLogs")
        const storedGoals = await AsyncStorage.getItem("habitGoals")
        const storedStreaks = await AsyncStorage.getItem("habitStreaks")

        if (storedLogs) setLogs(JSON.parse(storedLogs))
        if (storedGoals) setGoals(JSON.parse(storedGoals))
        if (storedStreaks) setStreaks(JSON.parse(storedStreaks))
      } catch (error) {
        console.error("Error loading habit data:", error)
      }
    }

    loadData()
  }, [])

  // Save data to storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("habitLogs", JSON.stringify(logs))
        await AsyncStorage.setItem("habitGoals", JSON.stringify(goals))
        await AsyncStorage.setItem("habitStreaks", JSON.stringify(streaks))
      } catch (error) {
        console.error("Error saving habit data:", error)
      }
    }

    saveData()
  }, [logs, goals, streaks])

  // Update streaks whenever logs change
  useEffect(() => {
    updateStreaks()
  }, [logs])

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

  const addLog = (type: HabitType, value: number) => {
    const newLog: HabitLog = {
      id: Date.now().toString(),
      type,
      value,
      date: format(new Date(), "yyyy-MM-dd"),
      timestamp: Date.now(),
    }

    setLogs((prevLogs) => [...prevLogs, newLog])
  }

  const updateGoal = (type: HabitType, value: number) => {
    setGoals((prevGoals) => ({
      ...prevGoals,
      [type]: value,
    }))
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

