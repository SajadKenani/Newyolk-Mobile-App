import type * as z from "zod"
import { useState } from "react"
import { api } from "@/config/react-provider"
import { accountFormSchema } from "@/utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { RouterOutputs } from "@newyolk/api"

export type AccountFormValues = z.infer<typeof accountFormSchema>

export const useAccountForm = (me: RouterOutputs["user"]["me"]) => {
  const [avatar, setAvatar] = useState<string>(me?.image ?? "")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const utils = api.useUtils()

  const defaultValues: AccountFormValues = {
    id: me.id,
    firstName: me.firstName ?? "",
    lastName: me.lastName ?? "",
    phone: me.phone ?? "",
    address: me.address ?? "",
    address2: me.address2 ?? "",
    state: me.state ?? "",
    city: me.city ?? "",
    postalCode: me.postalCode ?? "",
    birthdate: me.birthdate ? new Date(me.birthdate) : undefined,
    countryName: me.countryName ?? "",
    countryCode: me.countryCode ?? "",
    image: me.image ?? "",
  }

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  const updateMe = api.user.updateMe.useMutation()

  const onSubmit = async (data: AccountFormValues) => {
    setSuccess(false)
    setLoading(true)
    try {
      await updateMe.mutateAsync(data as Parameters<typeof updateMe.mutateAsync>[0])
      // Refetch the user data and wait for it to complete
      await utils.user.me.refetch()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e: unknown) {
      console.error("Update error:", e)
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    avatar,
    setAvatar,
    success,
    loading,
    onSubmit,
  }
}
