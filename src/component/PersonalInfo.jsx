"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { X, Calendar, ChevronDown, Info } from "lucide-react"

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    countryCode: "+598",
    phoneNumber: "",
    birthday: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { currentUser, saveUserProfile, updateUserProfile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user came from registration
    const registrationData = sessionStorage.getItem("registrationData")

    if (!registrationData) {
      console.log("No registration data found, redirecting to register")
      navigate("/register", { replace: true })
      return
    }

    if (!currentUser) {
      console.log("No current user, waiting for auth...")
      // Give some time for auth to load
      const timer = setTimeout(() => {
        if (!currentUser) {
          console.log("Still no user after timeout, redirecting to register")
          navigate("/register", { replace: true })
        }
      }, 2000)

      return () => clearTimeout(timer)
    }

    console.log("Personal info page loaded successfully")
  }, [currentUser, navigate])

  // Form validation
  function validateForm() {
    const newErrors = {}

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters long"
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full name can only contain letters and spaces"
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender"
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{8,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number (8-15 digits)"
    }

    // Birthday validation (optional but if provided, should be valid)
    if (formData.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(formData.birthday)) {
      newErrors.birthday = "Please enter a valid date (YYYY-MM-DD)"
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

      // Update user display name in Firebase Auth
      await updateUserProfile(formData.fullName)

      // Store personal info data temporarily
      const personalData = {
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        phoneNumber: formData.countryCode + formData.phoneNumber.replace(/\s/g, ""),
        birthday: formData.birthday || null,
        step: "address-search",
      }

      sessionStorage.setItem("personalInfoData", JSON.stringify(personalData))

      // Navigate to address search
      navigate("/address-search")
    } catch (error) {
      console.error("Error saving personal info:", error)
      setErrors({ submit: "Failed to save information. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <button className="close-btn" onClick={() => navigate("/register")}>
          <X size={24} />
        </button>

        <div className="step-header">
          <h2>Personal information</h2>
          <span className="step-indicator">2 of 3</span>
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              name="fullName"
              type="text"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={errors.fullName ? "error" : ""}
              disabled={loading}
              required
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="radio-custom male"></span>
                Male
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="radio-custom female"></span>
                Female
              </label>
            </div>
            {errors.gender && <span className="field-error">{errors.gender}</span>}
          </div>

          <div className="info-text">
            <Info size={16} />
            <span>The phone number and birthday are only visible to you</span>
          </div>

          <div className="form-group phone-group">
            <div className="country-code">
              <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} disabled={loading}>
                <option value="+598">+598</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+33">+33</option>
                <option value="+49">+49</option>
              </select>
              <ChevronDown size={16} />
            </div>
            <input
              name="phoneNumber"
              type="tel"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={errors.phoneNumber ? "error" : ""}
              disabled={loading}
              required
            />
          </div>
          {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}

          <div className="form-group birthday-group">
            <input
              name="birthday"
              type="date"
              placeholder="Birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              className={errors.birthday ? "error" : ""}
              disabled={loading}
            />
            <span className="optional">Optional</span>
            <Calendar size={20} className="calendar-icon" />
            {errors.birthday && <span className="field-error">{errors.birthday}</span>}
          </div>

          <div className="birthday-info">Let us know about your birthday so as not to miss a gift</div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save information"}
          </button>
        </form>
      </div>
    </div>
  )
}
