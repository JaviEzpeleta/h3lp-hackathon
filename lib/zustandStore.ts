import { create } from "zustand"
import { LensSavedProfile } from "./types"

interface AppState {
  userSession: LensSavedProfile | null
  setUserSession: (userSession: LensSavedProfile | null) => void
  isFetchingSession: boolean
  setIsFetchingSession: (isFetchingSession: boolean) => void
}

const useStore = create<AppState>((set) => ({
  userSession: null,
  setUserSession: (userSession) => set({ userSession }),
  isFetchingSession: true,
  setIsFetchingSession: (isFetchingSession) => set({ isFetchingSession }),
}))

export default useStore
