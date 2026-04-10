'use client'

import { useState } from 'react'

export default function UserDetail({ user, onClose, onUpdate, onActivate, onSuspend, onDelete }) {
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || 'user'
  })
  const [suspendReason, setSuspendReason] = useState('')
  const [showSuspendModal, setShowSuspendModal] = useState(false)

  if (!user) return null

  const handleUpdate = () => {
    onUpdate(user._id, formData)
    setEditMode(false)
  }

  const handleSuspend = () => {
    onSuspend(user._id, suspendReason)
    setShowSuspendModal(false)
    setSuspendReason('')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="user-detail-content">
          <div className="user-profile-section">
            {user.avatar?.url && (
              <img src={user.avatar.url} alt={user.name} className="user-detail-avatar" />
            )}
            <div className="user-profile-info">
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Name"
                  />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="form-input"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </>
              ) : (
                <>
                  <h3>{user.name}</h3>
                  <div className="user-badges">
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                    <span className={`status-badge ${user.status}`}>{user.status}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="user-info-grid">
            <div className="info-item">
              <label>Phone</label>
              <span>{user.phone}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span>{user.auth?.emailVerified ? 'Verified' : 'Not verified'}</span>
            </div>
            <div className="info-item">
              <label>Timezone</label>
              <span>{user.timezone}</span>
            </div>
            <div className="info-item">
              <label>Language</label>
              <span>{user.preferredLanguage}</span>
            </div>
            <div className="info-item">
              <label>Referral Code</label>
              <span>{user.referral?.code || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Joined</label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="user-statistics">
            <h4>Statistics</h4>
            <div className="stats-grid-small">
              <div className="stat-box">
                <span className="stat-number">{user.statistics?.totalOrders || 0}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{user.statistics?.totalReservations || 0}</span>
                <span className="stat-label">Reservations</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">${user.statistics?.totalSpent || 0}</span>
                <span className="stat-label">Total Spent</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{user.reliabilityScore?.score || 100}</span>
                <span className="stat-label">Reliability</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            {editMode ? (
              <>
                <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
                {user.status === 'suspended' ? (
                  <button className="btn btn-success" onClick={() => onActivate(user._id)}>Activate</button>
                ) : (
                  <button className="btn btn-warning" onClick={() => setShowSuspendModal(true)}>Suspend</button>
                )}
                <button className="btn btn-danger" onClick={() => onDelete(user._id)}>Delete</button>
              </>
            )}
          </div>
        </div>

        {showSuspendModal && (
          <div className="suspend-modal">
            <h4>Suspend User</h4>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Enter reason for suspension..."
              className="form-input"
              rows={3}
            />
            <div className="modal-actions">
              <button className="btn btn-warning" onClick={handleSuspend}>Suspend</button>
              <button className="btn btn-secondary" onClick={() => setShowSuspendModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
