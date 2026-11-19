import { Decimal } from "decimal.js"
import SuperJSON from "superjson"

/**
 * Custom SuperJSON instance with Decimal.js support
 *
 * This transformer automatically converts Prisma Decimal types to strings
 * when serializing to the client, eliminating the need for manual .toString()
 * conversions throughout the codebase.
 *
 * Usage:
 * - Simply return Decimal values from tRPC procedures
 * - They will be automatically serialized as strings
 * - On the client, they arrive as strings (ready for display or conversion)
 */

// Register Decimal.js custom serializer
SuperJSON.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toString(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js",
)

export { SuperJSON as superjson }
