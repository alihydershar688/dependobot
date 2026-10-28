"use client"
import "../login/login.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import { supabase } from "../../../supabase"

const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case "user_already_exists":
      return "An account already exists for this email. Try signing in instead."
    case "invalid_email":
      return "Enter a valid email address."
    case "invalid_credentials":
      return "The email or password is incorrect."
    case "email_not_confirmed":
      return "Confirm your email using the link we sent you, then sign in."
    case "weak_password":
      return "Choose a stronger password."
    case "over_email_send_rate_limit":
      return "Too many email requests. Wait a while, then try again."
    default:
      return error.message || "Authentication failed. Please try again."
  }
}

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

    if (!isLoginPage && !name.trim()) {
      setError("Please enter your name")
      setIsLoading(false)
      return
    }

    if (!supabase) {
      setError("Authentication is not configured. Add the Supabase URL and publishable key to the frontend environment.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLoginPage) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        setSuccess("Login successful! Redirecting to dashboard...")
        navigate("/landing")
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setSuccess("Account created. Check your email to confirm it, then sign in.")
          return
        }

        setSuccess("Account created successfully! Redirecting...")
        navigate("/landing")
      }
    } catch (err) {
      console.error(err)
      setError(getAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
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