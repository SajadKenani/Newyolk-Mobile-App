import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ScrollView } from "react-native"
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FARM_SECTION_KEYS = ["yolk", "corn", "milk", "hay", "yield", "livestock", "action", "feedAll", "rail"] as const

type FarmSectionKey = (typeof FARM_SECTION_KEYS)[number]
type FarmSectionMap = Record<FarmSectionKey, number | null>

const createSectionPositionMap = (): FarmSectionMap => ({
  yolk: null,
  corn: null,
  milk: null,
  hay: null,
  yield: null,
  livestock: null,
  action: null,
  feedAll: null,
  rail: null,
})

const useFarmScreenLayout = ({ enabled, viewportHeight }: { enabled: boolean; viewportHeight: number }) => {
  const sliderRef = useRef<ScrollView>(null)
  const sliderOffsetRef = useRef(0)
  const sliderDirectionRef = useRef(1)

  const [sliderWidth, setSliderWidth] = useState(0)
  const [sliderContentWidth, setSliderContentWidth] = useState(0)
  const [sectionPositions, setSectionPositions] = useState<FarmSectionMap>(createSectionPositionMap)
  const [scrollY, setScrollY] = useState(0)

  const updateSectionPosition = useCallback(
    (key: FarmSectionKey) => (event: LayoutChangeEvent) => {
      const nextY = event.nativeEvent.layout.y

      setSectionPositions((current) => (current[key] === nextY ? current : { ...current, [key]: nextY }))
    },
    [],
  )

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(event.nativeEvent.contentOffset.y)
  }, [])

  const onSliderLayout = useCallback((event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width)
  }, [])

  const onSliderContentSizeChange = useCallback((width: number) => {
    setSliderContentWidth(width)
  }, [])

  const visibleSections = useMemo(() => {
    const revealLine = enabled ? scrollY + viewportHeight * 0.82 : -1
    const isVisible = (position: number | null) => position !== null && revealLine >= position

    return {
      rail: isVisible(sectionPositions.rail),
      yolk: isVisible(sectionPositions.yolk),
      corn: isVisible(sectionPositions.corn),
      milk: isVisible(sectionPositions.milk),
      hay: isVisible(sectionPositions.hay),
      yield: isVisible(sectionPositions.yield),
      livestock: isVisible(sectionPositions.livestock),
      action: isVisible(sectionPositions.action),
    }
  }, [enabled, scrollY, sectionPositions, viewportHeight])

  useEffect(() => {
    sliderOffsetRef.current = 0
    sliderDirectionRef.current = 1
    sliderRef.current?.scrollTo({ x: 0, animated: false })
  }, [enabled])

  useEffect(() => {
    const maxOffset = Math.max(0, sliderContentWidth - sliderWidth)

    if (!enabled || maxOffset <= 0) {
      return
    }

    const interval = setInterval(() => {
      const nextOffset = sliderOffsetRef.current + sliderDirectionRef.current * 1.3

      if (nextOffset >= maxOffset) {
        sliderOffsetRef.current = maxOffset
        sliderDirectionRef.current = -1
      } else if (nextOffset <= 0) {
        sliderOffsetRef.current = 0
        sliderDirectionRef.current = 1
      } else {
        sliderOffsetRef.current = nextOffset
      }

      sliderRef.current?.scrollTo({ x: sliderOffsetRef.current, animated: false })
    }, 16)

    return () => clearInterval(interval)
  }, [enabled, sliderContentWidth, sliderWidth])

  return {
    sliderRef,
    visibleSections,
    updateSectionPosition,
    onScroll,
    onSliderLayout,
    onSliderContentSizeChange,
  }
}

export { useFarmScreenLayout }
