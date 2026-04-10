'use client'

export default function Sidebar({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
    { id: 'staff', label: 'Staff', icon: '👨‍🍳' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'reservations', label: 'Reservations', icon: '📅' },
    { id: 'financials', label: 'Financials', icon: '💰' },
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'blacklist', label: 'Blacklist', icon: '🚫' },
    { id: 'logs', label: 'Audit Logs', icon: '📋' },
    { id: 'git', label: 'Git Activity', icon: '📁' },
    { id: 'api', label: 'API Control', icon: '🔌' },
  ]

  return (
    <aside className="sidebar">
      <div className="logo">Dashboard Tavo</div>
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </aside>
  )
}
