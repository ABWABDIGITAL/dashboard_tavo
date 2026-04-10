'use client'

import { useEffect, useState } from 'react'

export default function RealtimeStats({ data, loading }) {
  const [animatedValues, setAnimatedValues] = useState({})

  const stats = [
    { label: 'Active Users', value: data?.activeUsers || 0, icon: '👤', color: 'blue' },
    { label: 'Orders Last Hour', value: data?.ordersLastHour || 0, icon: '📦', color: 'green' },
    { label: 'Reservations Today', value: data?.reservationsToday || 0, icon: '📅', color: 'purple' },
    { label: 'Errors Last Hour', value: data?.errorsLastHour || 0, icon: '⚠️', danger: true }
  ]

  useEffect(() => {
    stats.forEach((stat, index) => {
      const target = stat.value
      let current = 0
      const duration = 1000
      const step = target / (duration / 16)

      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setAnimatedValues(prev => ({ ...prev, [index]: Math.floor(current) }))
      }, 16)

      return () => clearInterval(timer)
    })
  }, [data])

  if (loading) {
    return (
      <div className="card realtime-stats loading-card">
        <div className="card-header">
          <h3 className="card-title">Realtime Stats</h3>
          <div className="skeleton-text" style={{ width: '60px' }}></div>
        </div>
        <div className="realtime-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="realtime-item skeleton-item">
              <div className="skeleton-icon"></div>
              <div className="skeleton-text-container">
                <div className="skeleton-text" style={{ width: '40px', height: '24px' }}></div>
                <div className="skeleton-text" style={{ width: '80px', height: '14px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card realtime-stats">
      <div className="card-header">
        <h3 className="card-title">Realtime Stats</h3>
        <span className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">Live</span>
        </span>
      </div>
      <div className="realtime-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`realtime-item ${stat.danger && stat.value > 0 ? 'has-error' : ''} ${stat.color || ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="realtime-icon">{stat.icon}</span>
            <div className="realtime-info">
              <span className="realtime-value">{animatedValues[index] || 0}</span>
              <span className="realtime-label">{stat.label}</span>
            </div>
            <div className="stat-glow"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
