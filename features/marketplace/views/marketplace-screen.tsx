import { Redirect } from "expo-router"
import CollectionCard from "@/components/collections/collection-card"
import CollectionGrid from "@/components/collections/collection-grid"
import { useCollectionBrowser } from "@/components/collections/use-collection-browser"
import Header from "@/components/helpers/header"
import { ExpoRoutes } from "@/config/routes"
import { useSafeTranslation } from "@/hooks/safe-translation"

const MarketplaceScreen = () => {
  const { t } = useSafeTranslation
  const { collections, isPending, shouldRedirectToSignIn } = useCollectionBrowser()

  if (shouldRedirectToSignIn) return <Redirect href={ExpoRoutes.auth.signIn} />

  return (
    <>
      <Header showBackButton showMenuButton transparent title={t.Marketplace.title} />
      <CollectionGrid
        collections={collections}
        isPending={isPending}
        hideChromeOnScroll={false}
        renderCollectionCard={(item, index) => <CollectionCard item={item} key={item.id + index} from="marketplace" />}
      />
    </>
  )
}

export default MarketplaceScreen
