import { Modal, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import AssetsModalScreen from "@/features/assets/views/assets-modal-screen"

interface AssetsModalProps {
  visible: boolean
  onClose: () => void
  collectionName: string
}

const AssetsModal = ({ visible, onClose, collectionName }: AssetsModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <AssetsModalScreen name={collectionName} onClose={onClose} />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
})

export default AssetsModal
