import { NextResponse } from 'next/server'

// Mock users data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'developer', status: 'active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'pending' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'developer', status: 'active' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'user', status: 'inactive' },
]

let nextId = 6

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request) {
  const body = await request.json()
  const newUser = {
    id: nextId++,
    ...body,
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  return NextResponse.json(newUser, { status: 201 })
}
