'use client'

import { useState } from 'react'

export default function RestaurantsList({ 
  restaurants, 
  pagination, 
  onPageChange, 
  onRestaurantSelect, 
  onCreateRestaurant,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRestaurants = restaurants.filter(restaurant => {
    const name = restaurant.en?.name || restaurant.ar?.name || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">Active</span>
      case 'inactive':
        return <span className="status-badge suspended">Inactive</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="card restaurants-list loading-card">
        <div className="card-header">
          <h3 className="card-title">Restaurants</h3>
        </div>
        <div className="filters-bar skeleton-filters">
          <div className="skeleton-text" style={{ width: '200px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '150px', height: '40px' }}></div>
        </div>
        <div className="restaurants-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="restaurant-card skeleton-card">
              <div className="skeleton-image" style={{ height: '160px' }}></div>
              <div style={{ padding: '16px' }}>
                <div className="skeleton-text" style={{ width: '70%', height: '20px', marginBottom: '8px' }}></div>
                <div className="skeleton-text" style={{ width: '40%', height: '14px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card restaurants-list">
      <div className="card-header">
        <h3 className="card-title">Restaurants Management</h3>
        <button className="btn btn-primary" onClick={onCreateRestaurant}>
          <span>+</span> New Restaurant
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input search-input"
        />
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="form-input filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="restaurants-grid">
        {filteredRestaurants.map((restaurant, index) => (
          <div 
            key={restaurant._id} 
            className="restaurant-card"
            onClick={() => onRestaurantSelect(restaurant)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="restaurant-image">
              <img 
                src={restaurant.logo?.imageUrl || restaurant.image?.[0]?.imageUrl || '/placeholder-restaurant.png'} 
                alt={restaurant.en?.name || restaurant.ar?.name}
                onError={(e) => { e.target.src = '/placeholder-restaurant.png' }}
              />
              <div className="restaurant-overlay">
                <span className="view-details">View Details</span>
              </div>
            </div>
            <div className="restaurant-info-card">
              <div className="restaurant-header">
                <h4 className="restaurant-name-card">{restaurant.en?.name || restaurant.ar?.name}</h4>
                {getStatusBadge(restaurant.status)}
              </div>
              <p className="restaurant-description">{restaurant.en?.description || restaurant.ar?.description}</p>
              <div className="restaurant-meta-card">
                <span className="rating">
                  <span className="star">★</span> {restaurant.ratingsAverage} ({restaurant.ratingsQuantity})
                </span>
                <span className="phone">{restaurant.phone}</span>
              </div>
              <div className="restaurant-categories">
                {restaurant.categoryIds?.slice(0, 2).map(cat => (
                  <span key={cat._id} className="category-tag">
                    {cat.en?.name || cat.ar?.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination && (
        <div className="pagination">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="btn btn-sm btn-secondary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="btn btn-sm btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
