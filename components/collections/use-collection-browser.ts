import { authClient } from "@/auth/client"
import { api } from "@/config/react-provider"

import type { RouterOutputs } from "@newyolk/api"

type CollectionItem = RouterOutputs["collection"]["read"][number]

interface UseCollectionBrowserResult {
  collections: CollectionItem[] | undefined
  isPending: boolean
  shouldRedirectToSignIn: boolean
}

const useCollectionBrowser = (): UseCollectionBrowserResult => {
  const { data: session } = authClient.useSession()
  const collections = api.collection.read.useQuery({ isTrading: true }, { initialData: undefined })

  return {
    collections: collections.data,
    isPending: collections.isPending,
    shouldRedirectToSignIn: session === null,
  }
}

export { useCollectionBrowser }
