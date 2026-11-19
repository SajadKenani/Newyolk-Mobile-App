import { defineConfig } from "eslint/config"

import { baseConfig } from "@newyolk/eslint-config/base"
import { reactConfig } from "@newyolk/eslint-config/react"

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
)
