import { NextResponse } from 'next/server'

// Mock stats data
const stats = {
  totalUsers: 1248,
  activeUsers: 892,
  gitCommits: 3421,
  apiCalls: 15678,
  userGrowth: 12,
  commitGrowth: 8
}

export async function GET() {
  return NextResponse.json(stats)
}
