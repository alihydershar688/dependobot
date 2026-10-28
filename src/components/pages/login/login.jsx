"use client"
import "../login/login.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import { auth, db } from "../../../firebase"
import { doc, setDoc } from "firebase/firestore"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
const AuthPages = () => {
  const [isLoginPage, setIsLoginPage] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (!isLoginPage && !name) {
      setError("Please enter your name")
      setIsLoading(false)
      return
    }

    if (!auth || !db) {
      setError("Firebase is not configured. Add the required values from .env.example.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLoginPage) {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password)
        setSuccess("Login successful! Redirecting to dashboard...")
        navigate("/landing") // 👈 Redirect here
      } else {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await setDoc(doc(db, "user", user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
        })
        setSuccess("Account created successfully! Redirecting...")
        navigate("/landing") // 👈 Redirect here
      }
    } catch (err) {
      console.error(err)
      setError(err.message || "Something went wrong.")
    }
    
  }

  const togglePage = () => {
    setIsLoginPage(!isLoginPage)
    setError("")
    setSuccess("")
    setEmail("")
    setPassword("")
    setName("")
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-brand">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Github Repo Vularibility Scanner </h2>
          <p>Welcome to our secure platform</p>
        </div>

        <div className="auth-card">
          <h1>{isLoginPage ? "Welcome back" : "Create account"}</h1>
          <p className="subtitle">
            {isLoginPage
              ? "Enter your credentials to access your account"
              : "Fill in your details to get started with your account"}
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleEmailAuth}>
            {!isLoginPage && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLoginPage ? "Enter your password" : "Create a strong password"}
                />
              </div>
            </div>

            <button type="submit" className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading}>
              {isLoading ? <span className="loader"></span> : isLoginPage ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="toggle-text">
            {isLoginPage ? "Don't have an account? " : "Already have an account? "}
            <button onClick={togglePage} className="toggle-btn">
              {isLoginPage ? "Sign up now" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      
    </div>
  )
}

export default AuthPages