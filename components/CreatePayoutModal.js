'use client'

import { useState } from 'react'

export default function CreatePayoutModal({ 
  restaurants,
  onClose, 
  onCreate 
}) {
  const [formData, setFormData] = useState({
    restaurantId: '',
    amount: '',
    payoutMethod: 'bank_transfer'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate({
      restaurantId: formData.restaurantId,
      amount: parseFloat(formData.amount),
      payoutMethod: formData.payoutMethod
    })
  }

  const formatCurrency = (amount) => {
    return `SAR ${(amount || 0).toLocaleString()}`
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Payout</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payout-modal-content">
          <form onSubmit={handleSubmit} className="payout-form">
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

            <div className="form-group">
              <label>Amount (SAR)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="form-input"
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="form-group">
              <label>Payout Method</label>
              <select
                value={formData.payoutMethod}
                onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value })}
                className="form-input"
                required
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </select>
            </div>

            <div className="payout-summary">
              <div className="summary-row">
                <span>Payout Amount:</span>
                <span className="summary-amount">{formatCurrency(parseFloat(formData.amount) || 0)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn btn-primary">
                Create Payout
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
