"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "./login.css"

export default function LoginPage() {
  const router = useRouter()
  const [countryCode, setCountryCode] = useState("+966")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!phone.trim()) {
      setError("Please enter your phone number")
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, phone })
      })

      if (!res.ok) throw new Error('Failed to send OTP')

      // Store phone info for OTP page
      sessionStorage.setItem('loginPhone', phone)
      sessionStorage.setItem('loginCountryCode', countryCode)
      
      router.push('/otp')
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Enter your phone number to continue</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="phone-input-container">
                <select 
                  value={countryCode} 
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-select"
                >
                  <option value="+966">+966</option>
                  <option value="+971">+971</option>
                  <option value="+965">+965</option>
                  <option value="+20">+20</option>
                  <option value="+962">+962</option>
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="520123456"
                  className="phone-input"
                  maxLength={10}
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span>Sending...</>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          <div className="security-note">
            Secure login with OTP verification
          </div>
        </div>
      </div>
    </div>
  )
}
