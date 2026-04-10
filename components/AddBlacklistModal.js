'use client'

import { useState } from 'react'

const BLACKLIST_REASONS = [
  { id: 'no_show', label: 'No Show' },
  { id: 'fake_booking', label: 'Fake Booking' },
  { id: 'abuse', label: 'Abuse' },
  { id: 'fraud', label: 'Fraud' },
  { id: 'other', label: 'Other' }
]

export default function AddBlacklistModal({ 
  onClose, 
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    phone: '',
    reason: 'no_show',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content blacklist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add to Blacklist</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="blacklist-form">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input"
              placeholder="+966500000000"
              required
            />
            <span className="input-help">Enter phone number with country code</span>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="form-input"
              required
            >
              {BLACKLIST_REASONS.map(reason => (
                <option key={reason.id} value={reason.id}>{reason.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows={3}
              placeholder="Additional details about why this number is being blacklisted..."
            />
          </div>

          <div className="form-notice">
            <span className="notice-icon">⚠️</span>
            <p>Once a phone number is added to the blacklist, the user will not be able to make reservations or place orders until removed.</p>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add to Blacklist'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
