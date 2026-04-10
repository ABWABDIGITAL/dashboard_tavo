'use client'

import { useState } from 'react'

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'user', label: 'User' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'order', label: 'Order' },
  { id: 'reservation', label: 'Reservation' },
  { id: 'staff', label: 'Staff' },
  { id: 'financials', label: 'Financials' },
  { id: 'settings', label: 'Settings' },
  { id: 'system', label: 'System' }
]

const STATUSES = [
  { id: 'all', label: 'All Statuses' },
  { id: 'success', label: 'Success' },
  { id: 'failed', label: 'Failed' },
  { id: 'warning', label: 'Warning' }
]

const getActionIcon = (action) => {
  if (action.includes('create')) return '➕'
  if (action.includes('update')) return '✏️'
  if (action.includes('delete')) return '🗑️'
  if (action.includes('activate')) return '✅'
  if (action.includes('deactivate') || action.includes('suspend')) return '⛔'
  if (action.includes('login')) return '🔐'
  if (action.includes('logout')) return '🚪'
  if (action.includes('refund')) return '↩️'
  if (action.includes('payout')) return '💸'
  return '📝'
}

const getActionColor = (action, status) => {
  if (status === 'failed') return 'danger'
  if (action.includes('create')) return 'success'
  if (action.includes('delete')) return 'danger'
  if (action.includes('activate')) return 'success'
  if (action.includes('deactivate') || action.includes('suspend')) return 'warning'
  return 'primary'
}

export default function AuditLogs({ 
  logs, 
  pagination, 
  onPageChange,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)

  // Get unique actions for filter
  const uniqueActions = [...new Set(logs.map(log => log.action))]

  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      log.action?.toLowerCase().includes(searchLower) ||
      log.actor?.userId?.name?.toLowerCase().includes(searchLower) ||
      log.resource?.type?.toLowerCase().includes(searchLower) ||
      log.category?.toLowerCase().includes(searchLower)
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    const matchesAction = !actionFilter || log.action === actionFilter
    const matchesDateFrom = !dateFrom || new Date(log.createdAt) >= new Date(dateFrom)
    const matchesDateTo = !dateTo || new Date(log.createdAt) <= new Date(dateTo)
    return matchesSearch && matchesCategory && matchesStatus && matchesAction && matchesDateFrom && matchesDateTo
  })

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatActionName = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="card audit-logs loading-card">
        <div className="card-header">
          <h3 className="card-title">Audit Logs</h3>
        </div>
        <div className="filters-bar skeleton-filters">
          <div className="skeleton-text" style={{ width: '150px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '150px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '150px', height: '40px' }}></div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Actor</th>
                <th>Resource</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td><div className="skeleton-text" style={{ width: '150px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '120px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '100px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '80px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '150px' }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="card audit-logs">
      <div className="card-header">
        <h3 className="card-title">Audit Logs</h3>
        <span className="log-count">{pagination?.total || 0} total entries</span>
      </div>

      <div className="filters-bar logs-filters">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input search-input"
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)} 
          className="form-input filter-select"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="form-input filter-select"
        >
          {STATUSES.map(status => (
            <option key={status.id} value={status.id}>{status.label}</option>
          ))}
        </select>
        <select 
          value={actionFilter} 
          onChange={(e) => setActionFilter(e.target.value)} 
          className="form-input filter-select"
        >
          <option value="">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>{formatActionName(action)}</option>
          ))}
        </select>
        <div className="date-filters">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="form-input date-input"
            placeholder="From"
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="form-input date-input"
            placeholder="To"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="table logs-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Actor</th>
              <th>Category</th>
              <th>Resource</th>
              <th>Status</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr 
                key={log._id} 
                className="log-row"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td>
                  <div className={`action-cell ${getActionColor(log.action, log.status)}`}>
                    <span className="action-icon">{getActionIcon(log.action)}</span>
                    <span className="action-name">{formatActionName(log.action)}</span>
                  </div>
                </td>
                <td>
                  <div className="actor-cell">
                    <div className="actor-avatar">
                      {log.actor?.userId?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="actor-info">
                      <span className="actor-name">{log.actor?.userId?.name || 'System'}</span>
                      <span className="actor-role">{log.actor?.role || 'system'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="category-badge">{log.category}</span>
                </td>
                <td>
                  <span className="resource-type">{log.resource?.type}</span>
                </td>
                <td>
                  <span className={`status-badge ${log.status}`}>{log.status}</span>
                </td>
                <td>
                  <span className="date-sm">{formatDate(log.createdAt)}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => setSelectedLog(log)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > 0 && (
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

      {filteredLogs.length === 0 && (
        <div className="empty-state">
          <p>No audit logs found</p>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content log-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Log Details</h3>
              <button className="close-btn" onClick={() => setSelectedLog(null)}>×</button>
            </div>
            <div className="log-detail-content">
              <div className="log-detail-header">
                <div className={`action-cell large ${getActionColor(selectedLog.action, selectedLog.status)}`}>
                  <span className="action-icon">{getActionIcon(selectedLog.action)}</span>
                  <span className="action-name">{formatActionName(selectedLog.action)}</span>
                </div>
                <span className={`status-badge ${selectedLog.status} large`}>{selectedLog.status}</span>
              </div>

              <div className="detail-section">
                <h4>Actor</h4>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedLog.actor?.userId?.name || 'System'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{selectedLog.actor?.role || 'system'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Resource</h4>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedLog.resource?.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value id">{selectedLog.resource?.id}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Details</h4>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{selectedLog.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Timestamp:</span>
                  <span className="detail-value">{formatDate(selectedLog.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Log ID:</span>
                  <span className="detail-value id">{selectedLog._id}</span>
                </div>
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div className="detail-section">
                  <h4>Metadata</h4>
                  <pre className="metadata-box">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
