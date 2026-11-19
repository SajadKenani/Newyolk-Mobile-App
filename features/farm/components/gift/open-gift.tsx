import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Dialog, Portal } from "react-native-paper"
import Text from "@/components/native/text"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import GiftCarousel from "./gift-carousel"
import GiftTerms from "./gift-terms"

export const OpenGift = () => {
  const [open, setOpen] = React.useState(false)
  const { data: me } = api.user.me.useQuery()
  const { t } = useSafeTranslation
  const handleDismiss = () => setOpen(false)

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => setOpen(true)} style={styles.openButton} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
        <Text> {t.Farm.gift.button} </Text>
      </Button>

      <Portal>
        <Dialog visible={open} onDismiss={handleDismiss} style={styles.dialog}>
          <View style={styles.dialogTitle}>
            <Text style={styles.titleText}>{t.Farm.gift.title}</Text>
            <Text style={styles.openText}>{t.Farm.gift.open}</Text>
          </View>

          <Dialog.Content style={styles.dialogContent}>
            <View style={styles.termsContainer}>{me?.acceptedGiftTermsAt ? <GiftCarousel /> : <GiftTerms />}</View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  openButton: {
    minWidth: "100%",
    height: 42,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    paddingHorizontal: 16,
  },
  buttonLabel: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  dialog: {
    borderRadius: 16,
    alignSelf: "center",
  },
  dialogTitle: {
    paddingTop: 24,
    paddingBottom: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },
  dialogContent: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  openText: {
    color: "#E0E0E0",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  descriptionBlock: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  descriptionText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  termsContainer: {
    marginTop: 12,
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  closeButton: {
    minWidth: 100,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  closeButtonLabel: {
    fontSize: 15,
  },
})
