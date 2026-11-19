import { ScrollView, Text, View } from "react-native"
import { format } from "date-fns"
import Decimal from "decimal.js"

import { useSafeTranslation } from "@/hooks/safe-translation"
import { createDepositStyles } from "./utils/style"
import { getStatusVariant } from "./utils/types"
import type { BonusItem } from "./utils/types"
import { Badge } from "./utils/helpers"
import { useThemeColors } from "@/config/colors"

const TableView = ({ items }: { items: BonusItem[] }) => {
  const { t } = useSafeTranslation
  const C = useThemeColors()
  const styles = createDepositStyles(C)
  const headers = [
    { key: "date", label: t.History.bonuses.table.date, align: "left" as const, flex: 2 },
    { key: "item", label: t.History.bonuses.table.item, align: "left" as const, flex: 1.5 },
    { key: "amount", label: t.History.bonuses.table.amount, align: "right" as const, flex: 1 },
    { key: "value", label: t.History.bonuses.table.value, align: "right" as const, flex: 1 },
    { key: "status", label: t.History.bonuses.table.status, align: "left" as const, flex: 1.5 },
  ]

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow, styles.tableHeaderRow]}>
          {headers.map((h) => (
            <View key={h.key} style={[styles.tableCell, { flex: h.flex }]}>
              <Text style={[styles.tableHeaderText, h.align === "right" && styles.textRight]}>{h.label}</Text>
            </View>
          ))}
        </View>

        {/* Rows */}
        {items.map((item, idx) => (
          <View key={item.id} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text style={styles.tableCellText} numberOfLines={1}>
                {format(new Date(item.createdAt), "PPp")}
              </Text>
            </View>
            <View style={[styles.tableCell, { flex: 1.5 }]}>
              <Text style={[styles.tableCellText, styles.capitalize]}>{item.item}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1 }]}>
              <Text style={[styles.tableCellText, styles.textRight]}>{new Decimal(item.amount.toString()).toFixed(2)}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1 }]}>
              <Text style={[styles.tableCellText, styles.textRight]}>${new Decimal(item.valueInUsd.toString()).toFixed(2)}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1.5 }]}>
              <Badge variant={getStatusVariant(item.status)} label={item.status} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default TableView
