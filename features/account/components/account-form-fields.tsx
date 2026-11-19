import type { AccountFormValues } from "@/features/account/hooks/useAccountForm"
import type { T } from "@/messages/types"
import type { Control, FieldErrors } from "react-hook-form"
import { useMemo, useState } from "react"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import PhoneInput from "react-native-phone-number-input"
import Animated, { FadeInDown } from "react-native-reanimated"
import Text from "@/components/native/text"
import DateTimePicker from "@react-native-community/datetimepicker"
import { ChevronDown } from "lucide-react-native"
import { Controller } from "react-hook-form"
import { useThemeColors } from "@/config/colors"

import { ErrorMessage } from "./error-message"

const getCountryCode = (number: string) => {
  if (!number) return { code: "IQ", number: "" }
  const knownCodes = [
    { code: "IQ", prefix: "+964" },
    { code: "RO", prefix: "+40" },
    { code: "AE", prefix: "+971" },
    { code: "US", prefix: "+1" },
    { code: "GB", prefix: "+44" },
    { code: "DE", prefix: "+49" },
    { code: "FR", prefix: "+33" },
    { code: "IT", prefix: "+39" },
    { code: "ES", prefix: "+34" },
    { code: "TR", prefix: "+90" },
    { code: "SA", prefix: "+966" },
    { code: "KW", prefix: "+965" },
    { code: "QA", prefix: "+974" },
    { code: "BH", prefix: "+973" },
    { code: "OM", prefix: "+968" },
    { code: "JO", prefix: "+962" },
    { code: "LB", prefix: "+961" },
    { code: "EG", prefix: "+20" },
  ]
  for (const { code, prefix } of knownCodes) {
    if (number.startsWith(prefix)) {
      return { code, number: number.slice(prefix.length) }
    }
  }
  return { code: "IQ", number }
}

interface AccountFormFieldsProps {
  control: Control<AccountFormValues>
  errors: FieldErrors<AccountFormValues>
  t: T
}

