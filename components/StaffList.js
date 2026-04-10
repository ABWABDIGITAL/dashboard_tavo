'use client'

import { useState } from 'react'

export default function StaffList({ 
  staff, 
  pagination, 
  onPageChange, 
  onStaffSelect, 
  onAssignStaff,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredStaff = staff.filter(member => {
    const userName = member.userId?.name || ''
    const restaurantName = member.restaurantId?.en?.name || member.restaurantId?.ar?.name || ''
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return <span className="role-badge owner">Owner</span>
      case 'manager':
        return <span className="role-badge manager">Manager</span>
      case 'staff':
        return <span className="role-badge staff">Staff</span>
      default:
        return <span className="role-badge">{role}</span>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">Active</span>
      case 'suspended':
        return <span className="status-badge suspended">Suspended</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  const formatPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return 'No permissions'
    if (permissions.includes('full_access')) return 'Full Access'
    return `${permissions.length} permissions`
  }

  if (loading) {
    return (
      <div className="card staff-list loading-card">
        <div className="card-header">
          <h3 className="card-title">Staff Management</h3>
        </div>
        <div className="filters-bar skeleton-filters">
          <div className="skeleton-text" style={{ width: '200px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '120px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '120px', height: '40px' }}></div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Restaurant</th>
                <th>Role</th>
                <th>Status</th>
                <th>Assigned By</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td><div className="skeleton-text" style={{ width: '150px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '180px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '80px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '70px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '120px' }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="card staff-list">
      <div className="card-header">
        <h3 className="card-title">Staff Management</h3>
        <button className="btn btn-primary" onClick={onAssignStaff}>
          <span>+</span> Assign Staff
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name or restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input search-input"
        />
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)} 
          className="form-input filter-select"
        >
          <option value="all">All Roles</option>
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="form-input filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Restaurant</th>
              <th>Role</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Assigned By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member, index) => (
              <tr 
                key={member._id} 
                onClick={() => onStaffSelect(member)}
                className="clickable-row"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-text">
                      {member.userId?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{member.userId?.name || 'Unknown'}</span>
                      <span className="user-phone">{member.userId?.phone}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="restaurant-name">
                    {member.restaurantId?.en?.name || member.restaurantId?.ar?.name || 'Unknown'}
                  </span>
                </td>
                <td>{getRoleBadge(member.role)}</td>
                <td>
                  <span className="permissions-text">
                    {formatPermissions(member.permissions)}
                  </span>
                </td>
                <td>{getStatusBadge(member.status)}</td>
                <td>
                  <span className="assigned-by">
                    {member.assignedBy?.name || 'System'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => { e.stopPropagation(); onStaffSelect(member); }}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
