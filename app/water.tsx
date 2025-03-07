"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { AnimatedCircularProgress } from "react-native-circular-progress"
import { useTheme } from "../context/ThemeContext"
import { useHabit } from "../context/HabitContext"
import { BottomTabBar } from "../components/BottomTabBar"
import { PetAvatar } from "../components/PetAvatar"
import { BarChart } from "react-native-chart-kit"

const WATER_AMOUNTS = [
  { label: "Small", value: 250, icon: "droplet" },
  { label: "Medium", value: 500, icon: "droplet" },
  { label: "Large", value: 750, icon: "droplet" },
]

export default function WaterScreen() {
  const { theme } = useTheme()
  const { getTodayProgress, getWeeklyProgress, goals, addLog, streaks } = useHabit()
  const router = useRouter()
  const [customAmount, setCustomAmount] = useState("")

  const waterProgress = getTodayProgress("water")
  const waterGoal = goals.water
  const percentage = Math.min(Math.round((waterProgress / waterGoal) * 100), 100)
  const weeklyData = getWeeklyProgress("water")

  const handleAddWater = (amount: number) => {
    addLog("water", amount)
  }

  const chartConfig = {
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    color: () => theme.water[0],
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: weeklyData,
      },
    ],
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Water Tracking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.petContainer}>
          <PetAvatar size="small" showInfo={false} />
        </View>

        <LinearGradient colors={theme.water} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.progressCard}>
          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={120}
              width={12}
              fill={percentage}
              tintColor="white"
              backgroundColor="rgba(255, 255, 255, 0.3)"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressValue}>{waterProgress}</Text>
                  <Text style={styles.progressUnit}>ml</Text>
                </View>
              )}
            </AnimatedCircularProgress>

            <View style={styles.goalContainer}>
              <Text style={styles.goalText}>Daily Goal: {waterGoal} ml</Text>
              <Text style={styles.streakText}>Current Streak: {streaks.water} days</Text>
              <Text style={styles.percentageText}>{percentage}% Complete</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Add Water</Text>

        <View style={styles.amountButtonsContainer}>
          {WATER_AMOUNTS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.amountButton, { backgroundColor: theme.card }]}
              onPress={() => handleAddWater(item.value)}
            >
              <Feather name={item.icon} size={24} color={theme.water[0]} />
              <Text style={[styles.amountLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.amountValue, { color: theme.text }]}>{item.value} ml</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Progress</Text>

        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          <BarChart
            data={chartData}
            width={320}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Hydration Tips</Text>

        <View style={[styles.tipsContainer, { backgroundColor: theme.card }]}>
          <View style={styles.tipItem}>
            <Feather name="info" size={20} color={theme.water[0]} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              Drink a glass of water when you wake up to rehydrate after sleep.
            </Text>
          </View>

          <View style={styles.tipItem}>
            <Feather name="info" size={20} color={theme.water[0]} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              Set reminders to drink water throughout the day.
            </Text>
          </View>

          <View style={styles.tipItem}>
            <Feather name="info" size={20} color={theme.water[0]} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              Carry a reusable water bottle with you to make hydration convenient.
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
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
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressTextContainer: {
    alignItems: "center",
  },
  progressValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  progressUnit: {
    fontSize: 16,
    color: "white",
  },
  goalContainer: {
    flex: 1,
    marginLeft: 20,
  },
  goalText: {
    fontSize: 16,
    color: "white",
    marginBottom: 4,
  },
  streakText: {
    fontSize: 16,
    color: "white",
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  amountButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  amountButton: {
    width: "30%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  amountValue: {
    fontSize: 14,
    marginTop: 4,
  },
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  tipsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
})

