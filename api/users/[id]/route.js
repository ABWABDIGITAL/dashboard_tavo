import { NextResponse } from 'next/server'

// Mock users data (shared with parent route)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'developer', status: 'active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'pending' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'developer', status: 'active' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'user', status: 'inactive' },
]

export async function PUT(request, { params }) {
  const id = parseInt(params.id)
  const body = await request.json()
  
  const index = users.findIndex(u => u.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  users[index] = { ...users[index], ...body }
  return NextResponse.json(users[index])
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id)
  
  const index = users.findIndex(u => u.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  users.splice(index, 1)
  return NextResponse.json({ message: 'User deleted' })
}
