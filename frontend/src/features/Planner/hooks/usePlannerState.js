import { useEffect, useMemo, useState } from 'react'
import { fetchCourses } from '../../../api/courseApi'
import {
  createPlanner as createPlannerRequest,
  deletePlanner as deletePlannerRequest,
  fetchPlanners,
  updatePlanner as updatePlannerRequest,
} from '../../../api/plannerApi'
import { getCoursesInPlan } from '../../../utils/courseInPlan'

const LOCAL_STORAGE_KEY = 'ucla-planner-guest-v1'

function createEmptyPlan() {
  return {
    year1: {
      fall: [],
      winter: [],
      spring: [],
      summer: [],
    },
    year2: {
      fall: [],
      winter: [],
      spring: [],
      summer: [],
    },
    year3: {
      fall: [],
      winter: [],
      spring: [],
      summer: [],
    },
    year4: {
      fall: [],
      winter: [],
      spring: [],
      summer: [],
    },
  }
}

function normalizePlannerRecord(planner, fallbackIndex = 0) {
  return {
    id: planner.id,
    name: planner.name?.trim() || 'Untitled Plan',
    plan: planner.planData ?? createEmptyPlan(),
    position: Number.isInteger(planner.position) ? planner.position : fallbackIndex,
  }
}

function createLocalPlanner(name = 'My Plan', index = 0) {
  return {
    id: `local-plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    plan: createEmptyPlan(),
    position: index,
  }
}

function parseLocalPlannerStore() {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) {
      const initialPlanner = createLocalPlanner('My Plan', 0)
      return {
        activePlanId: initialPlanner.id,
        planners: [initialPlanner],
      }
    }

    const parsed = JSON.parse(raw)
    const planners = Array.isArray(parsed?.planners)
      ? parsed.planners.map((planner, index) => ({
          id: planner.id ?? `local-plan-${index}`,
          name: planner.name?.trim() || 'Untitled Plan',
          plan: planner.plan ?? createEmptyPlan(),
          position: Number.isInteger(planner.position) ? planner.position : index,
        }))
      : []

    if (planners.length === 0) {
      const initialPlanner = createLocalPlanner('My Plan', 0)
      return {
        activePlanId: initialPlanner.id,
        planners: [initialPlanner],
      }
    }

    return {
      activePlanId:
        planners.find((planner) => planner.id === parsed?.activePlanId)?.id ?? planners[0].id,
      planners: planners.sort((a, b) => a.position - b.position),
    }
  } catch (error) {
    console.error(error)
    const initialPlanner = createLocalPlanner('My Plan', 0)
    return {
      activePlanId: initialPlanner.id,
      planners: [initialPlanner],
    }
  }
}

export function usePlannerState() {
  const [courses, setCourses] = useState([])
  const [planners, setPlanners] = useState([])
  const [activePlanId, setActivePlanId] = useState(null)
  const [activeItem, setActiveItem] = useState(null)
  const [subjectFilter, setSubjectFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeYearIndex, setActiveYearIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [storageMode, setStorageMode] = useState('remote')

  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((fetchError) => console.log(fetchError))
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadPlanners = async () => {
      setIsLoading(true)
      setError('')
      setStorageMode('remote')

      try {
        const data = await fetchPlanners()
        if (!isMounted) return

        let nextPlanners = (data.planners ?? []).map(normalizePlannerRecord)

        if (nextPlanners.length === 0) {
          const created = await createPlannerRequest({
            name: 'My Plan',
            planData: createEmptyPlan(),
            position: 0,
          })

          if (!isMounted) return
          nextPlanners = [normalizePlannerRecord(created.planner)]
        }

        nextPlanners.sort((a, b) => a.position - b.position)
        setPlanners(nextPlanners)
        setActivePlanId((currentId) =>
          currentId && nextPlanners.some((planner) => planner.id === currentId)
            ? currentId
            : nextPlanners[0].id
        )
      } catch (loadError) {
        if (!isMounted) return

        const localStore = parseLocalPlannerStore()
        setPlanners(localStore.planners)
        setActivePlanId(localStore.activePlanId)
        setStorageMode('local')
        setError(
          loadError.status === 401
            ? 'Guest mode: plans are saving to this browser only.'
            : 'Offline mode: plans are saving to this browser only.'
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPlanners()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (storageMode !== 'local' || planners.length === 0) return

    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        activePlanId,
        planners,
      })
    )
  }, [activePlanId, planners, storageMode])

  const activePlanRecord =
    planners.find((planner) => planner.id === activePlanId) ??
    planners[0] ?? {
      id: '',
      name: 'My Plan',
      plan: createEmptyPlan(),
      position: 0,
    }

  const plan = activePlanRecord.plan
  const activePlanName = activePlanRecord.name

  const planSummaries = useMemo(
    () =>
      planners.map((planner) => ({
        id: planner.id,
        name: planner.name,
      })),
    [planners]
  )

  const persistPlanner = async (plannerId, payload) => {
    const data = await updatePlannerRequest(plannerId, payload)
    return normalizePlannerRecord(data.planner)
  }

  const replacePlanner = (updatedPlanner) => {
    setPlanners((currentPlanners) =>
      currentPlanners
        .map((planner) => (planner.id === updatedPlanner.id ? updatedPlanner : planner))
        .sort((a, b) => a.position - b.position)
    )
  }

  const createPlan = async () => {
    const nextPosition = planners.length

    if (storageMode === 'local') {
      const nextPlanner = createLocalPlanner(`Plan ${nextPosition + 1}`, nextPosition)
      setPlanners((currentPlanners) => [...currentPlanners, nextPlanner].sort((a, b) => a.position - b.position))
      setActivePlanId(nextPlanner.id)
      setActiveYearIndex(0)
      setActiveItem(null)
      setError('Guest mode: plans are saving to this browser only.')
      return
    }

    try {
      const data = await createPlannerRequest({
        name: `Plan ${nextPosition + 1}`,
        planData: createEmptyPlan(),
        position: nextPosition,
      })

      const nextPlanner = normalizePlannerRecord(data.planner, nextPosition)
      setPlanners((currentPlanners) => [...currentPlanners, nextPlanner].sort((a, b) => a.position - b.position))
      setActivePlanId(nextPlanner.id)
      setActiveYearIndex(0)
      setActiveItem(null)
      setError('')
    } catch (createError) {
      setError(createError.message || 'Unable to create planner.')
    }
  }

  const selectPlan = (planId) => {
    if (!planners.some((planner) => planner.id === planId)) return
    setActivePlanId(planId)
    setActiveYearIndex(0)
    setActiveItem(null)
  }

  const renamePlan = async (planId, name) => {
    const trimmedName = name.trim()
    if (!trimmedName) return false

    if (storageMode === 'local') {
      setPlanners((currentPlanners) =>
        currentPlanners.map((planner) =>
          planner.id === planId ? { ...planner, name: trimmedName } : planner
        )
      )
      setError('Guest mode: plans are saving to this browser only.')
      return true
    }

    try {
      const updatedPlanner = await persistPlanner(planId, { name: trimmedName })
      replacePlanner(updatedPlanner)
      setError('')
      return true
    } catch (renameError) {
      setError(renameError.message || 'Unable to rename planner.')
      return false
    }
  }

  const deletePlan = async (planId) => {
    if (planners.length <= 1) {
      return false
    }

    if (storageMode === 'local') {
      setPlanners((currentPlanners) => {
        const nextPlanners = currentPlanners.filter((planner) => planner.id !== planId)
        if (activePlanId === planId && nextPlanners.length > 0) {
          setActivePlanId(nextPlanners[0].id)
        }
        return nextPlanners
      })
      setActiveYearIndex(0)
      setActiveItem(null)
      setError('Guest mode: plans are saving to this browser only.')
      return true
    }

    try {
      await deletePlannerRequest(planId)

      setPlanners((currentPlanners) => {
        const nextPlanners = currentPlanners.filter((planner) => planner.id !== planId)
        if (activePlanId === planId && nextPlanners.length > 0) {
          setActivePlanId(nextPlanners[0].id)
        }
        return nextPlanners
      })

      setActiveYearIndex(0)
      setActiveItem(null)
      setError('')
      return true
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete planner.')
      return false
    }
  }

  const updateActivePlan = async (updater) => {
    if (!activePlanRecord.id) return

    const nextPlan = updater(activePlanRecord.plan)
    const optimisticPlanner = { ...activePlanRecord, plan: nextPlan }
    replacePlanner(optimisticPlanner)

    if (storageMode === 'local') {
      setError('Guest mode: plans are saving to this browser only.')
      return
    }

    try {
      const persistedPlanner = await persistPlanner(activePlanRecord.id, { planData: nextPlan })
      replacePlanner(persistedPlanner)
      setError('')
    } catch (updateError) {
      replacePlanner(activePlanRecord)
      setError(updateError.message || 'Unable to save planner changes.')
    }
  }

  const courseMap = useMemo(() => {
    return courses.reduce((map, course) => {
      map[course.courseID] = course
      return map
    }, {})
  }, [courses])

  const availableCourses = useMemo(() => {
    const used = getCoursesInPlan(plan)

    return courses
      .map((course) => course.courseID)
      .filter((courseID) => !used.has(courseID))
  }, [courses, plan])

  const collator = useMemo(
    () => new Intl.Collator('en', { numeric: true, sensitivity: 'base' }),
    []
  )

  const subjects = useMemo(
    () =>
      Array.from(new Set(Object.values(courseMap).map((course) => course.subject)))
        .sort()
        .map((subject) => ({ label: subject, value: subject })),
    [courseMap]
  )

  const filteredCourses = useMemo(() => {
    let list = availableCourses

    if (subjectFilter) {
      list = list.filter((courseID) => courseMap[courseID]?.subject === subjectFilter)
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      list = list.filter((courseID) => {
        const course = courseMap[courseID]
        if (!course) return false

        return (
          course.course_name?.toLowerCase().includes(lowerSearch) ||
          courseID.toLowerCase().includes(lowerSearch)
        )
      })
    }

    return [...list].sort((a, b) => collator.compare(a, b))
  }, [availableCourses, collator, courseMap, searchTerm, subjectFilter])

  const handleDragStart = ({ active }) => {
    const courseID = active.data.current.courseID
    setActiveItem(courseMap[courseID])
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveItem(null)
      return
    }

    const from = active.data.current
    const to = over.data.current
    const courseID = from.courseID

    setActiveItem(null)

    if (to.type === 'plan' && plan[to.year][to.quarter].includes(courseID)) {
      return
    }

    if (from.type === 'sidebar' && to.type === 'plan') {
      void updateActivePlan((currentPlan) => ({
        ...currentPlan,
        [to.year]: {
          ...currentPlan[to.year],
          [to.quarter]: [...currentPlan[to.year][to.quarter], courseID],
        },
      }))
      return
    }

    if (from.type === 'plan' && to.type === 'sidebar') {
      void updateActivePlan((currentPlan) => ({
        ...currentPlan,
        [from.year]: {
          ...currentPlan[from.year],
          [from.quarter]: currentPlan[from.year][from.quarter].filter((id) => id !== courseID),
        },
      }))
      return
    }

    if (from.type === 'plan' && to.type === 'plan') {
      void updateActivePlan((currentPlan) => {
        if (from.year === to.year && from.quarter === to.quarter) {
          return currentPlan
        }

        const sourceList = currentPlan[from.year][from.quarter].filter((id) => id !== courseID)
        const destinationList = [...currentPlan[to.year][to.quarter], courseID]

        if (from.year === to.year) {
          return {
            ...currentPlan,
            [from.year]: {
              ...currentPlan[from.year],
              [from.quarter]: sourceList,
              [to.quarter]: destinationList,
            },
          }
        }

        return {
          ...currentPlan,
          [from.year]: {
            ...currentPlan[from.year],
            [from.quarter]: sourceList,
          },
          [to.year]: {
            ...currentPlan[to.year],
            [to.quarter]: destinationList,
          },
        }
      })
    }
  }

  return {
    activeItem,
    activePlanId: activePlanRecord.id,
    activePlanName,
    activeYearIndex,
    courseMap,
    createPlan,
    deletePlan,
    error,
    filteredCourses,
    handleDragEnd,
    handleDragStart,
    isLoading,
    isGuestMode: storageMode === 'local',
    plan,
    planSummaries,
    renamePlan,
    searchTerm,
    selectPlan,
    setActiveYearIndex,
    setSearchTerm,
    setSubjectFilter,
    subjectFilter,
    subjects,
  }
}
