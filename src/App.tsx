import React from 'react'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router'
import LoginForm from './components/auth/LoginForm'
import { ProtectedRoute } from './infrastructure/authentication/ProtectedRoute'
import { AuthProvider } from './infrastructure/authentication/AuthProvider'
import LogGroup from './pages/LogGroup'
import LogEvents from './pages/LogEvents'

const App: React.FC<unknown> = () => {
  return (
    <>
      <AuthProvider>
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
          <Route
            path="/log-events"
            element={
              <ProtectedRoute>
                <LogEvents />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
