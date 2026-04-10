'use client'

import { useMemo, useEffect, useState } from 'react'

export default function RevenueChart({ data, loading }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    return data.map(item => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
      total: item.total,
      count: item.count
    }))
  }, [data])

  const maxRevenue = useMemo(() => {
    if (!chartData.length) return 0
    return Math.max(...chartData.map(d => d.total))
  }, [chartData])

  const totalRevenue = useMemo(() => {
    if (!chartData.length) return 0
    return chartData.reduce((sum, d) => sum + d.total, 0)
  }, [chartData])

  const totalOrders = useMemo(() => {
    if (!chartData.length) return 0
    return chartData.reduce((sum, d) => sum + d.count, 0)
  }, [chartData])

  const [animatedBars, setAnimatedBars] = useState({})

  useEffect(() => {
    const timer = setTimeout(() => {
      const bars = {}
      chartData.forEach((item, index) => {
        bars[index] = maxRevenue > 0 ? (item.total / maxRevenue) * 100 : 0
      })
      setAnimatedBars(bars)
    }, 100)
    return () => clearTimeout(timer)
  }, [chartData, maxRevenue])

  if (loading) {
    return (
      <div className="card revenue-chart loading-card">
        <div className="card-header">
          <h3 className="card-title">Revenue Trend</h3>
          <div className="skeleton-text" style={{ width: '120px' }}></div>
        </div>
        <div className="chart-skeleton">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="skeleton-bar" style={{ height: `${20 + Math.random() * 60}%` }}></div>
          ))}
        </div>
      </div>
    )
  }

  if (!chartData.length) {
    return (
      <div className="card revenue-chart">
        <div className="card-header">
          <h3 className="card-title">Revenue Trend</h3>
        </div>
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <span>No revenue data available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card revenue-chart">
      <div className="card-header">
        <h3 className="card-title">Revenue Trend</h3>
        <div className="chart-summary">
          <div className="summary-pill">
            <span className="summary-value">${totalRevenue.toLocaleString()}</span>
            <span className="summary-label">Total Revenue</span>
          </div>
          <div className="summary-pill">
            <span className="summary-value">{totalOrders.toLocaleString()}</span>
            <span className="summary-label">Orders</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-bars">
          {chartData.map((item, index) => (
            <div key={index} className="chart-bar-wrapper">
              <div className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{ height: `${Math.max(animatedBars[index] || 0, 2)}%` }}
                  title={`${item.date}: $${item.total} (${item.count} orders)`}
                >
                  <div className="bar-glow"></div>
                </div>
              </div>
              <div className="bar-tooltip">
                <span className="tooltip-date">{item.date}</span>
                <span className="tooltip-value">${item.total.toLocaleString()}</span>
                <span className="tooltip-orders">{item.count} orders</span>
              </div>
              <span className="bar-label">{item.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
