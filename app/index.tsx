"use client"
import { View, ScrollView, StyleSheet, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useTheme } from "../context/ThemeContext"
import { PetAvatar } from "../components/PetAvatar"
import { HabitCard } from "../components/HabitCard"
import { BottomTabBar } from "../components/BottomTabBar"
// Importar el AuthGuard
import { AuthGuard } from "../components/AuthGuard"

// Modificar el componente Home para usar AuthGuard
export default function Home() {
  const { theme } = useTheme()
  const router = useRouter()

  return (
    <AuthGuard>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>HealthyHabits</Text>
          </View>

          <PetAvatar />

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Habits</Text>

          <HabitCard type="water" title="Water Intake" icon="droplet" onPress={() => router.push("/water")} />

          <HabitCard type="exercise" title="Exercise" icon="activity" onPress={() => router.push("/exercise")} />

          <HabitCard type="food" title="Healthy Eating" icon="coffee" onPress={() => router.push("/food")} />
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
})

