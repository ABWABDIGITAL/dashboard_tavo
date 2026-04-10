'use client'

import { useState } from 'react'

const BLACKLIST_REASONS = [
  { id: 'no_show', label: 'No Show' },
  { id: 'fake_booking', label: 'Fake Booking' },
  { id: 'abuse', label: 'Abuse' },
  { id: 'fraud', label: 'Fraud' },
  { id: 'other', label: 'Other' }
]

export default function BlacklistList({ 
  entries, 
  pagination, 
  onPageChange,
  onAddEntry,
  onRemoveEntry,
  onCheckPhone,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [reasonFilter, setReasonFilter] = useState('all')
  const [showCheckModal, setShowCheckModal] = useState(false)
  const [checkPhone, setCheckPhone] = useState('')
  const [checkResult, setCheckResult] = useState(null)
  const [checking, setChecking] = useState(false)

  const filteredEntries = entries.filter(entry => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = entry.phone?.includes(searchTerm) ||
                          entry.description?.toLowerCase().includes(searchLower)
    const matchesReason = reasonFilter === 'all' || entry.reason === reasonFilter
    return matchesSearch && matchesReason
  })

  const getReasonLabel = (reason) => {
    const found = BLACKLIST_REASONS.find(r => r.id === reason)
    return found ? found.label : reason
  }

  const getReasonBadge = (reason) => {
    const colors = {
      'no_show': 'warning',
      'fake_booking': 'danger',
      'abuse': 'danger',
      'fraud': 'danger',
      'other': 'secondary'
    }
    return <span className={`status-badge ${colors[reason] || 'secondary'}`}>{getReasonLabel(reason)}</span>
  }

  const handleCheckPhone = async (e) => {
    e.preventDefault()
    if (!checkPhone.trim()) return
    
    setChecking(true)
    setCheckResult(null)
    try {
      const result = await onCheckPhone(checkPhone)
      setCheckResult(result)
    } finally {
      setChecking(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="card blacklist-list loading-card">
        <div className="card-header">
          <h3 className="card-title">Blacklist Management</h3>
        </div>
        <div className="filters-bar skeleton-filters">
          <div className="skeleton-text" style={{ width: '200px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '120px', height: '40px' }}></div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Phone</th>
                <th>Reason</th>
                <th>Description</th>
                <th>Added Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td><div className="skeleton-text" style={{ width: '150px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '100px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '200px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '120px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '80px' }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="card blacklist-list">
      <div className="card-header">
        <h3 className="card-title">Blacklist Management</h3>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowCheckModal(true)}>
            <span>🔍</span> Check Phone
          </button>
          <button className="btn btn-primary" onClick={onAddEntry}>
            <span>+</span> Add to Blacklist
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by phone or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input search-input"
        />
        <select 
          value={reasonFilter} 
          onChange={(e) => setReasonFilter(e.target.value)} 
          className="form-input filter-select"
        >
          <option value="all">All Reasons</option>
          {BLACKLIST_REASONS.map(reason => (
            <option key={reason.id} value={reason.id}>{reason.label}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Phone</th>
              <th>Reason</th>
              <th>Description</th>
              <th>Added Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => (
              <tr 
                key={entry._id} 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  <span className="phone-number">{entry.phone}</span>
                </td>
                <td>{getReasonBadge(entry.reason)}</td>
                <td>
                  <span className="description-text">{entry.description || '-'}</span>
                </td>
                <td>
                  <span className="date-sm">{formatDate(entry.createdAt)}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (confirm('Are you sure you want to remove this entry from the blacklist?')) {
                        onRemoveEntry(entry._id)
                      }
                    }}
                  >
                    Remove
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

      {filteredEntries.length === 0 && (
        <div className="empty-state">
          <p>No blacklist entries found</p>
        </div>
      )}

      {/* Check Phone Modal */}
      {showCheckModal && (
        <div className="modal-overlay" onClick={() => setShowCheckModal(false)}>
          <div className="modal-content check-phone-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Check Phone in Blacklist</h3>
              <button className="close-btn" onClick={() => setShowCheckModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCheckPhone} className="check-form">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={checkPhone}
                    onChange={(e) => setCheckPhone(e.target.value)}
                    className="form-input"
                    placeholder="+966500000000"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={checking}
                >
                  {checking ? 'Checking...' : 'Check'}
                </button>
              </form>

              {checkResult && (
                <div className={`check-result ${checkResult.blacklisted ? 'blacklisted' : 'safe'}`}>
                  <div className="result-icon">
                    {checkResult.blacklisted ? '⚠️' : '✅'}
                  </div>
                  <div className="result-content">
                    {checkResult.blacklisted ? (
                      <>
                        <h4>Phone is Blacklisted</h4>
                        <p><strong>Reason:</strong> {getReasonLabel(checkResult.reason)}</p>
                        {checkResult.description && (
                          <p><strong>Description:</strong> {checkResult.description}</p>
                        )}
                        <p><strong>Added:</strong> {formatDate(checkResult.createdAt)}</p>
                      </>
                    ) : (
                      <>
                        <h4>Phone is Safe</h4>
                        <p>This phone number is not in the blacklist.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
