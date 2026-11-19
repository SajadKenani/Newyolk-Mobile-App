import { authClient } from "@/auth/client"
import { useCallback, useMemo, useState } from "react"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import type { RouterOutputs } from "@/config/react-provider"
import { toast } from "react-toastify"
export function useRoosterBreeding(now: number, initialFarmingCondition: RouterOutputs["farmingCondition"]["getCurrent"] | null) {
  const { t } = useSafeTranslation
  const { data: session } = authClient.useSession()
  const utils = api.useUtils()

  // â”€â”€ Queries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const initialRoosters = api.collection.infiniteItemsByName.useQuery({
    name: "rooster",
    limit: 50,
    direction: "forward",
  })

  const roosters = api.collection.infiniteItemsByName.useInfiniteQuery(
    { name: "rooster", limit: 50 },
    {
      enabled: session?.user.id !== undefined,
      initialData: initialRoosters.data ? { pages: [initialRoosters.data], pageParams: [null] } : undefined,
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const allItems = useMemo(() => roosters.data?.pages.flatMap((p) => p.items) ?? [], [roosters.data?.pages])

  // â”€â”€ Local state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleSelect = useCallback((id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  // â”€â”€ Mutations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const startBreedMutation = api.hen.startBreed.useMutation({
    onSuccess: async () => {
      setSelectedItems([])
      await utils.collection.infiniteItemsByName.invalidate()
      await utils.farm.myYolkBalance.invalidate()
    },
  })

  const finishBreedMutation = api.hen.finishBreed.useMutation({
    onSuccess: async () => {
      setSelectedItems([])
      await utils.collection.infiniteItemsByName.invalidate()
      await utils.farm.myYolkBalance.invalidate()
    },
  })

  // â”€â”€ Derived state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const breedingTimeMs = Number(initialFarmingCondition?.breedingTimeInMs ?? "")

  const stats = useMemo(() => {
    return allItems.reduce(
      (acc, item) => {
        const isBreeding = item.isBreeding && item.breedingSince
        if (!isBreeding) {
          acc.idle++
        } else {
          const elapsed = now - new Date(item.breedingSince!).getTime()
          if (elapsed >= breedingTimeMs) acc.ready++
          else acc.breeding++
        }
        acc.totalBreeds += item.breedingsCounter
        return acc
      },
      { idle: 0, breeding: 0, ready: 0, totalBreeds: 0 },
    )
  }, [allItems, now, breedingTimeMs])

  const idleItems = useMemo(() => allItems.filter((item) => !item.isBreeding || !item.breedingSince), [allItems])

  const readyItems = useMemo(
    () =>
      allItems.filter((item) => {
        if (!item.isBreeding || !item.breedingSince) return false
        return now - new Date(item.breedingSince).getTime() >= breedingTimeMs
      }),
    [allItems, now, breedingTimeMs],
  )

  const selectedIdleIds = useMemo(() => selectedItems.filter((id) => idleItems.some((item) => item.id === id)), [selectedItems, idleItems])

  const selectedReadyIds = useMemo(() => selectedItems.filter((id) => readyItems.some((item) => item.id === id)), [selectedItems, readyItems])

  // Transform items to match RoosterGridProps type
  const transformedAllItems = useMemo(
    () =>
      allItems.map((item) => ({
        hasEgg: readyItems.some((ready) => ready.id === item.id),
        id: item.id,
        isBreeding: item.isBreeding,
        breedingSince: item.breedingSince,
        breedingsCounter: item.breedingsCounter,
        image: item.image,
        state: item.state,
        numId: item.numId,
        name: item.name,
      })),
    [allItems, readyItems],
  )

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleStartBreed = useCallback(
    async (roosterId: string) => {
      setLoadingIds((prev) => new Set(prev).add(roosterId))
      try {
        await toast.promise(startBreedMutation.mutateAsync({ roosterIds: [roosterId] }), {
          pending: t.Breeding.toasts.startBreed.pending,
          success: t.Breeding.toasts.startBreed.success,
          error: t.Breeding.toasts.startBreed.error,
        })
      } catch {
        // handled by toast
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev)
          next.delete(roosterId)
          return next
        })
      }
    },
    [startBreedMutation, t.Breeding.toasts.startBreed],
  )

  const handleFinishBreed = useCallback(
    async (roosterId: string) => {
      setLoadingIds((prev) => new Set(prev).add(roosterId))
      try {
        await toast.promise(finishBreedMutation.mutateAsync({ roosterIds: [roosterId] }), {
          pending: t.Breeding.toasts.finishBreed.pending,
          success: t.Breeding.toasts.finishBreed.success,
          error: t.Breeding.toasts.finishBreed.error,
        })
      } catch {
        // handled by toast
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev)
          next.delete(roosterId)
          return next
        })
      }
    },
    [finishBreedMutation, t.Breeding.toasts.finishBreed],
  )

  const handleStartAllIdle = useCallback(async () => {
    const ids = idleItems.map((i) => i.id)
    if (ids.length === 0) return
    setLoadingIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
    try {
      await toast.promise(startBreedMutation.mutateAsync({ roosterIds: ids }), {
        pending: t.Breeding.toasts.startBreed.pending,
        success: t.Breeding.toasts.startBreed.success,
        error: t.Breeding.toasts.startBreed.error,
      })
    } catch {
      /* handled */
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [idleItems, startBreedMutation, t.Breeding.toasts.startBreed])

  const handleFinishAllReady = useCallback(async () => {
    const ids = readyItems.map((i) => i.id)
    if (ids.length === 0) return
    setLoadingIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
    try {
      await toast.promise(finishBreedMutation.mutateAsync({ roosterIds: ids }), {
        pending: t.Breeding.toasts.finishBreed.pending,
        success: t.Breeding.toasts.finishBreed.success,
        error: t.Breeding.toasts.finishBreed.error,
      })
    } catch {
      /* handled */
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [readyItems, finishBreedMutation, t.Breeding.toasts.finishBreed])

  const handleBulkStartSelected = useCallback(async () => {
    if (selectedIdleIds.length === 0) return
    setLoadingIds((prev) => {
      const next = new Set(prev)
      selectedIdleIds.forEach((id) => next.add(id))
      return next
    })
    try {
      await toast.promise(startBreedMutation.mutateAsync({ roosterIds: selectedIdleIds }), {
        pending: t.Breeding.toasts.startBreed.pending,
        success: t.Breeding.toasts.startBreed.success,
        error: t.Breeding.toasts.startBreed.error,
      })
    } catch {
      /* handled */
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev)
        selectedIdleIds.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [selectedIdleIds, startBreedMutation, t.Breeding.toasts.startBreed])

  const handleBulkFinishSelected = useCallback(async () => {
    if (selectedReadyIds.length === 0) return
    setLoadingIds((prev) => {
      const next = new Set(prev)
      selectedReadyIds.forEach((id) => next.add(id))
      return next
    })
    try {
      await toast.promise(finishBreedMutation.mutateAsync({ roosterIds: selectedReadyIds }), {
        pending: t.Breeding.toasts.finishBreed.pending,
        success: t.Breeding.toasts.finishBreed.success,
        error: t.Breeding.toasts.finishBreed.error,
      })
    } catch {
      /* handled */
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev)
        selectedReadyIds.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [selectedReadyIds, finishBreedMutation, t.Breeding.toasts.finishBreed])

  // â”€â”€ Return â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return {
    allItems: transformedAllItems,
    stats,
    idleItems,
    readyItems,
    loadingIds,
    selectedItems,
    selectedIdleIds,
    selectedReadyIds,
    toggleSelect,
    setSelectedItems,
    startBreedMutation,
    finishBreedMutation,
    handleStartBreed,
    handleFinishBreed,
    handleStartAllIdle,
    handleFinishAllReady,
    handleBulkStartSelected,
    handleBulkFinishSelected,
  }
}
