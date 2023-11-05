import React from 'react'

export type AuthProviderValue = {
  user?: boolean
  setUser?: React.Dispatch<React.SetStateAction<boolean>>
  login?: () => void
  logout?: () => void
}
const AuthContext = React.createContext<AuthProviderValue>({
  user: false,
  setUser: () => {
    return null
  },
  login: () => {
    return null
  },
  logout: () => {
    return null
  },
})

export const useAuth = (): AuthProviderValue => React.useContext<AuthProviderValue>(AuthContext)

export default AuthContext
