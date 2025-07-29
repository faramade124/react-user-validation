"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "/Users/Raheem/react-practise1/src/Contexts/AuthContext"
import Login from "/Users/Raheem/react-practise1/src/component/Login"
import Register from "/Users/Raheem/react-practise1/src/component/Register"
import PersonalInfo from "/Users/Raheem/react-practise1/src/component/PersonalInfo"
import AddressSearch from "/Users/Raheem/react-practise1/src/component/AddressSearch"
import AddressForm from "/Users/Raheem/react-practise1/src/component/AddressForm"
import SuccessScreen from "/Users/Raheem/react-practise1/src/component/SuccessScreen"
import Dashboard from "/Users/Raheem/react-practise1/src/component/Dashboard"
import "./App.css"

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return !currentUser ? <>{children}</> : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/personal-info"
        element={
          <PublicRoute>
            <PersonalInfo />
          </PublicRoute>
        }
      />
      <Route
        path="/address-search"
        element={
          <PublicRoute>
            <AddressSearch />
          </PublicRoute>
        }
      />
      <Route
        path="/address-form"
        element={
          <PublicRoute>
            <AddressForm />
          </PublicRoute>
        }
      />
      <Route
        path="/success"
        element={
          <PublicRoute>
            <SuccessScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
