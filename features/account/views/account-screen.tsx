import AccountForm from "@/features/account/components/account-form"
import Header from "@/components/helpers/header"
import { LoadingSpinner } from "@/components/helpers/loading"
import { authClient } from "@/auth/client"
import { api } from "@/config/react-provider"
import { useScrollChrome } from "@/hooks/useScrollChrome"
import { useSafeTranslation } from "@/hooks/safe-translation"

const AccountScreen = () => {
  const { data: session } = authClient.useSession()
  useScrollChrome({ hideOnScroll: false })
  const { t } = useSafeTranslation
  const accountTitle = String(t.Settings.account.title)

  const { data: userInfo } = api.user.me.useQuery(undefined, {
    enabled: !!session?.user?.id,
    retry: false,
  })

  return (
    <>
      <Header showBackButton title={accountTitle} showMenuButton={true} transparent />
      {userInfo ? <AccountForm me={userInfo} /> : <LoadingSpinner />}
    </>
  )
}

export default AccountScreen
