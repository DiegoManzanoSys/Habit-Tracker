import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { AnimatedCircularProgress } from "react-native-circular-progress"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { type HabitType, useHabit } from "../context/HabitContext"

interface HabitCardProps {
  type: HabitType
  title: string
  icon: React.ComponentProps<typeof Feather>["name"]
  onPress: () => void
}

export const HabitCard: React.FC<HabitCardProps> = ({ type, title, icon, onPress }) => {
  const { theme } = useTheme()
  const { getTodayProgress, goals, streaks } = useHabit()

  const progress = getTodayProgress(type)
  const goal = goals[type]
  const percentage = Math.min(Math.round((progress / goal) * 100), 100)
  const streak = streaks[type]

  const getGradientColors = () => {
    switch (type) {
      case "water":
        return theme.water
      case "exercise":
        return theme.exercise
      case "food":
        return theme.food
      default:
        return [theme.accent, theme.accent]
    }
  }

  const getUnit = () => {
    switch (type) {
      case "water":
        return "ml"
      case "exercise":
        return "min"
      case "food":
        return "portions"
      default:
        return ""
    }
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient colors={getGradientColors()} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Feather name={icon} size={24} color="white" />
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.progressRow}>
            <AnimatedCircularProgress
              size={70}
              width={8}
              fill={percentage}
              tintColor="white"
              backgroundColor="rgba(255, 255, 255, 0.3)"
              rotation={0}
              lineCap="round"
            >
              {() => <Text style={styles.percentageText}>{percentage}%</Text>}
            </AnimatedCircularProgress>

            <View style={styles.statsContainer}>
              <Text style={styles.progressText}>
                {progress} / {goal} {getUnit()}
              </Text>
              <View style={styles.streakContainer}>
                <Feather name="zap" size={16} color="white" />
                <Text style={styles.streakText}>{streak} day streak</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  statsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  progressText: {
    fontSize: 16,
    color: "white",
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: 14,
    color: "white",
    marginLeft: 4,
  },
})

