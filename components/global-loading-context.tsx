import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"
import { LoadingSpinner } from "@/components/helpers/loading"

interface GlobalLoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined)

export const GlobalLoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <LoadingSpinner />}
    </GlobalLoadingContext.Provider>
  )
}

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext)
  if (!context) {
    throw new Error("useGlobalLoading must be used within a GlobalLoadingProvider")
  }
  return context
}
