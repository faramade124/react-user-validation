"use client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { X } from "lucide-react"

export default function SuccessScreen() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      handleGoToLogin()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  async function handleGoToLogin() {
    try {
      // Log out the user so they can log in fresh
      await logout()
      // Navigate to login screen
      navigate("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      // Navigate anyway
      navigate("/login")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-modal success-modal">
        <button className="close-btn" onClick={handleGoToLogin}>
          <X size={24} />
        </button>

        <div className="success-content">
          <div className="success-illustration">
            <img src="/public/images/success-illustration.png" alt="Success illustration" />
          </div>

          <h2 className="success-title">You are successfully registered!</h2>

          <button className="submit-btn" onClick={handleGoToLogin}>
            Go to Login
          </button>

          <p className="auto-redirect">You will be automatically redirected to login in a few seconds...</p>
        </div>
      </div>
    </div>
  )
}
