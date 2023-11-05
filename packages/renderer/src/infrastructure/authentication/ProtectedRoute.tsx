import React from 'react'
import Layout from '../../components/layout/Layout'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { user } = useAuth() as { user?: boolean }
  // if (!user) {
  //   // user is not authenticated
  //   return <Navigate to="/login" />
  // }
  return <Layout>{children}</Layout>
}
