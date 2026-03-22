import { apiFetch } from './http'

const COURSE_CACHE_TTL_MS = 1000 * 60 * 30
const COURSE_CACHE_PREFIX = 'planbear-course-cache'

let memoryCourseCache = new Map()
let inFlightCourseRequests = new Map()

function getCacheKey(limit) {
    return `${COURSE_CACHE_PREFIX}:${limit}`
}

function readSessionCache(limit) {
    if (typeof window === 'undefined') return null

    try {
        const raw = window.sessionStorage.getItem(getCacheKey(limit))
        if (!raw) return null

        const parsed = JSON.parse(raw)
        if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null

        if (Date.now() - parsed.timestamp > COURSE_CACHE_TTL_MS) {
            window.sessionStorage.removeItem(getCacheKey(limit))
            return null
        }

        return parsed.data
    } catch (error) {
        return null
    }
}

function writeSessionCache(limit, data) {
    if (typeof window === 'undefined') return

    try {
        window.sessionStorage.setItem(
            getCacheKey(limit),
            JSON.stringify({
                timestamp: Date.now(),
                data,
            })
        )
    } catch (error) {
        // Ignore storage failures and keep the in-memory cache path.
    }
}

export async function fetchCourses(limit = 20000, options = {}) {
    const { forceRefresh = false } = options

    if (!forceRefresh && memoryCourseCache.has(limit)) {
        return memoryCourseCache.get(limit)
    }

    if (!forceRefresh) {
        const sessionCachedCourses = readSessionCache(limit)
        if (sessionCachedCourses) {
            memoryCourseCache.set(limit, sessionCachedCourses)
            return sessionCachedCourses
        }
    }

    if (!forceRefresh && inFlightCourseRequests.has(limit)) {
        return inFlightCourseRequests.get(limit)
    }

    const request = apiFetch(`/api/courses?limit=${limit}`, {
        includeCredentials: false,
    }).then((data) => {
        memoryCourseCache.set(limit, data)
        writeSessionCache(limit, data)
        inFlightCourseRequests.delete(limit)
        return data
    }).catch((error) => {
        inFlightCourseRequests.delete(limit)
        throw error
    })

    inFlightCourseRequests.set(limit, request)
    return request
}
