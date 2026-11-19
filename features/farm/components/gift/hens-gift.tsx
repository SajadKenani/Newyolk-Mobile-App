import { useEffect, useRef, useState } from "react"
import { Animated, Pressable, StyleSheet, useWindowDimensions, View } from "react-native"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import Text from "@/components/native/text"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { getGiftImageSource } from "@/utils/local-asset-image"

import { OpenGift } from "./open-gift"

export const HensGift = () => {
  const { width } = useWindowDimensions()
  const { t, currentLang } = useSafeTranslation

  // Animation values
  const cardScale = useRef(new Animated.Value(1)).current
  const cardRotateY = useRef(new Animated.Value(0)).current
  const shimmerAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const glowAnim = useRef(new Animated.Value(0)).current
  const floatAnim = useRef(new Animated.Value(0)).current

  const [particleAnims] = useState(() =>
    Array.from({ length: 12 }, () => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
    })),
  )

  useEffect(() => {
    // Continuous shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [floatAnim, glowAnim, pulseAnim, shimmerAnim])

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.spring(cardRotateY, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
    ]).start()
  }

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.spring(cardRotateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
    ]).start()

    triggerParticles()
  }

  const triggerParticles = () => {
    particleAnims.forEach((anim, index) => {
      const randomX = (Math.random() - 0.5) * 200
      const delay = index * 50

      Animated.parallel([
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim.translateY, {
            toValue: -100 - Math.random() * 50,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim.translateX, {
            toValue: randomX,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        anim.translateY.setValue(0)
        anim.translateX.setValue(0)
        anim.opacity.setValue(0)
      })
    })
  }

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  })

  const rotateY = cardRotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "2deg"],
  })

  const styles = Style(currentLang)

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: Animated.multiply(cardScale, pulseAnim) }, { perspective: 1000 }, { rotateY }, { translateY: floatAnim }],
        },
      ]}
    >
      {/* Particles */}
      {particleAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              opacity: anim.opacity,
              transform: [{ translateY: anim.translateY }, { translateX: anim.translateX }],
            },
          ]}
        >
          <Text style={styles.particleText}>✨</Text>
        </Animated.View>
      ))}

      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ width: "100%" }}>
        {/* Main Card */}
        <View style={styles.card}>
          {/* Gradient Background */}
          <LinearGradient colors={["#1a1a2e", "#16162a", "#0f0f1e"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          {/* Shimmer effect */}
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: shimmerTranslateX }],
              },
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255, 215, 0, 0.1)", "rgba(255, 215, 0, 0.2)", "rgba(255, 215, 0, 0.1)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>

          {/* Border gradient overlay */}
          <View style={styles.borderGradient}>
            <LinearGradient
              colors={["rgba(255, 215, 0, 0.3)", "rgba(255, 165, 0, 0.2)", "rgba(255, 215, 0, 0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.borderGradientInner}
            />
          </View>

          {/* Content Container */}
          <View style={styles.contentWrapper}>
            {/* Left side - Gift Image */}
            <View style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                {/* Animated border */}
                <Animated.View style={styles.imageBorderAnimation}>
                  <LinearGradient colors={["#FFD700", "#FFA500", "#FFD700"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                </Animated.View>

                <Image source={getGiftImageSource()} style={styles.giftImage} />
                {/* Sparkle effects */}
                <View style={[styles.sparkle, styles.sparkle1]}>
                  <Text style={styles.sparkleText}>✨</Text>
                </View>
                <View style={[styles.sparkle, styles.sparkle2]}>
                  <Text style={styles.sparkleText}>✨</Text>
                </View>
                <View style={[styles.sparkle, styles.sparkle3]}>
                  <Text style={styles.sparkleText}>⭐</Text>
                </View>
              </View>
            </View>

            {/* Center - Text Content */}
            <View style={styles.textContent}>
              <View style={styles.textTop}>
                <Text style={styles.title}>{String(t.Farm.gift.title)}</Text>
                <View style={styles.availableBadge}>
                  <LinearGradient
                    colors={["rgba(34, 197, 94, 0.2)", "rgba(34, 197, 94, 0.1)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.badgeGradient}
                  />
                  <View style={styles.statusDot} />
                  <Text style={styles.availableText}>{String(t.Farm.gift.available)}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <OpenGift />
              </View>
            </View>
          </View>

          {/* Decorative corner elements */}
          <View style={[styles.cornerDecor, styles.cornerTopLeft]} />
          <View style={[styles.cornerDecor, styles.cornerTopRight]} />
          <View style={[styles.cornerDecor, styles.cornerBottomLeft]} />
          <View style={[styles.cornerDecor, styles.cornerBottomRight]} />
        </View>
      </Pressable>
    </Animated.View>
  )
}

const Style = (currentLang: string) => {
  return StyleSheet.create({
    container: {
      width: "100%",
      position: "relative",
    },
    glowBackground: {
      position: "absolute",
      top: -20,
      left: -20,
      right: -20,
      bottom: -20,
      borderRadius: 40,
      opacity: 0.3,
    },
    card: {
      width: "100%",
      borderRadius: 24,
      overflow: "hidden",
      position: "relative",
      borderWidth: 1,
      borderColor: "rgba(255, 215, 0, 0.2)",
      shadowColor: "#FFD700",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 30,
      elevation: 20,
    },
    shimmer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
    },
    borderGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 1,
      borderRadius: 24,
      overflow: "hidden",
    },
    borderGradientInner: {
      flex: 1,
      borderRadius: 23,
    },
    contentWrapper: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      gap: 16,
      position: "relative",
      zIndex: 1,
    },
    imageContainer: {
      position: "relative",
    },
    imageWrapper: {
      width: 140,
      height: 140,
      borderRadius: 14,
      marginHorizontal: 8,
      position: "relative",
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    giftImage: {
      width: "100%",
      height: "100%",
    },
    imageBorderAnimation: {
      position: "absolute",
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: 30,
      opacity: 0.4,
    },
    giftEmoji: {
      fontSize: 56,
      zIndex: 2,
    },
    sparkle: {
      position: "absolute",
      zIndex: 3,
    },
    sparkle1: {
      top: 8,
      right: 8,
    },
    sparkle2: {
      bottom: 12,
      left: 8,
    },
    sparkle3: {
      top: 12,
      left: 12,
    },
    sparkleText: {
      fontSize: 16,
      textShadowColor: "#FFD700",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },
    textContent: {
      flex: 1,
      gap: 12,
    },
    textTop: {
      gap: 8,
    },
    title: {
      fontSize: 20,
      color: "#FFFFFF",
      letterSpacing: -0.5,
      textShadowColor: "rgba(255, 215, 0, 0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
      marginRight: 12,
    },
    availableBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: currentLang === "ar-ae" ? "flex-end" : "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 10,
      borderRadius: 20,
      overflow: "hidden",
      gap: 6,
      borderWidth: 1,
      borderColor: "rgba(34, 197, 94, 0.3)",
    },
    badgeGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#22c55e",
      shadowColor: "#22c55e",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
    },
    availableText: {
      fontSize: 12,
      color: "#22c55e",
      letterSpacing: 0.3,
    },
    actions: {
      marginTop: 4,
    },
    decorativeIcon: {
      width: 70,
      height: 70,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",
    },
    iconBackground: {
      ...StyleSheet.absoluteFillObject,
    },
    largeGiftIcon: {
      fontSize: 36,
      zIndex: 1,
    },
    cornerDecor: {
      position: "absolute",
      width: 20,
      height: 20,
      borderColor: "rgba(255, 215, 0, 0.3)",
      borderWidth: 1.5,
    },
    cornerTopLeft: {
      top: 12,
      left: 12,
      borderBottomWidth: 0,
      borderRightWidth: 0,
      borderTopLeftRadius: 8,
    },
    cornerTopRight: {
      top: 12,
      right: 12,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderTopRightRadius: 8,
    },
    cornerBottomLeft: {
      bottom: 12,
      left: 12,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomLeftRadius: 8,
    },
    cornerBottomRight: {
      bottom: 12,
      right: 12,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderBottomRightRadius: 8,
    },
    particle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      zIndex: 100,
    },
    particleText: {
      fontSize: 20,
    },
  })
}
