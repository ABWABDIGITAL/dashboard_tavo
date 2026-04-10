'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Header({ title }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="header">
      <div className="header-title">
        <h1>{title}</h1>
        <span className="header-greeting">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</span>
      </div>
      <div className="user-controls">
        {isAdmin && (
          <span className="admin-badge">
            <span className="admin-icon">👑</span>
            Admin
          </span>
        )}
        <div className="user-menu-container" ref={menuRef}>
          <button
            className="user-menu-button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="user-name">{user?.name || 'User'}</span>
            <span className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`}>▼</span>
          </button>
          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-name">{user?.name}</div>
                <div className="dropdown-phone">{user?.phone}</div>
              </div>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item logout"
                onClick={() => { setUserMenuOpen(false); logout(); }}
              >
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
