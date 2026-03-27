const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function apiFetch(path, options = {}) {

  // Destructure options
  const { includeCredentials = true, headers: customHeaders, body, ...restOptions } = options

  // Header setup
  const headers = {
    ...(customHeaders ?? {}),
  }

  // JSON handling
  if (body && !(body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  // Fetch request
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: includeCredentials ? 'include' : 'same-origin',
    headers,
    body,
    ...restOptions,
  })

  // Response handling
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  // Error handling
  if (!response.ok) {
    const error = new Error(
      typeof data === 'object' && data?.message ? data.message : 'Request failed'
    )
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
