"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Switch, TextInput, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useHabit, type HabitType } from "../context/HabitContext"
import { usePet } from "../context/PetContext"
import { BottomTabBar } from "../components/BottomTabBar"
import { PetAvatar } from "../components/PetAvatar"
import * as Notifications from "expo-notifications"

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme()
  const { goals, updateGoal } = useHabit()
  const { pet, setPetName } = usePet()

  const [petName, setPetNameInput] = useState(pet.name)
  const [waterGoal, setWaterGoal] = useState(goals.water.toString())
  const [exerciseGoal, setExerciseGoal] = useState(goals.exercise.toString())
  const [foodGoal, setFoodGoal] = useState(goals.food.toString())
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleSaveGoal = (type: HabitType, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      updateGoal(type, numValue)
    }
  }

  const handleSavePetName = () => {
    if (petName.trim()) {
      setPetName(petName.trim())
    }
  }

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value)

    if (value) {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        setNotificationsEnabled(false)
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.petSection}>
          <PetAvatar size="large" showInfo={false} />

          <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Pet Name</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              value={petName}
              onChangeText={setPetNameInput}
              onEndEditing={handleSavePetName}
              placeholder="Enter pet name"
              placeholderTextColor={theme.text + "80"}
            />
          </View>

          <Text style={[styles.petStats, { color: theme.text }]}>
            Level {pet.level} • Mood: {pet.mood.charAt(0).toUpperCase() + pet.mood.slice(1)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Goals</Text>

          <View style={[styles.goalContainer, { backgroundColor: theme.card }]}>
            <View style={styles.goalHeader}>
              <Feather name="droplet" size={20} color={theme.water[0]} />
              <Text style={[styles.goalTitle, { color: theme.text }]}>Water Intake</Text>
            </View>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={[styles.goalInput, { color: theme.text, borderColor: theme.border }]}
                value={waterGoal}
                onChangeText={setWaterGoal}
                onEndEditing={() => handleSaveGoal("water", waterGoal)}
                keyboardType="number-pad"
              />
              <Text style={[styles.goalUnit, { color: theme.text }]}>ml</Text>
            </View>
          </View>

          <View style={[styles.goalContainer, { backgroundColor: theme.card }]}>
            <View style={styles.goalHeader}>
              <Feather name="activity" size={20} color={theme.exercise[0]} />
              <Text style={[styles.goalTitle, { color: theme.text }]}>Exercise</Text>
            </View>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={[styles.goalInput, { color: theme.text, borderColor: theme.border }]}
                value={exerciseGoal}
                onChangeText={setExerciseGoal}
                onEndEditing={() => handleSaveGoal("exercise", exerciseGoal)}
                keyboardType="number-pad"
              />
              <Text style={[styles.goalUnit, { color: theme.text }]}>min</Text>
            </View>
          </View>

          <View style={[styles.goalContainer, { backgroundColor: theme.card }]}>
            <View style={styles.goalHeader}>
              <Feather name="coffee" size={20} color={theme.food[0]} />
              <Text style={[styles.goalTitle, { color: theme.text }]}>Healthy Eating</Text>
            </View>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={[styles.goalInput, { color: theme.text, borderColor: theme.border }]}
                value={foodGoal}
                onChangeText={setFoodGoal}
                onEndEditing={() => handleSaveGoal("food", foodGoal)}
                keyboardType="number-pad"
              />
              <Text style={[styles.goalUnit, { color: theme.text }]}>portions</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>

          <View style={[styles.settingContainer, { backgroundColor: theme.card }]}>
            <View style={styles.settingContent}>
              <Feather name="moon" size={20} color={theme.text} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={isDark ? theme.accent : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingContainer, { backgroundColor: theme.card }]}>
            <View style={styles.settingContent}>
              <Feather name="bell" size={20} color={theme.text} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={notificationsEnabled ? theme.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>

          <View style={[styles.aboutContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.appName, { color: theme.text }]}>HealthyHabits</Text>
            <Text style={[styles.appVersion, { color: theme.text }]}>Version 1.0.0</Text>
            <Text style={[styles.appDescription, { color: theme.text }]}>
              Track your daily habits and stay healthy with your virtual pet companion.
            </Text>
          </View>
        </View>
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
  petSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  inputContainer: {
    width: "80%",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    paddingVertical: 8,
    textAlign: "center",
  },
  petStats: {
    marginTop: 8,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  goalContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  goalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalInput: {
    width: 80,
    borderBottomWidth: 1,
    paddingVertical: 4,
    textAlign: "center",
    fontSize: 16,
  },
  goalUnit: {
    marginLeft: 8,
    fontSize: 16,
  },
  settingContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  aboutContainer: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
})

