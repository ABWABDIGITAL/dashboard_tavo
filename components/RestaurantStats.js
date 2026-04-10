'use client'

export default function RestaurantStats({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="card restaurant-stats loading-card">
        <div className="card-header">
          <h3 className="card-title">Restaurant Statistics</h3>
        </div>
        <div className="stats-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="stat-card skeleton-card">
              <div className="skeleton-text" style={{ width: '60%', height: '14px', marginBottom: '12px' }}></div>
              <div className="skeleton-text" style={{ width: '40%', height: '32px' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { byStatus, byCategory, topRated, total } = stats

  return (
    <div className="card restaurant-stats">
      <div className="card-header">
        <h3 className="card-title">Restaurant Statistics</h3>
        <span className="total-badge">{total} Total</span>
      </div>

      <div className="stats-sections">
        {/* Status Stats */}
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

        {/* Category Stats */}
        {byCategory && byCategory.length > 0 && (
          <div className="stats-section">
            <h4>By Category</h4>
            <div className="category-chips">
              {byCategory.map((cat) => (
                <div key={cat._id} className="category-chip">
                  <span className="chip-name">{cat.name}</span>
                  <span className="chip-count">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Rated */}
        {topRated && topRated.length > 0 && (
          <div className="stats-section">
            <h4>Top Rated Restaurants</h4>
            <div className="top-rated-list">
              {topRated.slice(0, 5).map((restaurant, index) => (
                <div key={restaurant._id} className="top-rated-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="top-rated-rank">#{index + 1}</div>
                  <div className="top-rated-info">
                    <span className="top-rated-name">{restaurant.en?.name || restaurant.ar?.name}</span>
                    <span className="top-rated-rating">
                      <span className="star">★</span> {restaurant.ratingsAverage} ({restaurant.ratingsQuantity} reviews)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
