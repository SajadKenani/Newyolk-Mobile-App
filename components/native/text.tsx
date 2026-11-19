import type { SupportedLang } from "@/hooks/safe-translation"
import type { StyleProp, TextProps, TextStyle } from "react-native"
import React, { useEffect, useState } from "react"
import { Text as RNText } from "react-native"
import { useSafeTranslation } from "@/hooks/safe-translation"

const Text = React.forwardRef<RNText, TextProps & { className?: string; style?: StyleProp<TextStyle> }>(function TextForward(
  { className = "", style, ...props },
  ref,
) {
  const [currentLang, setCurrentLang] = useState<SupportedLang>(useSafeTranslation.getCurrentLanguage())

  useEffect(() => {
    const unsubscribe = useSafeTranslation.subscribe((lang) => {
      setCurrentLang(lang)
    })
    return unsubscribe
  }, [])

  const fontFamily = currentLang === "ar-ae" ? "tajawal" : "sourcecodepro"
  const textAlign: TextStyle["textAlign"] = currentLang === "ar-ae" ? "right" : "left"
  const combinedStyle = [{ fontFamily, textAlign }, style]

  return <RNText ref={ref} className={className} style={combinedStyle} {...props} />
})

export default Text
