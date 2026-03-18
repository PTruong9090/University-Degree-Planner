import { apiFetch } from './http'

export function signup(payload) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getCurrentUser() {
  return apiFetch('/api/auth/me')
}

export function logout() {
  return apiFetch('/api/auth/logout', {
    method: 'POST',
  })
}
