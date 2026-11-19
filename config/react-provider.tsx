import * as React from "react"
import { Platform } from "react-native"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink, loggerLink, retryLink, TRPCClientError } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"

import type { AppRouter } from "@newyolk/api"

import { authClient } from "@/auth/client"
import { getValidSession } from "@/auth/session-manager"
import { getBaseUrl } from "@/utils/base-url"
import { superjson } from "@/utils/superjson-decimal"

const isWeb = Platform.OS === "web"

export const api = createTRPCReact<AppRouter>()
export { type RouterInputs, type RouterOutputs } from "@newyolk/api"

const getHttpStatus = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) {
    return undefined
  }

  const data: unknown = error.data

  if (typeof data === "object" && data !== null && "httpStatus" in data) {
    const httpStatus = data.httpStatus
    return typeof httpStatus === "number" ? httpStatus : undefined
  }

  return undefined
}

const handleAuthError = (error: unknown) => {
  if (error instanceof TRPCClientError && getHttpStatus(error) === 401) {
    void authClient.signOut()
  }
}

const TRPCProvider = (props: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry(failureCount, error) {
              if (error instanceof TRPCClientError && getHttpStatus(error) === 401) return false
              return failureCount < 2
            },
          },
        },
        queryCache: new QueryCache({ onError: handleAuthError }),
        mutationCache: new MutationCache({ onError: handleAuthError }),
      }),
  )

  const [trpcClient] = React.useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) => process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
        retryLink({
          retry(opts) {
            if (opts.error instanceof TRPCClientError && getHttpStatus(opts.error) === 401) {
              void authClient.signOut()
              return false
            }

            return opts.attempts < 2
          },
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
          fetch(url, options) {
            if (!isWeb) {
              return fetch(url, options)
            }

            return fetch(url, {
              ...options,
              credentials: "include",
            })
          },
          async headers() {
            const headers = new Map<string, string>()
            headers.set("x-trpc-source", "expo-react")

            const cookies = await getValidSession()
            if (cookies && !isWeb) headers.set("Cookie", cookies)

            return Object.fromEntries(headers)
          },
        }),
      ],
    }),
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </api.Provider>
  )
}

export { TRPCProvider }
