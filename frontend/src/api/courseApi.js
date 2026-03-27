import { apiFetch } from './http'

// Course cache
const COURSE_CACHE_TTL_MS = 1000 * 60 * 30
const COURSE_CACHE_PREFIX = 'planbear-course-cache'

let memoryCourseCache = new Map()       // In-memory cache
let inFlightCourseRequests = new Map()  // In-flight requests (prevents duplicate requests)

// Get key for current stash
function getCacheKey(limit) {
    return `${COURSE_CACHE_PREFIX}:${limit}`
}

// Get data from session cache
function readSessionCache(limit) {
    if (typeof window === 'undefined') return null

    try {
        const raw = window.sessionStorage.getItem(getCacheKey(limit))
        if (!raw) return null

        const parsed = JSON.parse(raw)
        if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null

        // Remove data if TTL expires
        if (Date.now() - parsed.timestamp > COURSE_CACHE_TTL_MS) {
            window.sessionStorage.removeItem(getCacheKey(limit))
            return null
        }

        return parsed.data
    } catch (error) {
        return null
    }
}

// Store data into session cache
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

// Fetch courses data
export async function fetchCourses(limit = 20000, options = {}) {
    const { forceRefresh = false } = options

    // Check in-memory cache
    if (!forceRefresh && memoryCourseCache.has(limit)) {
        return memoryCourseCache.get(limit)
    }

    // Check session cache
    if (!forceRefresh) {
        const sessionCachedCourses = readSessionCache(limit)
        if (sessionCachedCourses) {
            memoryCourseCache.set(limit, sessionCachedCourses)
            return sessionCachedCourses
        }
    }

    // Check in-flight requests
    if (!forceRefresh && inFlightCourseRequests.has(limit)) {
        return inFlightCourseRequests.get(limit)
    }

    // Fetch courses from API
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

    // Prevent multiple same requests
    inFlightCourseRequests.set(limit, request)
    return request
}
