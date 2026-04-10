'use client'

import { useState } from 'react'

export default function ApiControl({ baseUrl, fullView }) {
  const [testing, setTesting] = useState(null)
  const [testResults, setTestResults] = useState({})

  const endpoints = [
    { method: 'GET', path: '/api/stats', desc: 'Get dashboard stats' },
    { method: 'GET', path: '/api/users', desc: 'List all users' },
    { method: 'POST', path: '/api/users', desc: 'Create new user' },
    { method: 'PUT', path: '/api/users/:id', desc: 'Update user' },
    { method: 'DELETE', path: '/api/users/:id', desc: 'Delete user' },
    { method: 'GET', path: '/api/git/activity', desc: 'Get git activity' },
    { method: 'POST', path: '/api/git/sync', desc: 'Sync git repository' },
    { method: 'POST', path: '/api/ai/analyze', desc: 'Run AI analysis' },
  ]

  const testEndpoint = async (endpoint) => {
    setTesting(endpoint.path)
    try {
      const res = await fetch(`${baseUrl}${endpoint.path.replace(':id', '1')}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      setTestResults({
        ...testResults,
        [endpoint.path]: { status: res.status, success: res.ok, data }
      })
    } catch (err) {
      setTestResults({
        ...testResults,
        [endpoint.path]: { status: 0, success: false, error: err.message }
      })
    }
    setTesting(null)
  }

  const content = (
    <div className="api-config">
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
        API Base URL: <code style={{ color: 'var(--primary)' }}>{baseUrl}</code>
      </p>
      
      {endpoints.map((ep, index) => {
        const result = testResults[ep.path]
        return (
          <div key={index} className="api-endpoint">
            <span className={`api-method method-${ep.method.toLowerCase()}`}>
              {ep.method}
            </span>
            <span className="api-path">{ep.path}</span>
            <span className="api-desc">{ep.desc}</span>
            <button 
              className="btn btn-secondary"
              onClick={() => testEndpoint(ep)}
              disabled={testing === ep.path}
              style={{ marginLeft: 'auto', fontSize: '12px', padding: '6px 12px' }}
            >
              {testing === ep.path ? 'Testing...' : 'Test'}
            </button>
            {result && (
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                background: result.success ? 'var(--success)' : 'var(--danger)',
                color: 'white'
              }}>
                {result.status}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )

  if (fullView) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">API Control Panel</h2>
        </div>
        {content}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">API Endpoints</h2>
        <button className="btn btn-primary">View All</button>
      </div>
      {endpoints.slice(0, 4).map((ep, index) => (
        <div key={index} className="api-endpoint" style={{ marginBottom: '12px' }}>
          <span className={`api-method method-${ep.method.toLowerCase()}`}>
            {ep.method}
          </span>
          <span className="api-path">{ep.path}</span>
          <span className="api-desc">{ep.desc}</span>
        </div>
      ))}
    </div>
  )
}
