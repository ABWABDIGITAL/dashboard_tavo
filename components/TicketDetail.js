'use client'

import { useState } from 'react'

export default function TicketDetail({ 
  ticket, 
  onClose, 
  onReply,
  onAssign,
  onResolve,
  onCloseTicket,
  users = []
}) {
  const [response, setResponse] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  if (!ticket) return null

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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

  const handleSubmitResponse = (e) => {
    e.preventDefault()
    if (!response.trim()) return
    onReply(ticket._id, { message: response })
    setResponse('')
    setIsInternal(false)
  }

  const isClosed = ticket.status === 'closed' || ticket.status === 'resolved'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ticket-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ticket Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="ticket-detail-content">
          {/* Ticket Header */}
          <div className="ticket-header-section">
            <div className="ticket-number-section">
              <span className="ticket-number-lg">{ticket.ticketNumber}</span>
              <div className="ticket-badges">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
            <h3 className="ticket-subject-lg">{ticket.subject}</h3>
            <div className="ticket-meta">
              <span className="category-badge-lg">{ticket.category}</span>
              <span className="date-created">Created: {formatDate(ticket.createdAt)}</span>
            </div>
          </div>

          {/* User Info */}
          <div className="info-section">
            <h4>Submitted By</h4>
            <div className="ticket-user-info">
              <div className="user-avatar-text">
                {ticket.userId?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="user-details">
                <span className="user-name">{ticket.userId?.name || 'Unknown'}</span>
                <span className="user-email">{ticket.userId?.email}</span>
                <span className="user-phone">{ticket.userId?.phone}</span>
              </div>
            </div>
          </div>

          {/* Ticket Description */}
          <div className="info-section">
            <h4>Description</h4>
            <div className="ticket-description-box">
              <p>{ticket.description}</p>
            </div>
          </div>

          {/* Conversation History */}
          {ticket.responses && ticket.responses.length > 0 && (
            <div className="info-section">
              <h4>Conversation History</h4>
              <div className="conversation-list">
                {ticket.responses.map((resp, index) => (
                  <div 
                    key={index} 
                    className={`conversation-item ${resp.isInternal ? 'internal' : ''}`}
                  >
                    <div className="conversation-header">
                      <div className="conversation-author">
                        <span className="author-name">{resp.userId?.name || 'Support Agent'}</span>
                        {resp.isInternal && <span className="internal-badge">Internal</span>}
                      </div>
                      <span className="conversation-date">{formatDate(resp.createdAt)}</span>
                    </div>
                    <div className="conversation-message">
                      <p>{resp.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Form */}
          {!isClosed && (
            <div className="info-section response-section">
              <h4>Add Response</h4>
              <form onSubmit={handleSubmitResponse} className="response-form">
                <div className="form-group">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="form-input"
                    rows={4}
                    placeholder="Type your response..."
                    required
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                    />
                    <span>Internal note (not visible to customer)</span>
                  </label>
                </div>
                <div className="response-actions">
                  <button type="submit" className="btn btn-primary">
                    Send Response
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Status Actions */}
          <div className="modal-actions">
            {ticket.status === 'open' && (
              <button 
                className="btn btn-primary" 
                onClick={() => onAssign(ticket._id)}
              >
                Assign to Me
              </button>
            )}
            {(ticket.status === 'open' || ticket.status === 'in-progress') && (
              <button 
                className="btn btn-success" 
                onClick={() => onResolve(ticket._id)}
              >
                Resolve Ticket
              </button>
            )}
            {(ticket.status === 'resolved' || ticket.status === 'in-progress') && (
              <button 
                className="btn btn-secondary" 
                onClick={() => onCloseTicket(ticket._id)}
              >
                Close Ticket
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
