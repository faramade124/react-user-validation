"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { X, Eye, EyeOff } from "lucide-react"

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { signup } = useAuth()
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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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

      // Create user account with Firebase
      const result = await signup(formData.email, formData.password)

      // Store registration data temporarily for the next steps
      sessionStorage.setItem(
        "registrationData",
        JSON.stringify({
          email: formData.email,
          userId: result.user.uid,
          registrationStep: "personal-info",
          timestamp: new Date().toISOString(),
        }),
      )

      // Navigate to personal info step immediately
      navigate("/personal-info", { replace: true })
    } catch (error) {
      console.error("Registration error:", error)

      // Handle specific Firebase errors
      let errorMessage = "Failed to create account. Please try again."

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists"
          break
        case "auth/weak-password":
          errorMessage = "Password is too weak"
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address"
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

  function handleButtonClick(e) {
    console.log("Button clicked!", e)
    handleSubmit(e)
  }

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <button className="close-btn" onClick={() => navigate("/login")}>
          <X size={24} />
        </button>

        <div className="auth-tabs">
          <button className="tab active">Register</button>
          <Link to="/login" className="tab">
            Log in
          </Link>
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
          <span>or register with email</span>
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className={errors.confirmPassword ? "error" : ""}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading} onClick={handleButtonClick}>
            {loading ? "Creating Account..." : "Continue to Personal Info"}
          </button>
        </form>
      </div>
    </div>
  )
}
