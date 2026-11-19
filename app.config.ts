import type { ConfigContext, ExpoConfig } from "expo/config"

const defaultConfig = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "New Yolk",
  slug: "newyolk",
  owner: "newyolk",
  scheme: "newyolk",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/icons/icon.png",
  userInterfaceStyle: "automatic",
  ios: {
    associatedDomains: ["applinks:newyolk.io"],
    bundleIdentifier: "com.newyolk.newyolk",
    supportsTablet: true,
  },
  android: {
    package: "com.newyolk.newyolk",
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "*.newyolk.io",
            pathPrefix: "/api/auth/callback",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  extra: {
    eas: {
      projectId: "ad30dc85-e5ff-4f21-86e1-835c7bd66c37",
    },
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    "expo-localization",
    "@react-native-community/datetimepicker",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#0E0C15",
        image: "./assets/icons/splash.png",
        imageWidth: 200,
      },
    ],
  ],
})

export default defaultConfig
