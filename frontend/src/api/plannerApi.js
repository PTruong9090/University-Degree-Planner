import { apiFetch } from './http'

export function fetchPlanners() {
  return apiFetch('/api/planners')
}

export function createPlanner(payload) {
  return apiFetch('/api/planners', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updatePlanner(id, payload) {
  return apiFetch(`/api/planners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deletePlanner(id) {
  return apiFetch(`/api/planners/${id}`, {
    method: 'DELETE',
  })
}
