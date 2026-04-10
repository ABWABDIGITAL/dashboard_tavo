'use client'

export default function OrderStats({ stats, loading }) {
  if (loading) {
    return (
      <div className="stats-grid skeleton-stats">
        <div className="card stat-card">
          <div className="skeleton-text" style={{ width: '100px', height: '24px' }}></div>
          <div className="skeleton-text" style={{ width: '60px', height: '32px', marginTop: '10px' }}></div>
        </div>
        <div className="card stat-card">
          <div className="skeleton-text" style={{ width: '120px', height: '24px' }}></div>
          <div className="skeleton-text" style={{ width: '80px', height: '32px', marginTop: '10px' }}></div>
        </div>
        <div className="card stat-card">
          <div className="skeleton-text" style={{ width: '100px', height: '24px' }}></div>
          <div className="skeleton-text" style={{ width: '70px', height: '32px', marginTop: '10px' }}></div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const { byStatus, byPaymentStatus, revenue } = stats

  const statusColors = {
    draft: '#64748b',
    confirmed: '#22c55e',
    delivered: '#8b5cf6',
    cancelled: '#ef4444'
  }

  const paymentColors = {
    pending: '#f59e0b',
    paid: '#22c55e',
    refunded: '#64748b'
  }

  return (
    <div className="stats-grid order-stats">
      {/* Revenue Card */}
      <div className="card stat-card revenue-card">
        <div className="stat-header">
          <h3 className="stat-title">Total Revenue</h3>
          <span className="stat-badge paid">Paid Orders</span>
        </div>
        <div className="stat-value-large">
          SAR {revenue?.total?.toLocaleString() || 0}
        </div>
        <div className="stat-subtitle">
          From {revenue?.orderCount || 0} paid orders
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="card stat-card">
        <div className="stat-header">
          <h3 className="stat-title">Orders by Status</h3>
        </div>
        <div className="status-bars">
          {byStatus && Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="status-bar-item">
              <div className="bar-label">
                <span className="bar-name">{status}</span>
                <span className="bar-count">{count}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${Math.min(100, (count / (Object.values(byStatus).reduce((a, b) => a + b, 0) || 1)) * 100)}%`,
                    backgroundColor: statusColors[status] || '#667eea'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Status Breakdown */}
      <div className="card stat-card">
        <div className="stat-header">
          <h3 className="stat-title">Payment Status</h3>
        </div>
        <div className="status-bars">
          {byPaymentStatus && Object.entries(byPaymentStatus).map(([status, count]) => (
            <div key={status} className="status-bar-item">
              <div className="bar-label">
                <span className="bar-name">{status}</span>
                <span className="bar-count">{count}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${Math.min(100, (count / (Object.values(byPaymentStatus).reduce((a, b) => a + b, 0) || 1)) * 100)}%`,
                    backgroundColor: paymentColors[status] || '#667eea'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
