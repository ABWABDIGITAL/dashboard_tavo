'use client'

export default function StatsCards({ stats }) {
  if (!stats) {
    stats = {
      totalUsers: 0,
      activeUsers: 0,
      gitCommits: 0,
      apiCalls: 0,
      userGrowth: 0,
      commitGrowth: 0
    }
  }

  const cards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      change: `+${stats.userGrowth}%`,
      positive: true 
    },
    { 
      title: 'Active Users', 
      value: stats.activeUsers, 
      change: 'Live',
      positive: true 
    },
    { 
      title: 'Git Commits', 
      value: stats.gitCommits, 
      change: `+${stats.commitGrowth}%`,
      positive: true 
    },
    { 
      title: 'API Calls', 
      value: stats.apiCalls, 
      change: '+12%',
      positive: true 
    },
  ]

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <h3>{card.title}</h3>
          <div className="stat-value">{card.value.toLocaleString()}</div>
          <div className={`stat-change ${card.positive ? 'positive' : 'negative'}`}>
            {card.change} from last month
          </div>
        </div>
      ))}
    </div>
  )
}
