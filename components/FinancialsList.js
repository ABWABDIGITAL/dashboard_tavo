'use client'

import { useState } from 'react'

export default function FinancialsList({ 
  type,
  data,
  pagination, 
  onPageChange,
  onProcess,
  onCreatePayout,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const formatCurrency = (amount) => {
    return `SAR ${(amount || 0).toLocaleString()}`
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

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'pending',
      'completed': 'active',
      'processed': 'active',
      'approved': 'active',
      'rejected': 'suspended',
      'failed': 'suspended',
      'cancelled': 'suspended'
    }
    return <span className={`status-badge ${statusMap[status] || ''}`}>{status}</span>
  }

  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    let matchesSearch = true
    
    if (type === 'transactions') {
      matchesSearch = 
        item.orderNumber?.toLowerCase().includes(searchLower) ||
        item.userId?.name?.toLowerCase().includes(searchLower)
    } else if (type === 'payouts') {
      matchesSearch = 
        item.restaurantId?.en?.name?.toLowerCase().includes(searchLower) ||
        item.restaurantId?.ar?.name?.toLowerCase().includes(searchLower) ||
        item.payoutMethod?.toLowerCase().includes(searchLower)
    } else if (type === 'refunds') {
      matchesSearch = 
        item.orderNumber?.toLowerCase().includes(searchLower) ||
        item.userId?.name?.toLowerCase().includes(searchLower)
    }
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const titles = {
    transactions: 'Transactions',
    payouts: 'Payouts',
    refunds: 'Refunds'
  }

  if (loading) {
    return (
      <div className="card financials-list loading-card">
        <div className="card-header">
          <h3 className="card-title">{titles[type]}</h3>
        </div>
        <div className="skeleton-text" style={{ width: '100%', height: '40px', marginBottom: '20px' }}></div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td><div className="skeleton-text" style={{ width: '100px' }}></div></td>
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
    <div className="card financials-list">
      <div className="card-header">
        <h3 className="card-title">{titles[type]}</h3>
        {type === 'payouts' && (
          <button className="btn btn-primary" onClick={onCreatePayout}>
            <span>+</span> Create Payout
          </button>
        )}
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder={`Search ${type}...`}
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
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="processed">Processed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="table-container">
        {type === 'transactions' && (
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id}>
                  <td><span className="order-number-sm">{item.orderNumber}</span></td>
                  <td>
                    <span className="user-name-sm">{item.userId?.name || 'Unknown'}</span>
                  </td>
                  <td><span className="amount">{formatCurrency(item.amount)}</span></td>
                  <td><span className="type-badge">{item.type}</span></td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td><span className="date-sm">{formatDate(item.createdAt)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {type === 'payouts' && (
          <table className="table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span className="restaurant-name-sm">
                      {item.restaurantId?.en?.name || item.restaurantId?.ar?.name || 'Unknown'}
                    </span>
                  </td>
                  <td><span className="amount">{formatCurrency(item.amount)}</span></td>
                  <td><span className="method-badge">{item.payoutMethod}</span></td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td><span className="date-sm">{formatDate(item.createdAt)}</span></td>
                  <td>
                    {item.status === 'pending' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => onProcess(item._id)}
                      >
                        Process
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {type === 'refunds' && (
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id}>
                  <td><span className="order-number-sm">{item.orderNumber}</span></td>
                  <td>
                    <span className="user-name-sm">{item.userId?.name || 'Unknown'}</span>
                  </td>
                  <td><span className="amount">{formatCurrency(item.amount)}</span></td>
                  <td><span className="reason-text">{item.reason}</span></td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td><span className="date-sm">{formatDate(item.createdAt)}</span></td>
                  <td>
                    {item.status === 'pending' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => onProcess(item._id)}
                      >
                        Process
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

      {filteredData.length === 0 && (
        <div className="empty-state">
          <p>No {type} found</p>
        </div>
      )}
    </div>
  )
}
