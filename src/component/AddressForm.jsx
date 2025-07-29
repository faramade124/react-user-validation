"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { X } from "lucide-react"

export default function AddressForm() {
  const [formData, setFormData] = useState({
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { currentUser, saveUserProfile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user came from address search step
    const locationData = sessionStorage.getItem("locationData")
    const personalData = sessionStorage.getItem("personalInfoData")

    if (!locationData || !personalData) {
      navigate("/address-search")
      return
    }

    // Pre-fill form if coming from search
    const location = JSON.parse(locationData)
    if (location.method === "search" && location.query) {
      // In a real app, you'd parse the search query or use geocoding results
      setFormData((prev) => ({
        ...prev,
        streetAddress: location.query,
      }))
    }
  }, [navigate])

  // Form validation
  function validateForm() {
    const newErrors = {}

    // Street address validation
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required"
    } else if (formData.streetAddress.trim().length < 5) {
      newErrors.streetAddress = "Please enter a complete street address"
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "Please enter a valid city name"
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    } else if (formData.state.trim().length < 2) {
      newErrors.state = "Please enter a valid state"
    }

    // Zip code validation
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required"
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = "Please enter a valid zip code (e.g., 12345 or 12345-6789)"
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

      // Get personal info data
      const personalData = JSON.parse(sessionStorage.getItem("personalInfoData"))
      const registrationData = JSON.parse(sessionStorage.getItem("registrationData"))

      // Combine all user data
      const completeUserData = {
        email: registrationData.email,
        fullName: personalData.fullName,
        gender: personalData.gender,
        phoneNumber: personalData.phoneNumber,
        birthday: personalData.birthday,
        address: {
          streetAddress: formData.streetAddress.trim(),
          apartment: formData.apartment.trim() || null,
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
        },
        registrationCompleted: true,
      }

      // Save complete user profile to Firestore
      await saveUserProfile(currentUser.uid, completeUserData)

      // Clear session storage
      sessionStorage.removeItem("registrationData")
      sessionStorage.removeItem("personalInfoData")
      sessionStorage.removeItem("locationData")

      // Navigate to success screen
      navigate("/success")
    } catch (error) {
      console.error("Error saving address:", error)
      setErrors({ submit: "Failed to save address. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <button className="close-btn" onClick={() => navigate("/address-search")}>
          <X size={24} />
        </button>

        <div className="step-header">
          <h2>Add address</h2>
          <span className="step-indicator">3 of 3</span>
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              name="streetAddress"
              type="text"
              placeholder="Street address"
              value={formData.streetAddress}
              onChange={handleInputChange}
              className={errors.streetAddress ? "error" : ""}
              disabled={loading}
              required
            />
            {errors.streetAddress && <span className="field-error">{errors.streetAddress}</span>}
          </div>

          <div className="form-group">
            <input
              name="apartment"
              type="text"
              placeholder="Apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="optional">Optional</span>
          </div>

          <div className="form-group">
            <input
              name="city"
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className={errors.city ? "error" : ""}
              disabled={loading}
              required
            />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                name="state"
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className={errors.state ? "error" : ""}
                disabled={loading}
                required
              />
              {errors.state && <span className="field-error">{errors.state}</span>}
            </div>
            <div className="form-group">
              <input
                name="zipCode"
                type="text"
                placeholder="Zip code"
                value={formData.zipCode}
                onChange={handleInputChange}
                className={errors.zipCode ? "error" : ""}
                disabled={loading}
                required
              />
              {errors.zipCode && <span className="field-error">{errors.zipCode}</span>}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save information"}
          </button>
        </form>
      </div>
    </div>
  )
}
