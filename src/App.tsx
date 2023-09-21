import React from 'react'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router'
import LoginForm from './components/auth/LoginForm'
import { ProtectedRoute } from './infrastructure/authentication/ProtectedRoute'
import { AuthProvider } from './infrastructure/authentication/AuthProvider'

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
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
