'use client'

import { useState } from 'react'

export default function ReservationDetail({ 
  reservation, 
  onClose, 
  onConfirm,
  onCancel,
  onComplete,
  onNoShow
}) {
  if (!reservation) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateTime = (dateString) => {
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
      case 'confirmed':
        return <span className="status-badge confirmed">Confirmed</span>
      case 'pending':
        return <span className="status-badge pending">Pending</span>
      case 'cancelled':
        return <span className="status-badge cancelled">Cancelled</span>
      case 'completed':
        return <span className="status-badge completed">Completed</span>
      case 'no-show':
        return <span className="status-badge no-show">No Show</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  const isUpcoming = new Date(reservation.reservationDate) >= new Date().setHours(0, 0, 0, 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reservation-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reservation Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="reservation-detail-content">
          {/* Reservation Header */}
          <div className="reservation-header-section">
            <div className="reservation-status-row">
              {getStatusBadge(reservation.status)}
              {isUpcoming && reservation.status === 'confirmed' && (
                <span className="upcoming-badge">Upcoming</span>
              )}
            </div>
            <div className="reservation-datetime">
              <div className="datetime-main">
                <span className="date">{formatDate(reservation.reservationDate)}</span>
                <span className="time">{formatTime(reservation.reservationTime)}</span>
              </div>
              <div className="datetime-created">
                <span>Booked on {formatDateTime(reservation.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Restaurant */}
          <div className="info-section">
            <h4>Reservation Information</h4>
            <div className="reservation-info-grid">
              <div className="info-item">
                <label>Customer</label>
                <div className="customer-info">
                  <div className="customer-avatar">
                    {reservation.userId?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="customer-details">
                    <span className="info-value">{reservation.userId?.name || 'Unknown'}</span>
                    <span className="info-subvalue">{reservation.userId?.phone}</span>
                  </div>
                </div>
              </div>
              <div className="info-item">
                <label>Restaurant</label>
                <span className="info-value">
                  {reservation.restaurantId?.en?.name || reservation.restaurantId?.ar?.name || 'Unknown'}
                </span>
              </div>
              <div className="info-item">
                <label>Party Size</label>
                <span className="info-value">
                  {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <div className="info-item">
                <label>Table</label>
                <span className="info-value">
                  {reservation.tableNumber ? `Table ${reservation.tableNumber}` : 'Not assigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {reservation.specialRequests && (
            <div className="info-section">
              <h4>Special Requests</h4>
              <div className="special-requests-box">
                <p>{reservation.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Reservation Details */}
          <div className="info-section">
            <h4>Booking Details</h4>
            <div className="booking-details">
              <div className="detail-row">
                <span className="detail-label">Reservation ID</span>
                <span className="detail-value">{reservation._id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">{formatDateTime(reservation.updatedAt)}</span>
              </div>
              {reservation.cancelReason && (
                <div className="detail-row">
                  <span className="detail-label">Cancellation Reason</span>
                  <span className="detail-value cancellation-reason">{reservation.cancelReason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            {reservation.status === 'pending' && (
              <button className="btn btn-success" onClick={() => onConfirm(reservation._id)}>
                Confirm
              </button>
            )}
            {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
              <>
                <button className="btn btn-primary" onClick={() => onComplete(reservation._id)}>
                  Mark Complete
                </button>
                <button className="btn btn-warning" onClick={() => onNoShow(reservation._id)}>
                  Mark No-Show
                </button>
              </>
            )}
            {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
              <button className="btn btn-danger" onClick={() => onCancel(reservation._id)}>
                Cancel
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
