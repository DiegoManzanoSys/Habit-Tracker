"use client"
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
import { LineChart } from "react-native-chart-kit"
// Importar el AuthGuard
import { AuthGuard } from "../components/AuthGuard"

const EXERCISE_TYPES = [
  { label: "Walking", value: 10, icon: "navigation", calories: 40 },
  { label: "Running", value: 10, icon: "zap", calories: 100 },
  { label: "Cycling", value: 10, icon: "activity", calories: 70 },
  { label: "Swimming", value: 10, icon: "droplet", calories: 90 },
  { label: "Yoga", value: 10, icon: "sun", calories: 50 },
  { label: "Strength", value: 10, icon: "trending-up", calories: 80 },
]

export default function ExerciseScreen() {
  const { theme } = useTheme()
  const { getTodayProgress, getWeeklyProgress, goals, addLog, streaks } = useHabit()
  const router = useRouter()

  const exerciseProgress = getTodayProgress("exercise")
  const exerciseGoal = goals.exercise
  const percentage = Math.min(Math.round((exerciseProgress / exerciseGoal) * 100), 100)
  const weeklyData = getWeeklyProgress("exercise")

  const handleAddExercise = (minutes: number) => {
    addLog("exercise", minutes)
  }

  const chartConfig = {
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    color: () => theme.exercise[0],
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: weeklyData,
        color: () => theme.exercise[0],
        strokeWidth: 2,
      },
    ],
    legend: ["Exercise Minutes"],
  }

  return (
    <AuthGuard>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Exercise Tracking</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.petContainer}>
            <PetAvatar size="small" showInfo={false} />
          </View>

          <LinearGradient
            colors={theme.exercise}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressCard}
          >
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
                    <Text style={styles.progressValue}>{exerciseProgress}</Text>
                    <Text style={styles.progressUnit}>min</Text>
                  </View>
                )}
              </AnimatedCircularProgress>

              <View style={styles.goalContainer}>
                <Text style={styles.goalText}>Daily Goal: {exerciseGoal} min</Text>
                <Text style={styles.streakText}>Current Streak: {streaks.exercise} days</Text>
                <Text style={styles.percentageText}>{percentage}% Complete</Text>
              </View>
            </View>
          </LinearGradient>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Add Exercise</Text>

          <View style={styles.exerciseGrid}>
            {EXERCISE_TYPES.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.exerciseButton, { backgroundColor: theme.card }]}
                onPress={() => handleAddExercise(item.value)}
              >
                <Feather name={item.icon} size={24} color={theme.exercise[0]} />
                <Text style={[styles.exerciseLabel, { color: theme.text }]}>{item.label}</Text>
                <Text style={[styles.exerciseValue, { color: theme.text }]}>
                  {item.value} min ({item.calories} cal)
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Progress</Text>

          <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
            <LineChart
              data={chartData}
              width={320}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
            />
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercise Tips</Text>

          <View style={[styles.tipsContainer, { backgroundColor: theme.card }]}>
            <View style={styles.tipItem}>
              <Feather name="info" size={20} color={theme.exercise[0]} style={styles.tipIcon} />
              <Text style={[styles.tipText, { color: theme.text }]}>
                Start with short sessions and gradually increase duration.
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Feather name="info" size={20} color={theme.exercise[0]} style={styles.tipIcon} />
              <Text style={[styles.tipText, { color: theme.text }]}>
                Mix cardio and strength training for optimal health benefits.
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Feather name="info" size={20} color={theme.exercise[0]} style={styles.tipIcon} />
              <Text style={[styles.tipText, { color: theme.text }]}>
                Remember to warm up before and cool down after exercise.
              </Text>
            </View>
          </View>
        </ScrollView>

        <BottomTabBar />
      </SafeAreaView>
    </AuthGuard>
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
  exerciseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  exerciseButton: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  exerciseValue: {
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

