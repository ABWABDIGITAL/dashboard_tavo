'use client'

export default function GitActivity({ data, fullView, onSync, onAnalyze }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Git Activity</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onSync}>
            🔄 Sync
          </button>
          <button className="btn btn-primary" onClick={onAnalyze}>
            🤖 AI Analyze
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          No git activity data available
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Commit</th>
              <th>Author</th>
              <th>Message</th>
              <th>Time</th>
              <th>AI Insights</th>
            </tr>
          </thead>
          <tbody>
            {(fullView ? data : data.slice(0, 5)).map((commit) => (
              <tr key={commit.id}>
                <td>
                  <code style={{ 
                    background: 'var(--bg-dark)', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {commit.hash?.substring(0, 7)}
                  </code>
                </td>
                <td>{commit.author}</td>
                <td>{commit.message}</td>
                <td>{new Date(commit.timestamp).toLocaleString()}</td>
                <td>
                  {commit.aiInsights && (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: 'var(--primary)',
                      color: 'white'
                    }}>
                      {commit.aiInsights}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!fullView && data.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button className="btn btn-secondary">View All Activity</button>
        </div>
      )}
    </div>
  )
}
