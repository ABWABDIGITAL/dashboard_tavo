'use client'

import { useState } from 'react'

const TABS = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'payment', label: 'Payment', icon: '💳' },
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'sms', label: 'SMS', icon: '💬' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'features', label: 'Features', icon: '✨' },
  { id: 'legal', label: 'Legal', icon: '📋' }
]

export default function Settings({ 
  settings, 
  features,
  onSaveGeneral,
  onSavePayment,
  onSaveEmail,
  onSaveSMS,
  onSaveNotifications,
  onSaveFeatures,
  onSaveLegal,
  onToggleMaintenance,
  loading 
}) {
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({
    general: settings?.general || {
      platformName: 'Tavo',
      platformNameAr: 'تافو',
      supportEmail: '',
      supportPhone: '',
      defaultLanguage: 'ar',
      timezone: 'Asia/Riyadh',
      logo: '',
      favicon: '',
      primaryColor: '#FF6B35',
      secondaryColor: '#2D3436'
    },
    payment: settings?.payment || {
      gateway: 'none',
      stripePublicKey: '',
      stripeSecretKey: '',
      paypalClientId: '',
      paypalClientSecret: '',
      madaMerchantId: '',
      madaApiKey: '',
      defaultCommissionRate: 10,
      minimumPayoutAmount: 100,
      payoutSchedule: 'weekly',
      currency: 'SAR'
    },
    email: settings?.email || {
      host: '',
      port: 587,
      secure: false,
      user: '',
      password: '',
      fromName: 'Tavo',
      fromEmail: 'noreply@tavo.com'
    },
    sms: settings?.sms || {
      provider: 'none',
      apiKey: '',
      apiSecret: '',
      senderId: 'Tavo',
      enabled: false
    },
    notifications: settings?.notifications || {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      fcmServerKey: '',
      fcmSenderId: ''
    },
    features: features || {
      reservations: true,
      orders: true,
      loyalty: true,
      waitlist: true,
      reviews: true,
      favorites: true,
      notifications: true,
      emailVerification: false,
      twoFactorAuth: false,
      maintenanceMode: false,
      registrationEnabled: true
    },
    legal: settings?.legal || {
      termsOfService: { ar: '', en: '' },
      privacyPolicy: { ar: '', en: '' },
      refundPolicy: { ar: '', en: '' }
    }
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleNestedChange = (section, parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value
        }
      }
    }))
  }

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }))
  }

  const handleSave = async (section) => {
    setSaving(true)
    try {
      switch (section) {
        case 'general':
          await onSaveGeneral(formData.general)
          break
        case 'payment':
          await onSavePayment(formData.payment)
          break
        case 'email':
          await onSaveEmail(formData.email)
          break
        case 'sms':
          await onSaveSMS(formData.sms)
          break
        case 'notifications':
          await onSaveNotifications(formData.notifications)
          break
        case 'features':
          await onSaveFeatures(formData.features)
          break
        case 'legal':
          await onSaveLegal(formData.legal)
          break
      }
    } finally {
      setSaving(false)
    }
  }

  const handleMaintenanceToggle = async () => {
    await onToggleMaintenance()
    handleChange('features', 'maintenanceMode', !formData.features.maintenanceMode)
  }

  if (loading) {
    return (
      <div className="card settings-loading">
        <div className="skeleton-header">
          <div className="skeleton-text" style={{ width: '200px', height: '30px' }}></div>
        </div>
        <div className="skeleton-tabs">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="skeleton-text" style={{ width: '80px', height: '40px' }}></div>
          ))}
        </div>
        <div className="skeleton-form">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="skeleton-text" style={{ width: '100%', height: '50px', marginBottom: '16px' }}></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="settings-container">
      {/* Maintenance Mode Banner */}
      {formData.features.maintenanceMode && (
        <div className="maintenance-banner">
          <span className="maintenance-icon">🛠️</span>
          <span>Maintenance Mode is currently ENABLED. The platform is inaccessible to users.</span>
          <button className="btn btn-sm btn-warning" onClick={handleMaintenanceToggle}>
            Disable
          </button>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="settings-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="settings-section">
          <div className="section-header">
            <h3>General Settings</h3>
            <button className="btn btn-primary" onClick={() => handleSave('general')} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Platform Name (English)</label>
              <input
                type="text"
                value={formData.general.platformName}
                onChange={(e) => handleChange('general', 'platformName', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Platform Name (Arabic)</label>
              <input
                type="text"
                value={formData.general.platformNameAr}
                onChange={(e) => handleChange('general', 'platformNameAr', e.target.value)}
                className="form-input"
                dir="rtl"
              />
            </div>
            <div className="form-group">
              <label>Support Email</label>
              <input
                type="email"
                value={formData.general.supportEmail}
                onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Support Phone</label>
              <input
                type="tel"
                value={formData.general.supportPhone}
                onChange={(e) => handleChange('general', 'supportPhone', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Default Language</label>
              <select
                value={formData.general.defaultLanguage}
                onChange={(e) => handleChange('general', 'defaultLanguage', e.target.value)}
                className="form-input"
              >
                <option value="ar">Arabic</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="form-group">
              <label>Timezone</label>
              <select
                value={formData.general.timezone}
                onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                className="form-input"
              >
                <option value="Asia/Riyadh">Asia/Riyadh</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div className="form-group">
              <label>Primary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={formData.general.primaryColor}
                  onChange={(e) => handleChange('general', 'primaryColor', e.target.value)}
                  className="color-input"
                />
                <span className="color-value">{formData.general.primaryColor}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={formData.general.secondaryColor}
                  onChange={(e) => handleChange('general', 'secondaryColor', e.target.value)}
                  className="color-input"
                />
                <span className="color-value">{formData.general.secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="settings-section">
          <div className="section-header">
            <h3>Payment Settings</h3>
            <button className="btn btn-primary" onClick={() => handleSave('payment')} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Payment Gateway</label>
              <select
                value={formData.payment.gateway}
                onChange={(e) => handleChange('payment', 'gateway', e.target.value)}
                className="form-input"
              >
                <option value="none">None</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="mada">Mada</option>
              </select>
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select
                value={formData.payment.currency}
                onChange={(e) => handleChange('payment', 'currency', e.target.value)}
                className="form-input"
              >
                <option value="SAR">SAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="form-group">
              <label>Default Commission Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.payment.defaultCommissionRate}
                onChange={(e) => handleChange('payment', 'defaultCommissionRate', parseInt(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Minimum Payout Amount</label>
              <input
                type="number"
                min="0"
                value={formData.payment.minimumPayoutAmount}
                onChange={(e) => handleChange('payment', 'minimumPayoutAmount', parseInt(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Payout Schedule</label>
              <select
                value={formData.payment.payoutSchedule}
                onChange={(e) => handleChange('payment', 'payoutSchedule', e.target.value)}
                className="form-input"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="settings-section">
          <div className="section-header">
            <h3>Email Settings</h3>
            <button className="btn btn-primary" onClick={() => handleSave('email')} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>SMTP Host</label>
              <input
                type="text"
                value={formData.email.host}
                onChange={(e) => handleChange('email', 'host', e.target.value)}
                className="form-input"
                placeholder="smtp.example.com"
              />
            </div>
            <div className="form-group">
              <label>SMTP Port</label>
              <input
                type="number"
                value={formData.email.port}
                onChange={(e) => handleChange('email', 'port', parseInt(e.target.value))}
                className="form-input"
                placeholder="587"
              />
            </div>
            <div className="form-group">
              <label>Secure (TLS)</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.email.secure}
                  onChange={(e) => handleChange('email', 'secure', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>SMTP Username</label>
              <input
                type="text"
                value={formData.email.user}
                onChange={(e) => handleChange('email', 'user', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>SMTP Password</label>
              <input
                type="password"
                value={formData.email.password}
                onChange={(e) => handleChange('email', 'password', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>From Name</label>
              <input
                type="text"
                value={formData.email.fromName}
                onChange={(e) => handleChange('email', 'fromName', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>From Email</label>
              <input
                type="email"
                value={formData.email.fromEmail}
                onChange={(e) => handleChange('email', 'fromEmail', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* SMS Settings */}
      {activeTab === 'sms' && (
        <div className="settings-section">
          <div className="section-header">
            <h3>SMS Settings</h3>
            <button className="btn btn-primary" onClick={() => handleSave('sms')} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>SMS Provider</label>
              <select
                value={formData.sms.provider}
                onChange={(e) => handleChange('sms', 'provider', e.target.value)}
                className="form-input"
              >
                <option value="none">None</option>
                <option value="twilio">Twilio</option>
                <option value="vonage">Vonage</option>
                <option value="messagebird">MessageBird</option>
              </select>
            </div>
            <div className="form-group">
              <label>API Key</label>
              <input
                type="text"
                value={formData.sms.apiKey}
                onChange={(e) => handleChange('sms', 'apiKey', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>API Secret</label>
              <input
                type="password"
                value={formData.sms.apiSecret}
                onChange={(e) => handleChange('sms', 'apiSecret', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Sender ID</label>
              <input
                type="text"
                value={formData.sms.senderId}
                onChange={(e) => handleChange('sms', 'senderId', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Enable SMS</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.sms.enabled}
                  onChange={(e) => handleChange('sms', 'enabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="settings-section">
          <div className="section-header">
            <h3>Notifications Settings</h3>
            <button className="btn btn-primary" onClick={() => handleSave('notifications')} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Push Notifications</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.notifications.pushEnabled}
                  onChange={(e) => handleChange('notifications', 'pushEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>Email Notifications</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.notifications.emailEnabled}
                  onChange={(e) => handleChange('notifications', 'emailEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>SMS Notifications</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.notifications.smsEnabled}
                  onChange={(e) => handleChange('notifications', 'smsEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="form-group full-width">
              <label>FCM Server Key</label>
              <input
                type="text"
                value={formData.notifications.fcmServerKey}
                onChange={(e) => handleChange('notifications', 'fcmServerKey', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group full-width">
              <label>FCM Sender ID</label>
              <input
                type="text"
                value={formData.notifications.fcmSenderId}
                onChange={(e) => handleChange('notifications', 'fcmSenderId', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Features Settings */}
      {activeTab === 'features' && (
        <div className="settings-section">
          <div className="section-header">
            <h3>Feature Toggles</h3>
            <button className="btn btn-primary" onClick={() => handleSave('features')} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="features-grid">
            {Object.entries(formData.features).map(([feature, enabled]) => (
              <div key={feature} className="feature-item">
                <div className="feature-info">
                  <span className="feature-name">{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleFeatureToggle(feature)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Settings */}
      {activeTab === 'legal' && (
        <div className="settings-section">
          <div className="section-header">
            <h3>Legal Documents</h3>
            <button className="btn btn-primary" onClick={() => handleSave('legal')} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="legal-tabs">
            <div className="language-tabs">
              <button className="language-tab active">English</button>
              <button className="language-tab">Arabic</button>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Terms of Service</label>
              <textarea
                value={formData.legal.termsOfService.en}
                onChange={(e) => handleNestedChange('legal', 'termsOfService', 'en', e.target.value)}
                className="form-input"
                rows={8}
                placeholder="Enter Terms of Service..."
              />
            </div>
            <div className="form-group full-width">
              <label>Privacy Policy</label>
              <textarea
                value={formData.legal.privacyPolicy.en}
                onChange={(e) => handleNestedChange('legal', 'privacyPolicy', 'en', e.target.value)}
                className="form-input"
                rows={8}
                placeholder="Enter Privacy Policy..."
              />
            </div>
            <div className="form-group full-width">
              <label>Refund Policy</label>
              <textarea
                value={formData.legal.refundPolicy.en}
                onChange={(e) => handleNestedChange('legal', 'refundPolicy', 'en', e.target.value)}
                className="form-input"
                rows={8}
                placeholder="Enter Refund Policy..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
