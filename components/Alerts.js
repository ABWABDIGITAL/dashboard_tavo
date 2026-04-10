'use client'

export default function Alerts({ data, loading }) {
  if (loading) {
    return (
      <div className="card alerts-card loading-card">
        <div className="card-header">
          <h3 className="card-title">Alerts</h3>
          <div className="skeleton-badge"></div>
        </div>
        <div className="alerts-list">
          {[1,2,3].map(i => (
            <div key={i} className="alert-item skeleton-item">
              <div className="skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-text" style={{ width: '180px' }}></div>
                <div className="skeleton-text" style={{ width: '80px', height: '12px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const hasAlerts = data && data.length > 0

  return (
    <div className={`card alerts-card ${!hasAlerts ? 'no-alerts' : ''}`}>
      <div className="card-header">
        <h3 className="card-title">System Alerts</h3>
        {hasAlerts && (
          <span className="alert-count pulse">{data.length}</span>
        )}
      </div>

      {!hasAlerts ? (
        <div className="alerts-empty">
          <div className="status-circle success">
            <span className="status-icon">✓</span>
          </div>
          <span className="status-text">All systems operational</span>
          <span className="status-subtext">No issues detected</span>
        </div>
      ) : (
        <div className="alerts-list">
          {data.map((alert, index) => (
            <div
              key={index}
              className={`alert-item ${alert.severity || 'warning'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`alert-indicator ${alert.severity || 'warning'}`}></div>
              <span className="alert-icon">
                {alert.severity === 'error' ? '🔴' : alert.severity === 'warning' ? '🟡' : '🔵'}
              </span>
              <div className="alert-content">
                <span className="alert-message">{alert.message}</span>
                <span className="alert-time">{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
