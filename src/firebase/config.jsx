import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyAg0YVdq9y1dRTMIMysaN09FMAECSm-KiY",
  authDomain: "react-dashboad-project1.firebaseapp.com",
  projectId: "react-dashboad-project1",
  storageBucket: "react-dashboad-project1.firebasestorage.app",
  messagingSenderId: "984676820243",
  appId: "1:984676820243:web:21d0f967fd54bd7953e6e6",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
