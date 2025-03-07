"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native"
import { usePet, type PetMood } from "../context/PetContext"
import { useTheme } from "../context/ThemeContext"

// Using emojis to represent different pet moods
const getPetEmoji = (mood: PetMood) => {
  switch (mood) {
    case "happy":
      return "😊"
    case "thirsty":
      return "🥵"
    case "lazy":
      return "😴"
    case "hungry":
      return "🍽️"
    case "sick":
      return "🤒"
    case "dead":
      return "💀"
    default:
      return "😊"
  }
}

interface PetAvatarProps {
  size?: "small" | "medium" | "large"
  showInfo?: boolean
  onPress?: () => void
}

export const PetAvatar: React.FC<PetAvatarProps> = ({ size = "medium", showInfo = true, onPress }) => {
  const { pet, getPetMoodMessage, interact } = usePet()
  const { theme } = useTheme()
  const bounceAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Create a bounce effect
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [pet.mood])

  const getSize = () => {
    switch (size) {
      case "small":
        return 80
      case "medium":
        return 120
      case "large":
        return 200
      default:
        return 120
    }
  }

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 40
      case "medium":
        return 60
      case "large":
        return 100
      default:
        return 60
    }
  }

  const handlePress = () => {
    interact()
    if (onPress) onPress()
  }

  const scale = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  })

  return (
    <View style={[styles.container, { marginBottom: showInfo ? 16 : 0 }]}>
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              width: getSize(),
              height: getSize(),
              transform: [{ scale }],
              backgroundColor: theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        >
          <Text style={[styles.emojiText, { fontSize: getFontSize() }]}>{getPetEmoji(pet.mood)}</Text>
        </Animated.View>
      </TouchableOpacity>

      {showInfo && (
        <View style={styles.infoContainer}>
          <Text style={[styles.petName, { color: theme.text }]}>{pet.name}</Text>
          <Text style={[styles.petLevel, { color: theme.text }]}>Level {pet.level}</Text>
          <Text style={[styles.petMood, { color: theme.text }]}>{getPetMoodMessage()}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  avatarContainer: {
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  emojiText: {
    textAlign: "center",
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  petLevel: {
    fontSize: 14,
    marginBottom: 4,
  },
  petMood: {
    fontSize: 14,
    textAlign: "center",
  },
})

