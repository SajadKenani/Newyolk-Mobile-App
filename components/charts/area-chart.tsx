import { useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Path, Stop } from "react-native-svg"

import type { LineChartCompProps } from "../types/interface"

const getStepLinePath = (points: { x: number; y: number }[]) => {
  if (!points.length) {
    return ""
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M${point.x} ${point.y}`
    }

    const previousPoint = points[index - 1]

    if (!previousPoint) {
      return path
    }

    const midX = (previousPoint.x + point.x) / 2
    return `${path} L${midX} ${previousPoint.y} L${midX} ${point.y} L${point.x} ${point.y}`
  }, "")
}

const getChartPoints = ({ data, width, height }: { data: LineChartCompProps["data"]; width: number; height: number }) => {
  const horizontalInset = 8
  const verticalInset = 10
  const pointYRatio = 0.5

  if (!data.length) {
    return {
      areaPath: "",
      linePath: "",
      points: [],
    }
  }

  const values = data.map((item) => item.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const isFlatSeries = maxValue === minValue
  const valueRange = maxValue - minValue || 1
  const usableWidth = Math.max(width - horizontalInset * 2, 1)
  const usableHeight = Math.max(height - verticalInset * 2, 1)
  const stepX = data.length > 1 ? usableWidth / (data.length - 1) : 0
  const baselineY = height - verticalInset

  const points: { x: number; y: number; value: number }[] = data.map((item, index) => {
    const normalizedY = isFlatSeries ? pointYRatio : (item.value - minValue) / valueRange

    return {
      x: horizontalInset + stepX * index,
      y: baselineY - normalizedY * usableHeight,
      value: item.value,
    }
  })

  if (points.length === 1) {
    const singlePoint = points[0]

    if (singlePoint) {
      const centerY = singlePoint.y
      const leftX = horizontalInset
      const rightX = width - horizontalInset

      points.splice(0, 1, { x: leftX, y: centerY, value: singlePoint.value }, { x: rightX, y: centerY, value: singlePoint.value })
    }
  }

  const linePath = getStepLinePath(points)
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const areaPath = `${linePath} L ${lastPoint?.x ?? 0} ${baselineY} L ${firstPoint?.x ?? 0} ${baselineY} Z`

  return {
    areaPath,
    linePath,
    points,
  }
}

const LineChartComp = ({ width, height, data, styleProps, startColor, endColor }: LineChartCompProps) => {
  const [measuredWidth, setMeasuredWidth] = useState(0)
  const resolvedWidth = width ?? measuredWidth

  const { areaPath, linePath, points } = useMemo(() => {
    if (!resolvedWidth || !data.length) {
      return {
        areaPath: "",
        linePath: "",
        points: [],
      }
    }

    return getChartPoints({
      data,
      width: resolvedWidth,
      height,
    })
  }, [data, height, resolvedWidth])

  const lastPoint = points[points.length - 1]

  return (
    <View
      style={[styles.container, styleProps]}
      onLayout={(event) => {
        if (!width) {
          setMeasuredWidth(event.nativeEvent.layout.width)
        }
      }}
    >
      {resolvedWidth > 0 ? (
        <Svg width={resolvedWidth} height={height} viewBox={`0 0 ${resolvedWidth} ${height}`}>
          <Defs>
            <SvgLinearGradient id="assetChartFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={startColor} stopOpacity={0.45} />
              <Stop offset="100%" stopColor={endColor} stopOpacity={0.02} />
            </SvgLinearGradient>
          </Defs>

          <Path d={areaPath} fill="url(#assetChartFill)" />
          <Path d={linePath} fill="none" stroke={startColor} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

          {lastPoint ? <Circle cx={lastPoint.x} cy={lastPoint.y} r={8} fill={startColor} opacity={0.12} /> : null}
          {lastPoint ? <Circle cx={lastPoint.x} cy={lastPoint.y} r={4.5} fill={startColor} /> : null}
        </Svg>
      ) : null}
    </View>
  )
}

export default LineChartComp

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
})
