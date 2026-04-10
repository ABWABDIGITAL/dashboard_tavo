'use client'

export default function TicketStats({ stats, loading }) {
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

  const { byStatus, byCategory, byPriority } = stats

  const statusColors = {
    'open': '#3b82f6',
    'in-progress': '#f59e0b',
    'resolved': '#22c55e',
    'closed': '#64748b'
  }

  const priorityColors = {
    'low': '#22c55e',
    'medium': '#f59e0b',
    'high': '#ef4444',
    'urgent': '#b91c1c'
  }

  return (
    <div className="stats-grid ticket-stats">
      {/* Status Breakdown */}
      <div className="card stat-card">
        <div className="stat-header">
          <h3 className="stat-title">By Status</h3>
        </div>
        <div className="status-bars">
          {byStatus && Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="status-bar-item">
              <div className="bar-label">
                <span className="bar-name">{status.replace('-', ' ')}</span>
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

      {/* Priority Breakdown */}
      <div className="card stat-card">
        <div className="stat-header">
          <h3 className="stat-title">By Priority</h3>
        </div>
        <div className="status-bars">
          {byPriority && Object.entries(byPriority).map(([priority, count]) => (
            <div key={priority} className="status-bar-item">
              <div className="bar-label">
                <span className="bar-name">{priority}</span>
                <span className="bar-count">{count}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${Math.min(100, (count / (Object.values(byPriority).reduce((a, b) => a + b, 0) || 1)) * 100)}%`,
                    backgroundColor: priorityColors[priority] || '#667eea'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card stat-card">
        <div className="stat-header">
          <h3 className="stat-title">By Category</h3>
        </div>
        <div className="category-chips">
          {byCategory && Object.entries(byCategory).map(([category, count]) => (
            <div key={category} className="category-chip">
              <span className="chip-name">{category}</span>
              <span className="chip-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
