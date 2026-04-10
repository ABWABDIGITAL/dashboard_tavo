'use client'

export default function FinancialsOverview({ data, loading }) {
  if (loading) {
    return (
      <div className="stats-grid skeleton-stats">
        <div className="card stat-card">
          <div className="skeleton-text" style={{ width: '100px', height: '24px' }}></div>
          <div className="skeleton-text" style={{ width: '80px', height: '32px', marginTop: '10px' }}></div>
        </div>
        <div className="card stat-card">
          <div className="skeleton-text" style={{ width: '100px', height: '24px' }}></div>
          <div className="skeleton-text" style={{ width: '80px', height: '32px', marginTop: '10px' }}></div>
        </div>
        <div className="card stat-card">
          <div className="skeleton-text" style={{ width: '100px', height: '24px' }}></div>
          <div className="skeleton-text" style={{ width: '80px', height: '32px', marginTop: '10px' }}></div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { revenue, payouts, refunds } = data

  const formatCurrency = (amount) => {
    return `SAR ${(amount || 0).toLocaleString()}`
  }

  return (
    <div className="stats-grid financials-overview">
      {/* Revenue Card */}
      <div className="card stat-card revenue-card">
        <div className="stat-icon">💰</div>
        <div className="stat-header">
          <h3 className="stat-title">Total Revenue</h3>
        </div>
        <div className="stat-value-large">{formatCurrency(revenue?.total)}</div>
        <div className="stat-subtitle">All time revenue</div>
      </div>

      {/* Payouts Card */}
      <div className="card stat-card payouts-card">
        <div className="stat-icon">🏦</div>
        <div className="stat-header">
          <h3 className="stat-title">Payouts</h3>
        </div>
        <div className="stat-value-large">{formatCurrency(payouts?.total)}</div>
        <div className="stat-subtitle">
          {payouts?.pending > 0 && (
            <span className="pending-badge">{payouts.pending} pending</span>
          )}
        </div>
      </div>

      {/* Refunds Card */}
      <div className="card stat-card refunds-card">
        <div className="stat-icon">↩️</div>
        <div className="stat-header">
          <h3 className="stat-title">Pending Refunds</h3>
        </div>
        <div className="stat-value-large">{refunds?.pending || 0}</div>
        <div className="stat-subtitle">Awaiting processing</div>
      </div>
    </div>
  )
}
