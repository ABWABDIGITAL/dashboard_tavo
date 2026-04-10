'use client'

export default function TopRestaurants({ data, loading }) {
  if (loading) {
    return (
      <div className="card top-restaurants loading-card">
        <div className="card-header">
          <h3 className="card-title">Top Restaurants</h3>
        </div>
        <div className="restaurants-list">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="restaurant-item skeleton-item">
              <div className="skeleton-rank"></div>
              <div className="skeleton-info">
                <div className="skeleton-text" style={{ width: '120px' }}></div>
                <div className="skeleton-text" style={{ width: '60px', height: '12px' }}></div>
              </div>
              <div className="skeleton-text" style={{ width: '80px' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="card top-restaurants">
        <div className="card-header">
          <h3 className="card-title">Top Restaurants</h3>
        </div>
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <span>No restaurant data available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card top-restaurants">
      <div className="card-header">
        <h3 className="card-title">Top Restaurants</h3>
        <span className="subtitle">By Revenue</span>
      </div>
      <div className="restaurants-list">
        {data.map((restaurant, index) => (
          <div
            key={restaurant._id}
            className={`restaurant-item rank-${index + 1}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="restaurant-rank">
              {index === 0 && <span className="rank-badge gold">🥇</span>}
              {index === 1 && <span className="rank-badge silver">🥈</span>}
              {index === 2 && <span className="rank-badge bronze">🥉</span>}
              {index > 2 && <span className="rank-badge">#{index + 1}</span>}
            </div>
            <div className="restaurant-info">
              <span className="restaurant-name">{restaurant.name}</span>
              <span className="restaurant-meta">{restaurant.orderCount.toLocaleString()} orders</span>
            </div>
            <div className="restaurant-revenue">
              <span className="revenue-amount">${restaurant.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="rank-progress" style={{ width: `${(restaurant.totalRevenue / data[0].totalRevenue) * 100}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}
