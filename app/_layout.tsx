"use client"

import { useEffect, useState } from "react"
import { Slot, SplashScreen } from "expo-router"
import { View, Text } from "react-native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Notifications from "expo-notifications"
import * as Font from "expo-font"
import * as FileSystem from "expo-file-system"
import { ThemeProvider } from "../context/ThemeContext"
import { HabitProvider } from "../context/HabitContext"
import { PetProvider } from "../context/PetContext"

const fontsToLoad = {
  "Poppins-Regular": "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf",
  "Poppins-Medium": "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9V1s.ttf",
  "Poppins-Bold": "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf",
}

// Función para descargar la fuente y almacenarla en caché
async function loadRemoteFont(name: string, url: string) {
  const fontPath = `${FileSystem.cacheDirectory}${name}.ttf`
  
  // Verificar si la fuente ya existe en caché
  const fileInfo = await FileSystem.getInfoAsync(fontPath)
  if (!fileInfo.exists) {
    console.log(`Descargando fuente: ${name}`)
    const downloadedFont = await FileSystem.downloadAsync(url, fontPath)
    if (downloadedFont.status !== 200) {
      throw new Error(`No se pudo descargar la fuente ${name}`)
    }
  }

  return fontPath
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    async function loadFonts() {
      try {
        const fontAssets = await Promise.all(
          Object.entries(fontsToLoad).map(async ([name, url]) => {
            const fontPath = await loadRemoteFont(name, url)
            return [name, { uri: fontPath }]
          })
        )

        // Cargar las fuentes en expo-font
        await Font.loadAsync(Object.fromEntries(fontAssets))
        setFontsLoaded(true)
      } catch (error) {
        console.error("Error cargando fuentes:", error)
      }
    }

    loadFonts()
    Notifications.requestPermissionsAsync()
  }, [])

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <HabitProvider>
            <PetProvider>
              <StatusBar style="auto" />
              <Slot />
            </PetProvider>
          </HabitProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
