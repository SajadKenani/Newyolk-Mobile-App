import { createContext, useContext, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { createTabsStyles } from "../utils/style"
import { useThemeColors } from "@/config/colors"

interface TabsContextType {
  value: string
  setValue: (val: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

export const Tabs = ({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) => {
  const [value, setValue] = useState(defaultValue)

  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const C = useThemeColors()
const styles = createTabsStyles(C)
export const TabsList = ({ children }: { children: React.ReactNode }) => <View style={styles.list}>{children}</View>

export const TabsTrigger = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = useContext(TabsContext)
  if (!context) return null

  const isActive = context.value === value

  return (
    <TouchableOpacity onPress={() => context.setValue(value)} style={[styles.trigger, isActive && styles.activeTrigger]}>
      <Text style={[styles.triggerText, isActive && styles.activeText]}>{children}</Text>
    </TouchableOpacity>
  )
}

export const TabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = useContext(TabsContext)
  if (context?.value !== value) return null

  return <View style={styles.content}>{children}</View>
}
