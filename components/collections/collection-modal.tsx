import type { T } from "@/messages/types"
import { KeyboardAvoidingView, Modal, Platform, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { LoadingSpinner } from "@/components/helpers/loading"
import { useListingsData } from "@/features/marketplace/hooks/useListingsData"
import ListingsView from "@/features/marketplace/components/listings/listings-view"

interface CollectionModalProps {
  visible: boolean
  onClose: () => void
  collectionName: string
  t: T
}

const CollectionModal = ({ visible, onClose, collectionName, t }: CollectionModalProps) => {
  const { initialCollection, initialFilteredListings, initialSoldListings, initialFloorItem } = useListingsData(collectionName)

  const isLoading = !initialCollection.data || !initialFloorItem.data || !initialFilteredListings.data || !initialSoldListings.data

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <ListingsView
                t={t}
                initialCollection={initialCollection.data}
                initialFilteredListings={initialFilteredListings.data}
                initialSoldListings={initialSoldListings.data}
                initialFloorItem={initialFloorItem.data}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

export default CollectionModal
