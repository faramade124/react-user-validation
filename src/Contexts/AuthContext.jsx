"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  // Sign up with email and password
  async function signup(email, password) {
    try {
      console.log("Attempting to create user with email:", email)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log("User created successfully:", result.user.uid)
      return result
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  // Login with email and password
  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error) {
      throw error
    }
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth)
      setUserProfile(null)
    } catch (error) {
      throw error
    }
  }

  // Save user profile data to Firestore
  async function saveUserProfile(userId, profileData) {
    try {
      await setDoc(doc(db, "users", userId), {
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      setUserProfile(profileData)
    } catch (error) {
      throw error
    }
  }

  // Get user profile data from Firestore
  async function getUserProfile(userId) {
    try {
      const docRef = doc(db, "users", userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const profileData = docSnap.data()
        setUserProfile(profileData)
        return profileData
      } else {
        return null
      }
    } catch (error) {
      throw error
    }
  }

  // Update user display name
  async function updateUserProfile(displayName) {
    try {
      if (currentUser) {
        await updateProfile(currentUser, { displayName })
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        // Fetch user profile data when user is authenticated
        try {
          await getUserProfile(user.uid)
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    saveUserProfile,
    getUserProfile,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
