import type { T } from "@/messages/types"
import { useState } from "react"
import { authClient } from "@/auth"
import { api } from "@/config/react-provider"
import { formatNumber } from "@/utils/format"
import Decimal from "decimal.js"

export const useFarmFeed = (t: T) => {
  const { data: session } = authClient.useSession()
  const utils = api.useUtils()
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarText, setSnackbarText] = useState("")

  const feed = api.farm.feed.useMutation({
    onSuccess: async (opts) => {
      await utils.farm.myFarmingInfo.invalidate()
      const netRewardsHens = new Decimal(opts.hens.creditedNetRewards).add(new Decimal(opts.hens.endGameRewards))
      const netRewardsCattles = new Decimal(opts.cattles.creditedNetRewards).add(new Decimal(opts.cattles.endGameRewards))
      const rewards =
        `${netRewardsHens.gt(0) ? "🥚 " + formatNumber(netRewardsHens.toString()) : ""} ${netRewardsCattles.gt(0) ? "🥛 " + formatNumber(netRewardsCattles.toString()) : ""}`.trim()
      setSnackbarText(`${t.Common.success} ${rewards}`.trim())
      setSnackbarVisible(true)
    },
  })

  const handleFeed = ({ model }: { model: "hen" | "cattle" | "all" }) => {
    if (!session?.user?.id) return
    setSnackbarText(t.Common.pending)
    setSnackbarVisible(true)
    feed.mutate(
      { userId: session.user.id, model },
      {
        onError: () => {
          setSnackbarText(t.Common.error)
          setSnackbarVisible(true)
        },
      },
    )
  }

  return {
    feed,
    handleFeed,
    snackbarVisible,
    setSnackbarVisible,
    snackbarText,
  }
}
