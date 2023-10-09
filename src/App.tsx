import React from 'react'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router'
import LoginForm from './components/auth/LoginForm'
import { ProtectedRoute } from './infrastructure/authentication/ProtectedRoute'
import { AuthProvider } from './infrastructure/authentication/AuthProvider'
import LogGroup from './pages/LogGroup'
import LogGroupProvider from './infrastructure/contextProviders/logGroupProvider'

const App: React.FC<unknown> = () => {
  return (
    <>
      <AuthProvider>
        <LogGroupProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/log-group"
              element={
                <ProtectedRoute>
                  <LogGroup />
                </ProtectedRoute>
              }
            />
          </Routes>
        </LogGroupProvider>
      </AuthProvider>
    </>
  )
}

export default App
