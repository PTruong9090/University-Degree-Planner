const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchCourses(limit = 20000) {
    const res = await fetch(`${BASE_URL}/api/courses?limit=${limit}`)

    if (!res.ok) {
        throw new Error('Failed to fetch courses')
    }

    return res.json()
}