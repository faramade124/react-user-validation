"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { X, Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { login } = useAuth()
  const navigate = useNavigate()

  // Form validation
  function validateForm() {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setErrors({})

      // Login with Firebase
      await login(formData.email, formData.password)

      // Clear any registration data
      sessionStorage.removeItem("registrationData")

      // Navigate to dashboard on successful login
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)

      // Handle specific Firebase errors
      let errorMessage = "Failed to log in. Please try again."

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address"
          break
        case "auth/wrong-password":
          errorMessage = "Incorrect password"
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address"
          break
        case "auth/user-disabled":
          errorMessage = "This account has been disabled"
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later."
          break
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection."
          break
        default:
          errorMessage = error.message || errorMessage
      }

      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <button className="close-btn" onClick={() => navigate("/")}>
          <X size={24} />
        </button>

        <div className="auth-tabs">
          <Link to="/register" className="tab">
            Register
          </Link>
          <button className="tab active">Log in</button>
        </div>

        <div className="social-login">
          <button className="social-btn apple" disabled={loading}>
            <span><img src="/public/images/104490_apple_icon.png" alt="" srcset="" /></span>
          </button>
          <button className="social-btn facebook" disabled={loading}>
            <span><img src="/public/images/834722_facebook_icon.png" alt="" srcset="" /></span>
          </button>
          <button className="social-btn google" disabled={loading}>
            <span><img src="/public/images/1298745_google_brand_branding_logo_network_icon.png" alt="" srcset="" /></span>
          </button>
        </div>

        <div className="divider">
          <span>or login with email</span>
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@mail.com"
              className={errors.email ? "error" : ""}
              disabled={loading}
              required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className={errors.password ? "error" : ""}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>

          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
        </form>
      </div>
    </div>
  )
}
