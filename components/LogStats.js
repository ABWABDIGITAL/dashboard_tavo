'use client'

export default function LogStats({ stats, loading }) {
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

  const { byCategory, topActions, topActors } = stats

  const categoryColors = {
    'user': '#3b82f6',
    'restaurant': '#22c55e',
    'order': '#f59e0b',
    'reservation': '#8b5cf6',
    'staff': '#ec4899',
    'financials': '#06b6d4',
    'settings': '#64748b',
    'system': '#94a3b8'
  }

  const actionColors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'
  ]

  return (
    <div className="stats-grid log-stats">
      {/* Category Breakdown */}
      <div className="card stat-card">
        <div className="stat-header">
          <h3 className="stat-title">By Category</h3>
        </div>
        <div className="status-bars">
          {byCategory && Object.entries(byCategory).map(([category, count]) => (
            <div key={category} className="status-bar-item">
              <div className="bar-label">
                <span className="bar-name capitalize">{category}</span>
                <span className="bar-count">{count}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${Math.min(100, (count / (Object.values(byCategory).reduce((a, b) => a + b, 0) || 1)) * 100)}%`,
                    backgroundColor: categoryColors[category] || '#667eea'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Actions */}
      <div className="card stat-card">
        <div className="stat-header">
          <h3 className="stat-title">Top Actions</h3>
        </div>
        <div className="top-actions-list">
          {topActions && topActions.map((action, index) => (
            <div key={action._id} className="top-item">
              <div className="top-item-info">
                <span className="top-rank">#{index + 1}</span>
                <span className="top-name">{action._id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
              <div className="top-count">
                <span className="count-value">{action.count}</span>
                <div 
                  className="count-bar" 
                  style={{ 
                    width: `${Math.min(100, (action.count / (topActions[0]?.count || 1)) * 100)}%`,
                    backgroundColor: actionColors[index % actionColors.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Actors */}
      <div className="card stat-card">
        <div className="stat-header">
          <h3 className="stat-title">Top Actors</h3>
        </div>
        <div className="top-actors-list">
          {topActors && topActors.map((actor, index) => (
            <div key={actor._id} className="top-actor-item">
              <div className="actor-rank">{index + 1}</div>
              <div className="actor-avatar-text">
                {actor.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="actor-info">
                <span className="actor-name">{actor.name || 'Unknown'}</span>
                <span className="actor-count">{actor.count} actions</span>
              </div>
              <div className="actor-percentage">
                {actor.count} logs
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
