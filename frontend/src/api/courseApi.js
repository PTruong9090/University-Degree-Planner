import { apiFetch } from './http'

export async function fetchCourses(limit = 20000) {
    return apiFetch(`/api/courses?limit=${limit}`, {
        includeCredentials: false,
    })
}
