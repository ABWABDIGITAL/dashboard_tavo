'use client'

export default function UserStats({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="card">
        <div className="loading">Loading stats...</div>
      </div>
    )
  }

  const { byRole, byStatus, byMonth, total } = stats

  return (
    <div className="card user-stats">
      <div className="card-header">
        <h3 className="card-title">User Statistics</h3>
        <span className="total-users">{total} Total</span>
      </div>

      <div className="stats-sections">
        <div className="stats-section">
          <h4>By Role</h4>
          <div className="stats-bars">
            {Object.entries(byRole || {}).map(([role, count]) => (
              <div key={role} className="stat-bar-item">
                <span className="stat-label">{role}</span>
                <div className="stat-bar-wrapper">
                  <div 
                    className={`stat-bar ${role}`} 
                    style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h4>By Status</h4>
          <div className="stats-bars">
            {Object.entries(byStatus || {}).map(([status, count]) => (
              <div key={status} className="stat-bar-item">
                <span className="stat-label">{status}</span>
                <div className="stat-bar-wrapper">
                  <div 
                    className={`stat-bar ${status}`} 
                    style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {byMonth && byMonth.length > 0 && (
          <div className="stats-section">
            <h4>New Users by Month</h4>
            <div className="month-stats">
              {byMonth.map((month) => (
                <div key={`${month._id.year}-${month._id.month}`} className="month-item">
                  <span className="month-label">{month._id.year}-{String(month._id.month).padStart(2, '0')}</span>
                  <span className="month-count">{month.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
