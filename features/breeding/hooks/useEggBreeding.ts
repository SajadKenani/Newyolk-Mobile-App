import { authClient } from "@/auth/client"
import { useCallback, useMemo, useState } from "react"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import type { RouterOutputs } from "@/config/react-provider"
import { toast } from "react-toastify"
import { getEggStatus } from "@/features/breeding/components/utils/helper"

export function useEggBreeding(now: number, initialFarmingCondition: RouterOutputs["farmingCondition"]["getCurrent"] | null) {
  const { t } = useSafeTranslation
  const { data: session } = authClient.useSession()
  const utils = api.useUtils()

  // â”€â”€ Queries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const initialHatchingEggs = api.collection.infiniteItemsByName.useQuery({
    name: "hatchingEgg",
    limit: 50,
    direction: "forward",
  })
  const initialIncubatingEggs = api.collection.infiniteItemsByName.useQuery({
    name: "incubatingEgg",
    limit: 50,
    direction: "forward",
  })

  const hatchingEggs = api.collection.infiniteItemsByName.useInfiniteQuery(
    { name: "hatchingEgg", limit: 50 },
    {
      enabled: session?.user.id !== undefined,
      initialData: initialHatchingEggs.data ? { pages: [initialHatchingEggs.data], pageParams: [null] } : undefined,
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const incubatingEggs = api.collection.infiniteItemsByName.useInfiniteQuery(
    { name: "incubatingEgg", limit: 50 },
    {
      enabled: session?.user.id !== undefined,
      initialData: initialIncubatingEggs.data ? { pages: [initialIncubatingEggs.data], pageParams: [null] } : undefined,
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const allEggItems = useMemo(
    () => [...(hatchingEggs.data?.pages.flatMap((p) => p.items) ?? []), ...(incubatingEggs.data?.pages.flatMap((p) => p.items) ?? [])],
    [hatchingEggs.data, incubatingEggs.data],
  )

  const eggsLoading = !hatchingEggs.data && !incubatingEggs.data

  // â”€â”€ Local state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const [selectedEggItems, setSelectedEggItems] = useState<string[]>([])
  const [eggLoadingIds, setEggLoadingIds] = useState<Set<string>>(new Set())

  const toggleEggSelect = useCallback((id: string) => {
    setSelectedEggItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  // â”€â”€ Mutations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const incubateMutation = api.egg.incubate.useMutation({
    onSuccess: async (result) => {
      setSelectedEggItems([])
      await utils.collection.infiniteItemsByName.invalidate()
      await utils.farm.myYolkBalance.invalidate()
      if (result.skipped > 0) {
        toast.info(t.Breeding.egg.toasts.incubateSkipped.replace("{count}", String(result.skipped)))
      }
    },
  })

  const hatchMutation = api.egg.hatch.useMutation({
    onSuccess: async () => {
      setSelectedEggItems([])
      await utils.collection.infiniteItemsByName.invalidate()
      await utils.farm.myYolkBalance.invalidate()
    },
  })

  // â”€â”€ Derived state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const hatchingTimeInMs = initialFarmingCondition?.hatchingTimeInMs.toString() ?? ""
  const hatchingEggExpiryInMs = initialFarmingCondition?.hatchingEggExpiryInMs.toString() ?? ""

  const eggStats = useMemo(() => {
    if (!hatchingTimeInMs) return { idle: 0, incubating: 0, ready: 0 }
    return allEggItems.reduce(
      (acc, item) => {
        const status = getEggStatus(item, hatchingTimeInMs, now)
        acc[status]++
        return acc
      },
      { idle: 0, incubating: 0, ready: 0 },
    )
  }, [allEggItems, now, hatchingTimeInMs])

  const idleEggItems = useMemo(
    () => (hatchingTimeInMs ? allEggItems.filter((item) => getEggStatus(item, hatchingTimeInMs, now) === "idle") : []),
    [allEggItems, hatchingTimeInMs, now],
  )

  const readyEggItems = useMemo(
    () => (hatchingTimeInMs ? allEggItems.filter((item) => getEggStatus(item, hatchingTimeInMs, now) === "ready") : []),
    [allEggItems, hatchingTimeInMs, now],
  )

  const selectedIdleEggIds = useMemo(() => selectedEggItems.filter((id) => idleEggItems.some((item) => item.id === id)), [selectedEggItems, idleEggItems])

  const selectedReadyEggIds = useMemo(() => selectedEggItems.filter((id) => readyEggItems.some((item) => item.id === id)), [selectedEggItems, readyEggItems])

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleStartIncubation = useCallback(
    async (eggId: string) => {
      setEggLoadingIds((prev) => new Set(prev).add(eggId))
      try {
        await toast.promise(incubateMutation.mutateAsync([{ id: eggId }]), {
          pending: t.Breeding.egg.toasts.incubate.pending,
          success: t.Breeding.egg.toasts.incubate.success,
          error: t.Breeding.egg.toasts.incubate.error,
        })
      } catch {
        /* handled */
      } finally {
        setEggLoadingIds((prev) => {
          const next = new Set(prev)
          next.delete(eggId)
          return next
        })
      }
    },
    [incubateMutation, t.Breeding.egg.toasts.incubate],
  )

  const handleFinishHatching = useCallback(
    async (eggId: string) => {
      setEggLoadingIds((prev) => new Set(prev).add(eggId))
      try {
        await toast.promise(hatchMutation.mutateAsync([{ id: eggId }]), {
          pending: t.Breeding.egg.toasts.hatch.pending,
          success: t.Breeding.egg.toasts.hatch.success,
          error: t.Breeding.egg.toasts.hatch.error,
        })
      } catch {
        /* handled */
      } finally {
        setEggLoadingIds((prev) => {
          const next = new Set(prev)
          next.delete(eggId)
          return next
        })
      }
    },
    [hatchMutation, t.Breeding.egg.toasts.hatch],
  )

  const handleStartAllIdleEggs = useCallback(async () => {
    const ids = idleEggItems.map((i) => i.id)
    if (ids.length === 0) return
    setEggLoadingIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
    try {
      await toast.promise(incubateMutation.mutateAsync(ids.map((id) => ({ id }))), {
        pending: t.Breeding.egg.toasts.incubate.pending,
        success: t.Breeding.egg.toasts.incubate.success,
        error: t.Breeding.egg.toasts.incubate.error,
      })
    } catch {
      /* handled */
    } finally {
      setEggLoadingIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [idleEggItems, incubateMutation, t.Breeding.egg.toasts.incubate])

  const handleFinishAllReadyEggs = useCallback(async () => {
    const ids = readyEggItems.map((i) => i.id)
    if (ids.length === 0) return
    setEggLoadingIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
    try {
      await toast.promise(hatchMutation.mutateAsync(ids.map((id) => ({ id }))), {
        pending: t.Breeding.egg.toasts.hatch.pending,
        success: t.Breeding.egg.toasts.hatch.success,
        error: t.Breeding.egg.toasts.hatch.error,
      })
    } catch {
      /* handled */
    } finally {
      setEggLoadingIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [readyEggItems, hatchMutation, t.Breeding.egg.toasts.hatch])

  const handleBulkStartSelectedEggs = useCallback(async () => {
    if (selectedIdleEggIds.length === 0) return
    setEggLoadingIds((prev) => {
      const next = new Set(prev)
      selectedIdleEggIds.forEach((id) => next.add(id))
      return next
    })
    try {
      await toast.promise(incubateMutation.mutateAsync(selectedIdleEggIds.map((id) => ({ id }))), {
        pending: t.Breeding.egg.toasts.incubate.pending,
        success: t.Breeding.egg.toasts.incubate.success,
        error: t.Breeding.egg.toasts.incubate.error,
      })
    } catch {
      /* handled */
    } finally {
      setEggLoadingIds((prev) => {
        const next = new Set(prev)
        selectedIdleEggIds.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [selectedIdleEggIds, incubateMutation, t.Breeding.egg.toasts.incubate])

  const handleBulkFinishSelectedEggs = useCallback(async () => {
    if (selectedReadyEggIds.length === 0) return
    setEggLoadingIds((prev) => {
      const next = new Set(prev)
      selectedReadyEggIds.forEach((id) => next.add(id))
      return next
    })
    try {
      await toast.promise(hatchMutation.mutateAsync(selectedReadyEggIds.map((id) => ({ id }))), {
        pending: t.Breeding.egg.toasts.hatch.pending,
        success: t.Breeding.egg.toasts.hatch.success,
        error: t.Breeding.egg.toasts.hatch.error,
      })
    } catch {
      /* handled */
    } finally {
      setEggLoadingIds((prev) => {
        const next = new Set(prev)
        selectedReadyEggIds.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [selectedReadyEggIds, hatchMutation, t.Breeding.egg.toasts.hatch])

  // â”€â”€ Return â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return {
    allEggItems,
    eggStats,
    eggsLoading,
    hatchingTimeInMs,
    hatchingEggExpiryInMs,
    idleEggItems,
    readyEggItems,
    eggLoadingIds,
    selectedEggItems,
    selectedIdleEggIds,
    selectedReadyEggIds,
    toggleEggSelect,
    setSelectedEggItems,
    incubateMutation,
    hatchMutation,
    handleStartIncubation,
    handleFinishHatching,
    handleStartAllIdleEggs,
    handleFinishAllReadyEggs,
    handleBulkStartSelectedEggs,
    handleBulkFinishSelectedEggs,
  }
}
