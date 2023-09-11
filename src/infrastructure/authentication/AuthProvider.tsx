import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from './authContext'
// import { useLocalStorage } from "./useLocalStorage";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState(false)
  const navigate = useNavigate()

  // call this function when you want to authenticate the user
  const login = React.useCallback(async () => {
    setUser(true)
    navigate('/home', { replace: true })
  }, [navigate])

  // call this function to sign out logged in user
  const logout = React.useCallback(() => {
    setUser(false)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [login, logout, user],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
