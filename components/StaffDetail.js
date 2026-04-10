'use client'

import { useState, useEffect } from 'react'

const AVAILABLE_PERMISSIONS = [
  { id: 'view_orders', label: 'View Orders' },
  { id: 'manage_orders', label: 'Manage Orders' },
  { id: 'view_reservations', label: 'View Reservations' },
  { id: 'manage_reservations', label: 'Manage Reservations' },
  { id: 'view_menu', label: 'View Menu' },
  { id: 'manage_menu', label: 'Manage Menu' },
  { id: 'view_tables', label: 'View Tables' },
  { id: 'manage_tables', label: 'Manage Tables' },
  { id: 'view_reviews', label: 'View Reviews' },
  { id: 'manage_reviews', label: 'Manage Reviews' },
  { id: 'full_access', label: 'Full Access' }
]

const ROLES = [
  { id: 'owner', label: 'Owner' },
  { id: 'manager', label: 'Manager' },
  { id: 'staff', label: 'Staff' }
]

export default function StaffDetail({ 
  staff, 
  onClose, 
  onSave, 
  onActivate, 
  onSuspend,
  onDelete,
  isAssigning = false,
  restaurants = [],
  users = []
}) {
  const [formData, setFormData] = useState({
    userId: '',
    restaurantId: '',
    role: 'staff',
    permissions: ['view_orders', 'view_reservations', 'view_menu', 'view_tables']
  })
  const [isEditing, setIsEditing] = useState(isAssigning)

  useEffect(() => {
    if (staff && !isAssigning) {
      setFormData({
        userId: staff.userId?._id || '',
        restaurantId: staff.restaurantId?._id || '',
        role: staff.role || 'staff',
        permissions: staff.permissions || []
      })
    }
  }, [staff, isAssigning])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isAssigning) {
      onSave(null, formData)
    } else {
      onSave(staff._id, { role: formData.role, permissions: formData.permissions })
    }
  }

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => {
      if (permissionId === 'full_access') {
        return {
          ...prev,
          permissions: prev.permissions.includes('full_access') 
            ? [] 
            : ['full_access']
        }
      }
      
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions.filter(p => p !== 'full_access'), permissionId]
      
      return { ...prev, permissions: newPermissions }
    })
  }

  const handleRoleChange = (role) => {
    setFormData(prev => {
      let newPermissions = prev.permissions
      if (role === 'owner') {
        newPermissions = ['full_access']
      } else if (role === 'manager') {
        newPermissions = ['view_orders', 'manage_orders', 'view_reservations', 'manage_reservations', 'view_menu', 'manage_menu', 'view_tables', 'manage_tables', 'view_reviews', 'manage_reviews']
      } else if (role === 'staff') {
        newPermissions = ['view_orders', 'view_reservations', 'view_menu', 'view_tables']
      }
      return { ...prev, role, permissions: newPermissions }
    })
  }

  if (!staff && !isAssigning) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content staff-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isAssigning ? 'Assign Staff' : isEditing ? 'Edit Staff' : 'Staff Details'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="staff-detail-content">
          {/* View Mode */}
          {!isEditing && !isAssigning && staff && (
            <>
              <div className="staff-header-detail">
                <div className="staff-avatar-large">
                  {staff.userId?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="staff-title-section">
                  <h3>{staff.userId?.name || 'Unknown'}</h3>
                  <span className="staff-phone">{staff.userId?.phone}</span>
                  <div className="staff-badges">
                    <span className={`role-badge ${staff.role}`}>{staff.role}</span>
                    <span className={`status-badge ${staff.status}`}>{staff.status}</span>
                  </div>
                </div>
              </div>

              <div className="staff-info-sections">
                <div className="info-section">
                  <h4>Restaurant</h4>
                  <div className="restaurant-info-box">
                    <span className="restaurant-name-lg">
                      {staff.restaurantId?.en?.name || staff.restaurantId?.ar?.name || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="info-section">
                  <h4>Permissions</h4>
                  <div className="permissions-list">
                    {staff.permissions?.map(permission => (
                      <span key={permission} className="permission-badge">
                        {permission.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-section">
                  <h4>Assignment Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Assigned By</label>
                      <span>{staff.assignedBy?.name || 'System'}</span>
                    </div>
                    <div className="info-item">
                      <label>Assigned At</label>
                      <span>{new Date(staff.assignedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                {staff.status === 'active' ? (
                  <button className="btn btn-warning" onClick={() => onSuspend(staff._id)}>
                    Suspend
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={() => onActivate(staff._id)}>
                    Activate
                  </button>
                )}
                <button className="btn btn-danger" onClick={() => onDelete(staff._id)}>
                  Remove
                </button>
              </div>
            </>
          )}

          {/* Edit/Assign Mode */}
          {(isEditing || isAssigning) && (
            <form onSubmit={handleSubmit} className="staff-form">
              {isAssigning && (
                <>
                  <div className="form-group">
                    <label>User</label>
                    <select
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Select User</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Restaurant</label>
                    <select
                      value={formData.restaurantId}
                      onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Select Restaurant</option>
                      {restaurants.map(restaurant => (
                        <option key={restaurant._id} value={restaurant._id}>
                          {restaurant.en?.name || restaurant.ar?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Role</label>
                <div className="role-selector">
                  {ROLES.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      className={`role-option ${formData.role === role.id ? 'active' : ''}`}
                      onClick={() => handleRoleChange(role.id)}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-grid">
                  {AVAILABLE_PERMISSIONS.map(permission => (
                    <label key={permission.id} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                      />
                      <span>{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {isAssigning ? 'Assign Staff' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => isAssigning ? onClose() : setIsEditing(false)}
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
