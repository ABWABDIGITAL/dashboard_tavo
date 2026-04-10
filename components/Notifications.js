'use client'

import { useState } from 'react'

const NOTIFICATION_TYPES = [
  { id: 'promotion', label: 'Promotion' },
  { id: 'announcement', label: 'Announcement' },
  { id: 'alert', label: 'Alert' },
  { id: 'update', label: 'Update' },
  { id: 'reminder', label: 'Reminder' }
]

export default function Notifications({ 
  users,
  onSendNotification,
  onBroadcastNotification,
  loading 
}) {
  const [activeTab, setActiveTab] = useState('send')
  const [formData, setFormData] = useState({
    userIds: [],
    titleAr: '',
    titleEn: '',
    messageAr: '',
    messageEn: '',
    type: 'promotion'
  })
  const [selectedUsers, setSelectedUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [sending, setSending] = useState(false)

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u._id))
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = userSearch.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(userSearch) ||
      user.email?.toLowerCase().includes(searchLower)
    )
  })

  const handleSend = async (e) => {
    e.preventDefault()
    if (activeTab === 'send' && selectedUsers.length === 0) {
      alert('Please select at least one user')
      return
    }

    setSending(true)
    try {
      const payload = {
        userIds: activeTab === 'send' ? selectedUsers : [],
        title: {
          ar: formData.titleAr,
          en: formData.titleEn
        },
        message: {
          ar: formData.messageAr,
          en: formData.messageEn
        },
        type: formData.type
      }

      if (activeTab === 'send') {
        await onSendNotification(payload)
      } else {
        await onBroadcastNotification(payload)
      }

      // Reset form
      setFormData({
        userIds: [],
        titleAr: '',
        titleEn: '',
        messageAr: '',
        messageEn: '',
        type: 'promotion'
      })
      setSelectedUsers([])
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="card notifications-loading">
        <div className="skeleton-tabs">
          <div className="skeleton-text" style={{ width: '120px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '120px', height: '40px' }}></div>
        </div>
        <div className="skeleton-form">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="skeleton-text" style={{ width: '100%', height: '60px', marginBottom: '16px' }}></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="notifications-container">
      {/* Tabs */}
      <div className="notification-tabs">
        <button
          className={`notification-tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          <span className="tab-icon">👤</span>
          Send to Users
        </button>
        <button
          className={`notification-tab ${activeTab === 'broadcast' ? 'active' : ''}`}
          onClick={() => setActiveTab('broadcast')}
        >
          <span className="tab-icon">📢</span>
          Broadcast All
        </button>
      </div>

      <form onSubmit={handleSend} className="notification-form">
        {/* User Selection (for Send tab only) */}
        {activeTab === 'send' && (
          <div className="form-section user-selection">
            <div className="section-header">
              <h4>Select Users</h4>
              <span className="selected-count">{selectedUsers.length} selected</span>
            </div>
            <div className="user-search-bar">
              <input
                type="text"
                placeholder="Search users by name, phone, or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="form-input search-input"
              />
              <button type="button" className="btn btn-sm btn-secondary" onClick={handleSelectAll}>
                {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="users-selection-list">
              {filteredUsers.map(user => (
                <div 
                  key={user._id} 
                  className={`user-select-item ${selectedUsers.includes(user._id) ? 'selected' : ''}`}
                  onClick={() => handleUserToggle(user._id)}
                >
                  <div className="user-select-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="user-select-info">
                    <div className="user-select-avatar">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="user-select-details">
                      <span className="user-select-name">{user.name || 'Unknown'}</span>
                      <span className="user-select-phone">{user.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="empty-state">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Broadcast Info (for Broadcast tab only) */}
        {activeTab === 'broadcast' && (
          <div className="broadcast-info">
            <div className="info-banner">
              <span className="info-icon">📢</span>
              <span>This notification will be sent to ALL users in the platform</span>
            </div>
          </div>
        )}

        {/* Notification Content */}
        <div className="form-section">
          <div className="section-header">
            <h4>Notification Content</h4>
          </div>

          <div className="bilingual-fields">
            {/* Title Fields */}
            <div className="field-group">
              <label>Title</label>
              <div className="lang-fields">
                <div className="lang-field">
                  <span className="lang-badge">EN</span>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="form-input"
                    placeholder="Notification title in English"
                    required
                  />
                </div>
                <div className="lang-field">
                  <span className="lang-badge ar">AR</span>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="form-input"
                    placeholder="عنوان الإشعار بالعربية"
                    dir="rtl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Message Fields */}
            <div className="field-group">
              <label>Message</label>
              <div className="lang-fields">
                <div className="lang-field">
                  <span className="lang-badge">EN</span>
                  <textarea
                    value={formData.messageEn}
                    onChange={(e) => setFormData({ ...formData, messageEn: e.target.value })}
                    className="form-input"
                    rows={4}
                    placeholder="Notification message in English"
                    required
                  />
                </div>
                <div className="lang-field">
                  <span className="lang-badge ar">AR</span>
                  <textarea
                    value={formData.messageAr}
                    onChange={(e) => setFormData({ ...formData, messageAr: e.target.value })}
                    className="form-input"
                    rows={4}
                    placeholder="نص الإشعار بالعربية"
                    dir="rtl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Type Selection */}
            <div className="field-group">
              <label>Notification Type</label>
              <div className="type-options">
                {NOTIFICATION_TYPES.map(type => (
                  <label key={type.id} className="type-option">
                    <input
                      type="radio"
                      name="type"
                      value={type.id}
                      checked={formData.type === type.id}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />
                    <span className="type-label">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="form-section preview-section">
          <div className="section-header">
            <h4>Preview</h4>
          </div>
          <div className="notification-preview">
            <div className="preview-item">
              <span className="preview-label">Title (EN):</span>
              <span className="preview-value">{formData.titleEn || '—'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Title (AR):</span>
              <span className="preview-value ar">{formData.titleAr || '—'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Message (EN):</span>
              <span className="preview-value">{formData.messageEn || '—'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Message (AR):</span>
              <span className="preview-value ar">{formData.messageAr || '—'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Type:</span>
              <span className="preview-value type-badge">{formData.type}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Recipients:</span>
              <span className="preview-value">
                {activeTab === 'broadcast' ? 'All Users' : `${selectedUsers.length} selected users`}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={sending || (activeTab === 'send' && selectedUsers.length === 0)}
          >
            {sending ? 'Sending...' : activeTab === 'send' ? 'Send Notification' : 'Broadcast Notification'}
          </button>
        </div>
      </form>
    </div>
  )
}
