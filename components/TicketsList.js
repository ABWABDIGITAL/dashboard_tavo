'use client'

import { useState } from 'react'

export default function TicketsList({ 
  tickets, 
  pagination, 
  onPageChange, 
  onTicketSelect,
  onCreateTicket,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      ticket.subject?.toLowerCase().includes(searchLower) ||
      ticket.userId?.name?.toLowerCase().includes(searchLower) ||
      ticket.ticketNumber?.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="status-badge open">Open</span>
      case 'in-progress':
        return <span className="status-badge in-progress">In Progress</span>
      case 'resolved':
        return <span className="status-badge resolved">Resolved</span>
      case 'closed':
        return <span className="status-badge closed">Closed</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <span className="priority-badge low">Low</span>
      case 'medium':
        return <span className="priority-badge medium">Medium</span>
      case 'high':
        return <span className="priority-badge high">High</span>
      case 'urgent':
        return <span className="priority-badge urgent">Urgent</span>
      default:
        return <span className="priority-badge">{priority}</span>
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
      <div className="card tickets-list loading-card">
        <div className="card-header">
          <h3 className="card-title">Support Tickets</h3>
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
                <th>Ticket #</th>
                <th>Subject</th>
                <th>User</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td><div className="skeleton-text" style={{ width: '100px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '180px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '120px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '70px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '80px' }}></div></td>
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
    <div className="card tickets-list">
      <div className="card-header">
        <h3 className="card-title">Support Tickets</h3>
        <button className="btn btn-primary" onClick={onCreateTicket}>
          <span>+</span> New Ticket
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search tickets..."
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
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select 
          value={priorityFilter} 
          onChange={(e) => setPriorityFilter(e.target.value)} 
          className="form-input filter-select"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Subject</th>
              <th>User</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket, index) => (
              <tr 
                key={ticket._id} 
                onClick={() => onTicketSelect(ticket)}
                className="clickable-row"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  <span className="ticket-number">{ticket.ticketNumber}</span>
                </td>
                <td>
                  <span className="ticket-subject">{ticket.subject}</span>
                </td>
                <td>
                  <div className="user-cell">
                    <span className="user-name">{ticket.userId?.name || 'Unknown'}</span>
                  </div>
                </td>
                <td>
                  <span className="category-badge">{ticket.category}</span>
                </td>
                <td>{getPriorityBadge(ticket.priority)}</td>
                <td>{getStatusBadge(ticket.status)}</td>
                <td>
                  <span className="date-sm">{formatDate(ticket.updatedAt)}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => { e.stopPropagation(); onTicketSelect(ticket); }}
                  >
                    View
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

      {filteredTickets.length === 0 && (
        <div className="empty-state">
          <p>No tickets found</p>
        </div>
      )}
    </div>
  )
}
