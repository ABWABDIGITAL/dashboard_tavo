'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import './otp.css'

export default function OtpPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(60)
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const inputRefs = useRef([])

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('loginPhone')
    const storedCountryCode = sessionStorage.getItem('loginCountryCode')
    
    if (!storedPhone) {
      router.push('/login')
      return
    }
    
    setPhone(storedPhone)
    setCountryCode(storedCountryCode)
  }, [router])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(digit => digit)) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (otpCode) => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          countryCode, 
          phone, 
          otp: otpCode 
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Invalid OTP')

      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      sessionStorage.removeItem('loginPhone')
      sessionStorage.removeItem('loginCountryCode')

      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, phone })
      })

      if (!res.ok) throw new Error('Failed to resend OTP')

      setResendTimer(60)
    } catch (err) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="otp-page">
      <div className="otp-container">
        <div className="otp-card">
          <div className="otp-header">
            <h1 className="otp-title">Verify Phone Number</h1>
            <p className="otp-subtitle">
              Enter the 4-digit code sent to <span className="phone-display">{countryCode} {phone}</span>
            </p>
          </div>

          {error && <div className="otp-error">{error}</div>}

          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                disabled={loading}
              />
            ))}
          </div>

          <div className="otp-resend">
            {resendTimer > 0 ? (
              <span className="resend-timer">Resend code in {resendTimer}s</span>
            ) : (
              <button 
                onClick={handleResend} 
                className="resend-button"
                disabled={loading}
              >
                Resend Code
              </button>
            )}
          </div>

          <button
            onClick={() => handleSubmit(otp.join(''))}
            className="verify-button"
            disabled={loading || otp.some(d => !d)}
          >
            {loading ? (
              <><span className="spinner"></span>Verifying...</>
            ) : (
              'Verify'
            )}
          </button>

          <button 
            onClick={() => router.push('/login')}
            className="back-button"
          >
            Change Phone Number
          </button>
        </div>
      </div>
    </div>
  )
}
