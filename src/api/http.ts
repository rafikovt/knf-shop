import { useAuth } from '@/stores/auth'

const API_URL = import.meta.env.VITE_API_URL

const authHeaders = () => {
  const auth = useAuth()
  return auth?.user?.id ? { 'x-user-id': auth.user.id } : {}
}

const parse = async (res: Response) => {
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const err: any = new Error(data?.message || res.statusText)
    ;(err.response) = { data, status: res.status }
    throw err
  }
  return data
}

export const api = {
  get: async (path: string, { params }: { params?: Record<string, any> } = {}) => {
    const qs = params ? '?' + new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([_,v]) => v !== undefined && v !== ''))) : ''
    const res = await fetch(`${API_URL}${path}${qs}`, { headers: { ...authHeaders() } })
    return parse(res)
  },
  post: async (path: string, body?: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: body ? JSON.stringify(body) : undefined
    })
    return parse(res)
  }
}
