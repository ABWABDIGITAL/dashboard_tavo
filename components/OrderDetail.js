'use client'

import { useState } from 'react'

export default function OrderDetail({ 
  order, 
  onClose, 
  onRefund
}) {
  const [showRefundForm, setShowRefundForm] = useState(false)
  const [refundData, setRefundData] = useState({
    amount: order?.totalPrice || 0,
    reason: '',
    description: ''
  })

  if (!order) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return `SAR ${price?.toFixed(2) || '0.00'}`
  }

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="status-badge confirmed">Confirmed</span>
      case 'draft':
        return <span className="status-badge draft">Draft</span>
      case 'cancelled':
        return <span className="status-badge cancelled">Cancelled</span>
      case 'delivered':
        return <span className="status-badge delivered">Delivered</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="payment-badge paid">Paid</span>
      case 'pending':
        return <span className="payment-badge pending">Pending</span>
      case 'refunded':
        return <span className="payment-badge refunded">Refunded</span>
      default:
        return <span className="payment-badge">{status}</span>
    }
  }

  const handleRefundSubmit = (e) => {
    e.preventDefault()
    onRefund(order._id, refundData)
    setShowRefundForm(false)
  }

  const canRefund = order.paymentStatus === 'paid' && order.orderStatus !== 'refunded'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="order-detail-content">
          {/* Order Header */}
          <div className="order-header-section">
            <div className="order-number-section">
              <span className="order-number-lg">{order.orderNumber}</span>
              <div className="order-badges">
                {getOrderStatusBadge(order.orderStatus)}
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
            </div>
            <div className="order-date">
              <span>Created: {formatDate(order.createdAt)}</span>
              <span>Updated: {formatDate(order.updatedAt)}</span>
            </div>
          </div>

          {/* Customer & Restaurant */}
          <div className="info-section">
            <h4>Order Information</h4>
            <div className="order-info-grid">
              <div className="info-item">
                <label>Customer</label>
                <span className="info-value">{order.userId?.name || 'Unknown'}</span>
                <span className="info-subvalue">{order.userId?.phone}</span>
              </div>
              <div className="info-item">
                <label>Restaurant</label>
                <span className="info-value">
                  {order.restaurantId?.en?.name || order.restaurantId?.ar?.name || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="info-section">
            <h4>Order Items</h4>
            <div className="order-items-list">
              {order.menuItems?.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <div className="item-price">
                    <span className="unit-price">SAR {item.unitPrice} each</span>
                    <span className="line-total">{formatPrice(item.lineTotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="info-section">
            <h4>Payment Summary</h4>
            <div className="pricing-summary">
              <div className="price-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="price-row">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Refund Form */}
          {showRefundForm && canRefund && (
            <div className="info-section refund-section">
              <h4>Process Refund</h4>
              <form onSubmit={handleRefundSubmit} className="refund-form">
                <div className="form-group">
                  <label>Refund Amount (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    max={order.totalPrice}
                    value={refundData.amount}
                    onChange={(e) => setRefundData({ ...refundData, amount: parseFloat(e.target.value) })}
                    className="form-input"
                    required
                  />
                  <span className="input-help">Maximum: {formatPrice(order.totalPrice)}</span>
                </div>
                <div className="form-group">
                  <label>Reason</label>
                  <select
                    value={refundData.reason}
                    onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Select reason...</option>
                    <option value="customer_request">Customer Request</option>
                    <option value="order_cancelled">Order Cancelled</option>
                    <option value="wrong_item">Wrong Item</option>
                    <option value="quality_issue">Quality Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={refundData.description}
                    onChange={(e) => setRefundData({ ...refundData, description: e.target.value })}
                    className="form-input"
                    rows={3}
                    placeholder="Additional details about the refund..."
                  />
                </div>
                <div className="refund-actions">
                  <button type="submit" className="btn btn-warning">
                    Process Refund
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowRefundForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            {canRefund && !showRefundForm && (
              <button 
                className="btn btn-warning" 
                onClick={() => setShowRefundForm(true)}
              >
                Process Refund
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
