import type { TextInputProps } from "react-native"
import { useEffect, useState } from "react"
import { TextInput, TouchableOpacity, View } from "react-native"
import { useThemeColors } from "@/config/colors"
import { Minus, Plus } from "lucide-react-native"

interface NumericInputProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: number
  onChangeValue: (value: number) => void
  min?: number
  max?: number
  step?: number
  showButtons?: boolean
  error?: boolean
}

const NumericInput = ({ value, onChangeValue, min, max, step = 1, showButtons = true, error = false, editable = true, ...props }: NumericInputProps) => {
  const COLORS = useThemeColors()
  const [inputValue, setInputValue] = useState(value.toString())

  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleChangeText = (text: string) => {
    // Allow empty string for user to type
    if (text === "") {
      setInputValue("")
      return
    }

    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "")
    setInputValue(numericValue)

    const parsed = parseInt(numericValue)
    if (!isNaN(parsed)) {
      let validValue = parsed
      if (min !== undefined && validValue < min) validValue = min
      if (max !== undefined && validValue > max) validValue = max
      onChangeValue(validValue)
    }
  }

  const handleBlur = () => {
    // If empty on blur, set to min or 0
    if (inputValue === "" || inputValue === "0") {
      const fallbackValue = min ?? 0
      setInputValue(fallbackValue.toString())
      onChangeValue(fallbackValue)
    }
  }

  const increment = () => {
    const newValue = value + step
    // if (max === undefined || newValue <= max) {
    onChangeValue(newValue)
    // }
  }

  const decrement = () => {
    const newValue = value - step
    // if (min === undefined || newValue >= min) {
    onChangeValue(newValue)
    // }
  }

  // const canIncrement = editable && (max === undefined || value < max)
  // const canDecrement = editable && (min === undefined || value > min)

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        backgroundColor: COLORS.zinc[800],
        borderWidth: 1,
        borderColor: error ? COLORS.danger[500] : "transparent",
        height: 56,
        overflow: "hidden",
      }}
    >
      {showButtons && (
        <TouchableOpacity
          onPress={decrement}
          // disabled={!canDecrement}
          style={{
            paddingHorizontal: 12,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRightWidth: 1,
            borderRightColor: COLORS.zinc[700],
            // opacity: canDecrement ? 1 : 0.3
          }}
        >
          <Minus size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}

      <TextInput
        {...props}
        style={{
          flex: 1,
          paddingHorizontal: 16,
          height: "100%",
          color: COLORS.white,
          fontSize: 16,
          textAlign: "center",
        }}
        value={inputValue}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        keyboardType="numeric"
        returnKeyType="done"
        editable={editable}
      />

      {showButtons && (
        <TouchableOpacity
          onPress={increment}
          // disabled={!canIncrement}
          style={{
            paddingHorizontal: 12,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderLeftWidth: 1,
            borderLeftColor: COLORS.zinc[700],
            // opacity: canIncrement ? 1 : 0.3
          }}
        >
          <Plus size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default NumericInput
