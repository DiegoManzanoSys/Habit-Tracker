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
import { BarChart } from "react-native-chart-kit"

const FOOD_CATEGORIES = [
  { label: "Fruits", value: 1, icon: "apple", calories: 80 },
  { label: "Vegetables", value: 1, icon: "coffee", calories: 50 },
  { label: "Proteins", value: 1, icon: "box", calories: 150 },
  { label: "Grains", value: 1, icon: "circle", calories: 120 },
  { label: "Dairy", value: 1, icon: "droplet", calories: 100 },
  { label: "Nuts", value: 1, icon: "hexagon", calories: 170 },
]

export default function FoodScreen() {
  const { theme } = useTheme()
  const { getTodayProgress, getWeeklyProgress, goals, addLog, streaks } = useHabit()
  const router = useRouter()

  const foodProgress = getTodayProgress("food")
  const foodGoal = goals.food
  const percentage = Math.min(Math.round((foodProgress / foodGoal) * 100), 100)
  const weeklyData = getWeeklyProgress("food")

  const handleAddFood = (portions: number) => {
    addLog("food", portions)
  }

  const chartConfig = {
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    color: () => theme.food[0],
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
        <Text style={[styles.title, { color: theme.text }]}>Healthy Eating</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.petContainer}>
          <PetAvatar size="small" showInfo={false} />
        </View>

        <LinearGradient colors={theme.food} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.progressCard}>
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
                  <Text style={styles.progressValue}>{foodProgress}</Text>
                  <Text style={styles.progressUnit}>portions</Text>
                </View>
              )}
            </AnimatedCircularProgress>

            <View style={styles.goalContainer}>
              <Text style={styles.goalText}>Daily Goal: {foodGoal} portions</Text>
              <Text style={styles.streakText}>Current Streak: {streaks.food} days</Text>
              <Text style={styles.percentageText}>{percentage}% Complete</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Add Healthy Food</Text>

        <View style={styles.foodGrid}>
          {FOOD_CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.foodButton, { backgroundColor: theme.card }]}
              onPress={() => handleAddFood(item.value)}
            >
              <Feather name={item.icon} size={24} color={theme.food[0]} />
              <Text style={[styles.foodLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.foodValue, { color: theme.text }]}>
                {item.value} portion ({item.calories} cal)
              </Text>
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

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Nutrition Tips</Text>

        <View style={[styles.tipsContainer, { backgroundColor: theme.card }]}>
          <View style={styles.tipItem}>
            <Feather name="info" size={20} color={theme.food[0]} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              Aim for at least 5 portions of fruits and vegetables daily.
            </Text>
          </View>

          <View style={styles.tipItem}>
            <Feather name="info" size={20} color={theme.food[0]} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              Choose whole grains over refined grains for more nutrients and fiber.
            </Text>
          </View>

          <View style={styles.tipItem}>
            <Feather name="info" size={20} color={theme.food[0]} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              Include lean proteins and healthy fats in your meals for balanced nutrition.
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
  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  foodButton: {
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
  foodLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  foodValue: {
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

