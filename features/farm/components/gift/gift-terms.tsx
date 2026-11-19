import React from "react"
import { I18nManager, ScrollView, TouchableOpacity, View } from "react-native"
import { Button, Checkbox } from "react-native-paper"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import { giftTermsStyles } from "../utils/styles"

const GiftTerms = () => {
  const [isChecked, setIsChecked] = React.useState<boolean | "indeterminate">(false)
  const utils = api.useUtils()
  const isRTL = I18nManager.isRTL
  const { t } = useSafeTranslation
  const COLORS = useThemeColors()

  const acceptTerms = api.user.acceptTerms.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate()
      await utils.farmingCondition.getCurrent.invalidate()
    },
  })

  const handleAcceptTerms = async () => {
    if (isChecked) {
      try {
        await acceptTerms.mutateAsync()
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
        }
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={giftTermsStyles.container} showsVerticalScrollIndicator={false}>
      <View style={giftTermsStyles.section}>
        <View style={giftTermsStyles.headerBlock}>
          <Text style={giftTermsStyles.title}>{String(t.Farm.gift.terms.title)}</Text>
          <View>
            <View style={isRTL ? giftTermsStyles.bulletsRTL : giftTermsStyles.bulletsLTR}>
              {(() => {
                const elements: React.ReactNode[] = []
                const list = t.Farm.gift.terms.list
                for (let i = 1; i < 5; i++) {
                  elements.push(
                    <Text key={i} style={giftTermsStyles.bulletText}>
                      • {list[i]}
                    </Text>,
                  )
                }
                return elements
              })()}
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setIsChecked((prev) => (prev === true ? false : true))} style={giftTermsStyles.acceptRow}>
        <Checkbox
          status={isChecked === true ? "checked" : isChecked === "indeterminate" ? "indeterminate" : "unchecked"}
          onPress={() => setIsChecked((prev) => (prev === true ? false : true))}
        />
        <View style={giftTermsStyles.acceptTextBlock}>
          <Text style={giftTermsStyles.acceptTitle}>{String(t.Farm.gift.terms.accept)}</Text>
          <Text style={[giftTermsStyles.acceptSubtitle, { color: COLORS.zinc[500] }]}>{String(t.Farm.gift.terms.agree)}</Text>
        </View>
      </TouchableOpacity>
      <Button mode="contained" disabled={!isChecked} onPress={handleAcceptTerms}>
        <Text style={giftTermsStyles.buttonLabel}>{t.Farm.gift.terms.button}</Text>
      </Button>
    </ScrollView>
  )
}

export default GiftTerms