export const AccountFormFields = ({ control, errors, t }: AccountFormFieldsProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const COLORS = useThemeColors()
  const styles = useMemo(
    () =>
      StyleSheet.create({
        formContainer: {
          paddingHorizontal: 0,
          paddingBottom: 0,
        },
        card: {
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          padding: 22,
          marginBottom: 18,
          borderWidth: 1,
          borderColor: COLORS.white + "0F",
          backgroundColor: "rgba(8, 12, 20, 0.9)",
        },
        cardTopSheen: {
          ...StyleSheet.absoluteFillObject,
        },
        cardAccentOrb: {
          position: "absolute",
          top: -38,
          right: -24,
          width: 130,
          height: 130,
          borderRadius: 999,
          backgroundColor: COLORS.primary[500] + "14",
        },
        cardEdgeOrb: {
          position: "absolute",
          bottom: -30,
          left: -20,
          width: 90,
          height: 90,
          borderRadius: 999,
          backgroundColor: COLORS.white + "07",
        },
        cardInnerRing: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 27,
          borderWidth: 1,
          borderColor: COLORS.white + "05",
          margin: 1,
        },
        cardContent: {
          position: "relative",
        },
        inputGroup: {
          marginBottom: 16,
        },
        label: {
          color: COLORS.zinc[400],
          fontSize: 11,
          marginBottom: 8,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        },
        input: {
          backgroundColor: COLORS.white + "05",
          borderWidth: 1,
          borderColor: COLORS.white + "0B",
          borderRadius: 18,
          paddingHorizontal: 16,
          paddingVertical: 16,
          color: COLORS.white,
          fontSize: 16,
        },
        inputText: {
          color: COLORS.white,
          fontSize: 16,
        },
        phoneContainer: {
          backgroundColor: "transparent",
          borderWidth: 0,
          borderRadius: 20,
          height: 62,
          width: "100%",
          paddingVertical: 0,
        },
        phoneShell: {
          borderRadius: 22,
          borderWidth: 1,
          borderColor: COLORS.white + "0E",
          backgroundColor: COLORS.white + "05",
          overflow: "hidden",
        },
        phoneTopGlow: {
          height: 1,
          backgroundColor: COLORS.primary[400] + "50",
        },
        phoneTextContainer: {
          backgroundColor: "transparent",
          paddingVertical: 0,
          borderTopRightRadius: 22,
          borderBottomRightRadius: 22,
          paddingRight: 12,
        },
        phoneInput: {
          color: COLORS.white,
          fontSize: 16,
          backgroundColor: "transparent",
        },
        phoneCodeText: {
          color: COLORS.white,
          fontSize: 15,
        },
        phoneFlagButton: {
          backgroundColor: COLORS.primary[500] + "12",
          borderRightWidth: 1,
          borderRightColor: COLORS.white + "0A",
          paddingHorizontal: 8,
          marginRight: 4,
        },
        phoneDropdown: {
          width: 28,
          height: 28,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.white + "06",
        },
        countryFilterInput: {
          flex: 1,
          height: 52,
          paddingHorizontal: 14,
          color: COLORS.white,
        },
        countryFilterShell: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 18,
          borderWidth: 1,
          borderColor: COLORS.white + "0D",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          paddingHorizontal: 14,
        },
        countryFilterIcon: {
          marginRight: 10,
        },
        countryHeader: {
          flex: 1,
          paddingTop: 18,
          paddingRight: 14,
          gap: 12,
        },
        countryHeaderTitle: {
          color: COLORS.white,
          fontSize: 22,
          lineHeight: 26,
        },
        countryHeaderRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          paddingHorizontal: 12,
          paddingBottom: 8,
        },
        countryCloseButton: {
          marginTop: 18,
          marginLeft: 0,
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: COLORS.white + "06",
          borderWidth: 1,
          borderColor: COLORS.white + "0A",
        },
        countryCloseButtonImage: {
          width: 20,
          height: 20,
        },
      }),
    [COLORS],
  )

  const countryPickerTheme = useMemo(
    () => ({
      backgroundColor: "#071019",
      onBackgroundTextColor: COLORS.white,
      primaryColor: COLORS.primary[400],
      primaryColorVariant: COLORS.white + "0A",
      filterPlaceholderTextColor: COLORS.zinc[500],
      fontSize: 16,
      itemHeight: 62,
      flagSize: 20,
      flagSizeButton: 20,
      activeOpacity: 0.75,
    }),
    [COLORS],
  )

  const countryFilterPlaceholder = t.Auth.selectYourCountry
  // const countryHeaderTitle = t.Auth.country

  return (
    <View style={styles.formContainer}>
      <Animated.View entering={FadeInDown.delay(300)} style={styles.card}>
        <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.12, y: 0 }} end={{ x: 0.9, y: 0.9 }} style={styles.cardTopSheen} />
        <View pointerEvents="none" style={styles.cardAccentOrb} />
        <View pointerEvents="none" style={styles.cardEdgeOrb} />
        <View pointerEvents="none" style={styles.cardInnerRing} />

        <View style={styles.cardContent}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.Settings.account.form.firstName}</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={t.Settings.account.form.firstName}
                  placeholderTextColor={COLORS.zinc[500]}
                  style={styles.input}
                />
              </View>
            )}
          />
          <ErrorMessage message={errors.firstName?.message} />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.Settings.account.form.lastName}</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={t.Settings.account.form.lastName}
                  placeholderTextColor={COLORS.zinc[500]}
                  style={styles.input}
                />
              </View>
            )}
          />
          <ErrorMessage message={errors.lastName?.message} />

          <Controller
            control={control}
            name="birthdate"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.Settings.account.form.dateOfBirth.text}</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                  <Text style={styles.inputText}>{value ? value.toLocaleDateString() : t.Settings.account.form.dateOfBirth.text}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value ?? new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate?: Date) => {
                      setShowDatePicker(false)
                      if (selectedDate) onChange(selectedDate)
                    }}
                    maximumDate={new Date()}
                  />
                )}
              </View>
            )}
          />
          <ErrorMessage message={errors.birthdate?.message} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} style={styles.card}>
        <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.12, y: 0 }} end={{ x: 0.9, y: 0.9 }} style={styles.cardTopSheen} />
        <View pointerEvents="none" style={styles.cardAccentOrb} />
        <View pointerEvents="none" style={styles.cardEdgeOrb} />
        <View pointerEvents="none" style={styles.cardInnerRing} />

        <View style={styles.cardContent}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => {
              const { code, number } = getCountryCode(value ?? "")
              return (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t.Settings.account.form.phoneNumber.text}</Text>
                  <View style={styles.phoneShell}>
                    <View style={styles.phoneTopGlow} />
                    <PhoneInput
                      key={code}
                      defaultValue={number}
                      defaultCode={code as "IQ" | "RO" | "AE" | "US" | "GB"}
                      layout="first"
                      onChangeFormattedText={onChange}
                      containerStyle={styles.phoneContainer}
                      textContainerStyle={styles.phoneTextContainer}
                      textInputStyle={styles.phoneInput}
                      codeTextStyle={styles.phoneCodeText}
                      flagButtonStyle={styles.phoneFlagButton}
                      countryPickerProps={{
                        withCloseButton: true,
                        theme: countryPickerTheme,
                        closeButtonStyle: styles.countryCloseButton,
                        closeButtonImageStyle: styles.countryCloseButtonImage,
                        flatListProps: {
                          showsVerticalScrollIndicator: false,
                          keyboardDismissMode: "on-drag",
                          contentContainerStyle: {
                            paddingBottom: 28,
                          },
                        },
                        filterProps: {
                          style: styles.countryFilterInput,
                          placeholderTextColor: COLORS.zinc[500],
                          selectionColor: COLORS.primary[400],
                          placeholder: countryFilterPlaceholder,
                        },
                        // renderCountryFilter: (props: TextInputProps) => (
                        //   <View style={styles.countryHeader}>
                        //     <Text style={styles.countryHeaderTitle}>{countryHeaderTitle}</Text>
                        //     <View style={styles.countryFilterShell}>
                        //       <Search size={18} color={COLORS.zinc[400]} style={styles.countryFilterIcon} />
                        //       <TextInput
                        //         {...props}
                        //         style={styles.countryFilterInput}
                        //         placeholder={countryFilterPlaceholder}
                        //         placeholderTextColor={COLORS.zinc[500]}
                        //       />
                        //     </View>
                        //   </View>
                        // ),
                      }}
                      renderDropdownImage={
                        <View style={styles.phoneDropdown}>
                          <ChevronDown size={18} color={COLORS.primary[300]} />
                        </View>
                      }
                      withDarkTheme
                      withShadow={false}
                    />
                  </View>
                  <ErrorMessage message={errors.phone?.message} />
                </View>
              )
            }}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.Settings.account.form.address.text}</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={t.Settings.account.form.address.text}
                  placeholderTextColor={COLORS.zinc[500]}
                  style={styles.input}
                />
              </View>
            )}
          />
          <ErrorMessage message={errors.address?.message} />

          <Controller
            control={control}
            name="address2"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.Settings.account.form.address2.text}</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={t.Settings.account.form.address2.text}
                  placeholderTextColor={COLORS.zinc[500]}
                  style={styles.input}
                />
              </View>
            )}
          />
          <ErrorMessage message={errors.address2?.message} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500)} style={styles.card}>
        <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.12, y: 0 }} end={{ x: 0.9, y: 0.9 }} style={styles.cardTopSheen} />
        <View pointerEvents="none" style={styles.cardAccentOrb} />
        <View pointerEvents="none" style={styles.cardEdgeOrb} />
        <View pointerEvents="none" style={styles.cardInnerRing} />

        <View style={styles.cardContent}>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.Settings.account.form.city.text}</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={t.Settings.account.form.city.text}
                  placeholderTextColor={COLORS.zinc[500]}
                  style={styles.input}
                />
              </View>
            )}
          />
          <ErrorMessage message={errors.city?.message} />

          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.Settings.account.form.province.text}</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={t.Settings.account.form.province.text}
                  placeholderTextColor={COLORS.zinc[500]}
                  style={styles.input}
                />
              </View>
            )}
          />
          <ErrorMessage message={errors.state?.message} />

          <Controller
            control={control}
            name="postalCode"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.Settings.account.form.postalCode.text}</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={t.Settings.account.form.postalCode.text}
                  placeholderTextColor={COLORS.zinc[500]}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            )}
          />
          <ErrorMessage message={errors.postalCode?.message} />
        </View>
      </Animated.View>
    </View>
  )
}
