import { NextResponse } from 'next/server'

// Mock git activity data
const gitActivity = [
  { 
    id: 1, 
    hash: 'abc123def456', 
    author: 'John Doe', 
    message: 'Update dashboard styling', 
    timestamp: '2024-01-15T10:30:00Z',
    aiInsights: 'UI improvements'
  },
  { 
    id: 2, 
    hash: 'def789ghi012', 
    author: 'Jane Smith', 
    message: 'Fix API integration bug', 
    timestamp: '2024-01-15T09:15:00Z',
    aiInsights: 'Critical fix'
  },
  { 
    id: 3, 
    hash: 'ghi345jkl678', 
    author: 'Bob Wilson', 
    message: 'Add user authentication', 
    timestamp: '2024-01-14T16:45:00Z',
    aiInsights: 'Security enhancement'
  },
  { 
    id: 4, 
    hash: 'jkl901mno234', 
    author: 'Alice Brown', 
    message: 'Optimize database queries', 
    timestamp: '2024-01-14T14:20:00Z',
    aiInsights: 'Performance'
  },
  { 
    id: 5, 
    hash: 'mno567pqr890', 
    author: 'Charlie Davis', 
    message: 'Update documentation', 
    timestamp: '2024-01-14T11:00:00Z',
    aiInsights: 'Documentation'
  },
]

export async function GET() {
  return NextResponse.json(gitActivity)
}
