import { z } from "zod"

export const accountFormSchema = z.object({
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  address2: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  birthdate: z.date().optional(),
  countryName: z.string().optional(),
  countryCode: z.string().optional(),
  image: z.string().optional(),
})

export const farmWithdrawSchema = z.object({
  payment_method: z
    .enum([
      "al_rafden_bank",
      "asiacell",
      "cash_iraq",
      "cash_romania",
      "crypto",
      "fast_pay",
      "fib",
      "key_card",
      "master_card",
      "neo_bank",
      "netopia_card",
      "other",
      "paypal",
      "rashid",
      "reinvestment",
      "stripe",
      "tabadul",
      "tbi_bank",
      "visa_card",
      "withdraw",
      "zain_cash",
    ])
    .optional(),
  yolkAmount: z.string().min(1, { message: "Amount is required" }),
  transactionDetails: z.string().optional(),
  checkbox: z.boolean(),
})
