'use client'

import { useState, useEffect } from 'react'

export default function RestaurantDetail({ 
  restaurant, 
  onClose, 
  onSave, 
  onActivate, 
  onDeactivate,
  onDelete,
  isCreating = false 
}) {
  const [formData, setFormData] = useState({
    ar: { name: '', description: '', address: '' },
    en: { name: '', description: '', address: '' },
    phone: '',
    categoryIds: [],
    status: 'active'
  })
  const [activeTab, setActiveTab] = useState('en')
  const [isEditing, setIsEditing] = useState(isCreating)

  useEffect(() => {
    if (restaurant && !isCreating) {
      setFormData({
        ar: {
          name: restaurant.ar?.name || '',
          description: restaurant.ar?.description || '',
          address: restaurant.ar?.address || ''
        },
        en: {
          name: restaurant.en?.name || '',
          description: restaurant.en?.description || '',
          address: restaurant.en?.address || ''
        },
        phone: restaurant.phone || '',
        categoryIds: restaurant.categoryIds?.map(c => c._id) || [],
        status: restaurant.status || 'active'
      })
    }
  }, [restaurant, isCreating])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(restaurant?._id, formData)
  }

  const handleChange = (lang, field, value) => {
    setFormData(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }))
  }

  if (!restaurant && !isCreating) return null

  const displayData = isCreating ? formData : restaurant

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content restaurant-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isCreating ? 'Create Restaurant' : isEditing ? 'Edit Restaurant' : 'Restaurant Details'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="restaurant-detail-content">
          {/* View Mode */}
          {!isEditing && !isCreating && (
            <>
              <div className="restaurant-header-detail">
                <img 
                  src={restaurant.logo?.imageUrl || restaurant.image?.[0]?.imageUrl} 
                  alt={restaurant.en?.name}
                  className="restaurant-logo-large"
                />
                <div className="restaurant-title-section">
                  <h3>{restaurant.en?.name}</h3>
                  <p className="restaurant-name-ar">{restaurant.ar?.name}</p>
                  <span className={`status-badge ${restaurant.status}`}>
                    {restaurant.status}
                  </span>
                </div>
              </div>

              <div className="restaurant-info-sections">
                <div className="info-section">
                  <h4>Description</h4>
                  <p>{restaurant.en?.description}</p>
                  <p className="text-ar">{restaurant.ar?.description}</p>
                </div>

                <div className="info-section">
                  <h4>Contact & Location</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Phone</label>
                      <span>{restaurant.phone}</span>
                    </div>
                    <div className="info-item">
                      <label>Address (EN)</label>
                      <span>{restaurant.en?.address}</span>
                    </div>
                    <div className="info-item">
                      <label>Address (AR)</label>
                      <span>{restaurant.ar?.address}</span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h4>Categories</h4>
                  <div className="categories-list">
                    {restaurant.categoryIds?.map(cat => (
                      <span key={cat._id} className="category-badge">
                        {cat.en?.name || cat.ar?.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-section">
                  <h4>Ratings</h4>
                  <div className="rating-display">
                    <span className="rating-stars">
                      {'★'.repeat(Math.floor(restaurant.ratingsAverage))}
                      {'☆'.repeat(5 - Math.floor(restaurant.ratingsAverage))}
                    </span>
                    <span className="rating-value">{restaurant.ratingsAverage}</span>
                    <span className="rating-count">({restaurant.ratingsQuantity} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                {restaurant.status === 'active' ? (
                  <button className="btn btn-warning" onClick={() => onDeactivate(restaurant._id)}>
                    Deactivate
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={() => onActivate(restaurant._id)}>
                    Activate
                  </button>
                )}
                <button className="btn btn-danger" onClick={() => onDelete(restaurant._id)}>
                  Delete
                </button>
              </div>
            </>
          )}

          {/* Edit/Create Mode */}
          {(isEditing || isCreating) && (
            <form onSubmit={handleSubmit} className="restaurant-form">
              <div className="language-tabs">
                <button 
                  type="button"
                  className={`tab ${activeTab === 'en' ? 'active' : ''}`}
                  onClick={() => setActiveTab('en')}
                >
                  English
                </button>
                <button 
                  type="button"
                  className={`tab ${activeTab === 'ar' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ar')}
                >
                  Arabic
                </button>
              </div>

              {activeTab === 'en' && (
                <div className="form-section">
                  <div className="form-group">
                    <label>Name (English)</label>
                    <input
                      type="text"
                      value={formData.en.name}
                      onChange={(e) => handleChange('en', 'name', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description (English)</label>
                    <textarea
                      value={formData.en.description}
                      onChange={(e) => handleChange('en', 'description', e.target.value)}
                      className="form-input"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address (English)</label>
                    <input
                      type="text"
                      value={formData.en.address}
                      onChange={(e) => handleChange('en', 'address', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'ar' && (
                <div className="form-section">
                  <div className="form-group">
                    <label>Name (Arabic)</label>
                    <input
                      type="text"
                      value={formData.ar.name}
                      onChange={(e) => handleChange('ar', 'name', e.target.value)}
                      className="form-input"
                      dir="rtl"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description (Arabic)</label>
                    <textarea
                      value={formData.ar.description}
                      onChange={(e) => handleChange('ar', 'description', e.target.value)}
                      className="form-input"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address (Arabic)</label>
                    <input
                      type="text"
                      value={formData.ar.address}
                      onChange={(e) => handleChange('ar', 'address', e.target.value)}
                      className="form-input"
                      dir="rtl"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  placeholder="+966XXXXXXXXX"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {isCreating ? 'Create' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => isCreating ? onClose() : setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
