"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { X, Search, MapPin, Clock, DollarSign, Users } from "lucide-react"

export default function AddressSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user came from personal info step
    const personalData = sessionStorage.getItem("personalInfoData")
    if (!personalData) {
      navigate("/personal-info")
      return
    }
  }, [navigate])

  async function handleUseCurrentLocation() {
    setLoading(true)
    try {
      // In a real app, you'd use geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Store location data
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              method: "geolocation",
            }
            sessionStorage.setItem("locationData", JSON.stringify(locationData))
            navigate("/address-form")
          },
          (error) => {
            console.error("Geolocation error:", error)
            // Fallback to manual entry
            navigate("/address-form")
          },
        )
      } else {
        // Geolocation not supported, go to manual entry
        navigate("/address-form")
      }
    } catch (error) {
      console.error("Location error:", error)
      navigate("/address-form")
    } finally {
      setLoading(false)
    }
  }

  function handleAddManually() {
    sessionStorage.setItem("locationData", JSON.stringify({ method: "manual" }))
    navigate("/address-form")
  }

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, you'd search for addresses using a geocoding service
      sessionStorage.setItem(
        "locationData",
        JSON.stringify({
          method: "search",
          query: searchQuery.trim(),
        }),
      )
      navigate("/address-form")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <button className="close-btn" onClick={() => navigate("/personal-info")}>
          <X size={24} />
        </button>

        <div className="step-header">
          <h2>Add address</h2>
          <span className="step-indicator">3 of 3</span>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch}>
            <div className="search-input">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search for address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
            </div>
          </form>

          <div className="privacy-note">Your address is not visible to other users</div>

          <div className="location-buttons">
            <button className="location-btn current" onClick={handleUseCurrentLocation} disabled={loading}>
              <MapPin size={16} />
              {loading ? "Getting location..." : "Use current location"}
            </button>
            <button className="location-btn manual" onClick={handleAddManually} disabled={loading}>
              Add manually
            </button>
          </div>
        </div>

        <div className="sharing-benefits">
          <h3>Sharing your address shows:</h3>
          <div className="benefit-item">
            <Users size={20} />
            <span>People near you</span>
          </div>
          <div className="benefit-item">
            <Clock size={20} />
            <span>Estimated delivery time</span>
          </div>
          <div className="benefit-item">
            <DollarSign size={20} />
            <span>Estimate shipping costs</span>
          </div>
        </div>
      </div>
    </div>
  )
}
