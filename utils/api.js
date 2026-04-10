const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://46.202.134.87:4321/v1/api'

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    })
    
    if (res.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return null
    }
    
    return res
  } catch (err) {
    console.error('API Error:', err)
    throw err
  }
}

export async function get(endpoint) {
  return apiFetch(endpoint, { method: 'GET' })
}

export async function post(endpoint, data) {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function put(endpoint, data) {
  return apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function del(endpoint) {
  return apiFetch(endpoint, { method: 'DELETE' })
}

export async function patch(endpoint, data) {
  return apiFetch(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}

export { API_BASE }
