"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useHabit } from "./HabitContext"

export type PetMood = "happy" | "thirsty" | "lazy" | "hungry" | "sick" | "dead"

interface PetState {
  name: string
  mood: PetMood
  level: number
  experience: number
  lastInteraction: number
}

interface PetContextType {
  pet: PetState
  setPetName: (name: string) => void
  interact: () => void
  getPetMoodMessage: () => string
}

const initialPetState: PetState = {
  name: "Buddy",
  mood: "happy",
  level: 1,
  experience: 0,
  lastInteraction: Date.now(),
}

const PetContext = createContext<PetContextType | undefined>(undefined)

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pet, setPet] = useState<PetState>(initialPetState)
  const { streaks, goals, getTodayProgress } = useHabit()

  // Load pet data from storage on mount
  useEffect(() => {
    const loadPet = async () => {
      try {
        const storedPet = await AsyncStorage.getItem("pet")
        if (storedPet) setPet(JSON.parse(storedPet))
      } catch (error) {
        console.error("Error loading pet data:", error)
      }
    }

    loadPet()
  }, [])

  // Save pet data to storage whenever it changes
  useEffect(() => {
    const savePet = async () => {
      try {
        await AsyncStorage.setItem("pet", JSON.stringify(pet))
      } catch (error) {
        console.error("Error saving pet data:", error)
      }
    }

    savePet()
  }, [pet])

  // Update pet mood based on habit streaks
  useEffect(() => {
    updatePetMood()
  }, [streaks])

  const updatePetMood = () => {
    const waterProgress = getTodayProgress("water") / goals.water
    const exerciseProgress = getTodayProgress("exercise") / goals.exercise
    const foodProgress = getTodayProgress("food") / goals.food

    let newMood: PetMood = "happy"

    // All streaks at zero
    if (streaks.water === 0 && streaks.exercise === 0 && streaks.food === 0) {
      newMood = "dead"
    }
    // Multiple low streaks
    else if (
      (streaks.water === 0 && streaks.exercise === 0) ||
      (streaks.water === 0 && streaks.food === 0) ||
      (streaks.exercise === 0 && streaks.food === 0)
    ) {
      newMood = "sick"
    }
    // Individual low streaks
    else if (streaks.water === 0 || waterProgress < 0.5) {
      newMood = "thirsty"
    } else if (streaks.exercise === 0 || exerciseProgress < 0.5) {
      newMood = "lazy"
    } else if (streaks.food === 0 || foodProgress < 0.5) {
      newMood = "hungry"
    }

    setPet((prev) => ({
      ...prev,
      mood: newMood,
    }))
  }

  const setPetName = (name: string) => {
    setPet((prev) => ({
      ...prev,
      name,
    }))
  }

  const interact = () => {
    // Add experience when interacting with pet
    const newExperience = pet.experience + 10
    const experienceNeeded = pet.level * 100

    let newLevel = pet.level
    if (newExperience >= experienceNeeded) {
      newLevel += 1
    }

    setPet((prev) => ({
      ...prev,
      experience: newExperience % experienceNeeded,
      level: newLevel,
      lastInteraction: Date.now(),
    }))
  }

  const getPetMoodMessage = (): string => {
    switch (pet.mood) {
      case "happy":
        return `${pet.name} is happy and healthy!`
      case "thirsty":
        return `${pet.name} is thirsty. Try drinking more water!`
      case "lazy":
        return `${pet.name} is feeling lazy. Time for some exercise!`
      case "hungry":
        return `${pet.name} is hungry. Eat some healthy food!`
      case "sick":
        return `${pet.name} is sick. Take care of your habits!`
      case "dead":
        return `${pet.name} is not doing well. Restart your habits!`
      default:
        return `${pet.name} is waiting for you!`
    }
  }

  return (
    <PetContext.Provider
      value={{
        pet,
        setPetName,
        interact,
        getPetMoodMessage,
      }}
    >
      {children}
    </PetContext.Provider>
  )
}

export const usePet = () => {
  const context = useContext(PetContext)
  if (context === undefined) {
    throw new Error("usePet must be used within a PetProvider")
  }
  return context
}

