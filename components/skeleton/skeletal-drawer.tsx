import React from "react"
import { View } from "react-native"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import Skeleton from "../helpers/skeleton"
import { styles } from "../types/style"

const SkeletalDrawer = ({ ...props }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#0E0C15" }}>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false} scrollEnabled={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 24, flexDirection: "column", alignItems: "center" }}>
          <Skeleton colorMode="dark" radius="round" height={80} style={{ width: 80, margin: 20 }} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Skeleton colorMode="dark" height={16} radius={8} style={{ width: 180 }} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode="dark" height={12} radius={6} style={{ width: 140 }} />
          </View>
        </View>

        <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
          <Skeleton colorMode="dark" height={12} radius={6} style={{ width: 80 }} />
        </View>

        <View style={{ marginBottom: 8, flex: 1 }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <React.Fragment key={`farm-skel-${idx}`}>
              <View style={[styles.itemContainer, { backgroundColor: "transparent" }]}>
                <View style={styles.itemInner}>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <Skeleton colorMode="dark" height={36} radius={8} style={{ width: 36, marginRight: 12 }} />
                    <Skeleton colorMode="dark" height={14} radius={6} style={{ width: 180 }} />
                  </View>
                </View>
              </View>
              {idx === 3 && <View style={[styles.divider, { backgroundColor: "#27272a" }]} />}
            </React.Fragment>
          ))}
        </View>

        <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
          <Skeleton colorMode="dark" height={12} radius={6} style={{ width: 80 }} />
        </View>

        <View style={{ marginBottom: 8 }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <View key={`nav-skel-${idx}`} style={[styles.itemContainer, { backgroundColor: "transparent", marginBottom: 4 }]}>
              <View style={styles.itemInner}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <Skeleton colorMode="dark" height={36} radius={8} style={{ width: 36, marginRight: 12 }} />
                  <Skeleton colorMode="dark" height={14} radius={6} style={{ width: 180 }} />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginBottom: 8 }}>
          <View style={[styles.itemContainer, { backgroundColor: "transparent", marginBottom: 4 }]}>
            <View style={styles.itemInner}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Skeleton colorMode="dark" height={36} radius={8} style={{ width: 36, marginRight: 12 }} />
                <Skeleton colorMode="dark" height={14} radius={6} style={{ width: 140 }} />
              </View>
            </View>
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

export default SkeletalDrawer