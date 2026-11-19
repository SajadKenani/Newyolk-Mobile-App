import { View } from "react-native"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"

const SectionHeader = ({ title }: { title: string }) => {
  const { currentLang } = useSafeTranslation
  const COLORS = useThemeColors()
  return (
    <View style={{ marginBottom: 10, marginTop: 10, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: currentLang === "ar-ae" ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
        <View style={{ width: 26, height: 2, borderRadius: 999, backgroundColor: COLORS.primary[500] + "70" }} />
        <Text
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1.6,
            color: COLORS.zinc[500],
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  )
}

export default SectionHeader
