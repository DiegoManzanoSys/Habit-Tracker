"use client"

import type React from "react"
import { View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useRouter, usePathname } from "expo-router"
import { useTheme } from "../context/ThemeContext"
import * as Haptics from "expo-haptics"

interface TabBarItem {
  name: string
  icon: React.ComponentProps<typeof Feather>["name"]
  path: string
}

const tabs: TabBarItem[] = [
  { name: "Home", icon: "home", path: "/" },
  { name: "Add", icon: "plus-circle", path: "/add-habit" },
  { name: "Profile", icon: "user", path: "/profile" },
]

export const BottomTabBar: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()

  const handlePress = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push(path)
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path

        return (
          <TouchableOpacity key={tab.name} style={styles.tab} onPress={() => handlePress(tab.path)} activeOpacity={0.7}>
            <View style={styles.tabContent}>
              <Feather name={tab.icon} size={24} color={isActive ? theme.accent : theme.text} />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? theme.accent : theme.text,
                    fontWeight: isActive ? "bold" : "normal",
                  },
                ]}
              >
                {tab.name}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
})

