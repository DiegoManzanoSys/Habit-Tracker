"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../context/ThemeContext"
import { useHabit, type HabitType } from "../context/HabitContext"
import { BottomTabBar } from "../components/BottomTabBar"
import { PetAvatar } from "../components/PetAvatar"
import * as Haptics from "expo-haptics"

export default function AddHabitScreen() {
  const { theme } = useTheme()
  const { addLog } = useHabit()
  const router = useRouter()
  const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null)

  const habits = [
    {
      type: "water" as HabitType,
      title: "Water Intake",
      icon: "droplet",
      description: "Track your daily water consumption",
      gradient: theme.water,
      options: [
        { label: "Small Glass", value: 250, unit: "ml" },
        { label: "Medium Glass", value: 500, unit: "ml" },
        { label: "Large Glass", value: 750, unit: "ml" },
      ],
    },
    {
      type: "exercise" as HabitType,
      title: "Exercise",
      icon: "activity",
      description: "Log your physical activities",
      gradient: theme.exercise,
      options: [
        { label: "Quick Workout", value: 10, unit: "min" },
        { label: "Medium Session", value: 20, unit: "min" },
        { label: "Full Workout", value: 30, unit: "min" },
      ],
    },
    {
      type: "food" as HabitType,
      title: "Healthy Eating",
      icon: "coffee",
      description: "Track your nutritious meals",
      gradient: theme.food,
      options: [
        { label: "Snack", value: 1, unit: "portion" },
        { label: "Small Meal", value: 2, unit: "portions" },
        { label: "Full Meal", value: 3, unit: "portions" },
      ],
    },
  ]

  const handleSelectHabit = (type: HabitType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedHabit(type)
  }

  const handleAddHabit = (type: HabitType, value: number) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    addLog(type, value)
    setSelectedHabit(null)
    router.push("/")
  }

  const selectedHabitData = habits.find((h) => h.type === selectedHabit)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Add Habit</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.petContainer}>
          <PetAvatar size="small" showInfo={false} />
        </View>

        {!selectedHabit ? (
          <>
            <Text style={[styles.subtitle, { color: theme.text }]}>What habit would you like to track today?</Text>

            {habits.map((habit) => (
              <TouchableOpacity key={habit.type} onPress={() => handleSelectHabit(habit.type)} activeOpacity={0.9}>
                <LinearGradient
                  colors={habit.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.habitCard}
                >
                  <Feather name={habit.icon} size={24} color="white" />
                  <View style={styles.habitInfo}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitDescription}>{habit.description}</Text>
                  </View>
                  <Feather name="chevron-right" size={24} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                onPress={() => setSelectedHabit(null)}
                style={[styles.backButton, { backgroundColor: theme.card }]}
              >
                <Feather name="arrow-left" size={20} color={theme.text} />
                <Text style={[styles.backButtonText, { color: theme.text }]}>Back</Text>
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={selectedHabitData?.gradient || [theme.accent, theme.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.selectedHabitHeader}
            >
              <Feather name={selectedHabitData?.icon || "activity"} size={32} color="white" />
              <Text style={styles.selectedHabitTitle}>{selectedHabitData?.title}</Text>
            </LinearGradient>

            <Text style={[styles.optionsTitle, { color: theme.text }]}>Choose an amount to log:</Text>

            {selectedHabitData?.options.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[styles.optionButton, { backgroundColor: theme.card }]}
                onPress={() => handleAddHabit(selectedHabitData.type, option.value)}
              >
                <Text style={[styles.optionLabel, { color: theme.text }]}>{option.label}</Text>
                <Text style={[styles.optionValue, { color: theme.text }]}>
                  {option.value} {option.unit}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  petContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  habitInfo: {
    flex: 1,
    marginLeft: 12,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  backButtonContainer: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  selectedHabitHeader: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  selectedHabitTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 12,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  optionValue: {
    fontSize: 16,
  },
})

