import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './authContext'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth() as { user?: boolean }
  console.log('useruseruser', user)
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />
  }
  return children
}
