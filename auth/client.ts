import { Platform } from "react-native"
import * as SecureStore from "expo-secure-store"
import { expoClient } from "@better-auth/expo/client"
import { emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { getBaseUrl } from "@/utils/base-url"

const isWeb = Platform.OS === "web"

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  disableDefaultFetchPlugins: !isWeb,
  plugins: [
    ...(!isWeb
      ? [
          expoClient({
            scheme: "newyolk",
            storagePrefix: "newyolk",
            storage: SecureStore,
          }),
        ]
      : []),
    emailOTPClient(),
  ],
})
