import { useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { fetchCourses } from '../../../api/courseApi'
import { getCoursesInPlan } from '../../../utils/courseInPlan'

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

function createPlanId() {
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createPlanRecord(name = 'My Plan') {
  const id = createPlanId()
  return {
    id,
    name,
    plan: createEmptyPlan(),
  }
}

function createInitialPlannerStore() {
  const initialPlan = createPlanRecord('My Plan')

  return {
    activePlanId: initialPlan.id,
    planOrder: [initialPlan.id],
    plansById: {
      [initialPlan.id]: initialPlan,
    },
  }
}

function isLegacySinglePlan(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      value.year1 &&
      value.year2 &&
      value.year3 &&
      value.year4
  )
}

function isPlannerStore(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof value.activePlanId === 'string' &&
      Array.isArray(value.planOrder) &&
      value.plansById &&
      typeof value.plansById === 'object'
  )
}

function normalizePlannerStore(value) {
  if (isPlannerStore(value)) {
    const planOrder = value.planOrder.filter((planId) => value.plansById[planId])
    const firstPlanId = planOrder[0]

    if (planOrder.length === 0 || !firstPlanId) {
      return createInitialPlannerStore()
    }

    return {
      activePlanId: value.plansById[value.activePlanId] ? value.activePlanId : firstPlanId,
      planOrder,
      plansById: planOrder.reduce((plans, planId) => {
        const currentPlan = value.plansById[planId]
        plans[planId] = {
          id: currentPlan.id ?? planId,
          name: currentPlan.name?.trim() || 'Untitled Plan',
          plan: currentPlan.plan ?? createEmptyPlan(),
        }
        return plans
      }, {}),
    }
  }

  if (isLegacySinglePlan(value)) {
    const migratedPlan = createPlanRecord('My Plan')
    migratedPlan.plan = value

    return {
      activePlanId: migratedPlan.id,
      planOrder: [migratedPlan.id],
      plansById: {
        [migratedPlan.id]: migratedPlan,
      },
    }
  }

  return createInitialPlannerStore()
}

export function usePlannerState() {
  const [courses, setCourses] = useState([])
  const [plannerStore, setPlannerStore] = useLocalStorage('ucla-planner-v1', createInitialPlannerStore())
  const [activeItem, setActiveItem] = useState(null)
  const [subjectFilter, setSubjectFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeYearIndex, setActiveYearIndex] = useState(0)

  const normalizedPlannerStore = useMemo(() => normalizePlannerStore(plannerStore), [plannerStore])

  useEffect(() => {
    if (!isPlannerStore(plannerStore)) {
      setPlannerStore(normalizedPlannerStore)
    }
  }, [normalizedPlannerStore, plannerStore, setPlannerStore])

  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.log(error))
  }, [])

  const activePlanRecord =
    normalizedPlannerStore.plansById[normalizedPlannerStore.activePlanId] ??
    normalizedPlannerStore.plansById[normalizedPlannerStore.planOrder[0]]

  const activePlanId = activePlanRecord.id
  const activePlanName = activePlanRecord.name
  const plan = activePlanRecord.plan

  const planSummaries = useMemo(
    () =>
      normalizedPlannerStore.planOrder.map((planId) => ({
        id: planId,
        name: normalizedPlannerStore.plansById[planId]?.name ?? 'Untitled Plan',
      })),
    [normalizedPlannerStore]
  )

  const updateActivePlan = (updater) => {
    setPlannerStore((currentStore) => {
      const normalizedStore = normalizePlannerStore(currentStore)
      const currentPlanRecord =
        normalizedStore.plansById[normalizedStore.activePlanId] ??
        normalizedStore.plansById[normalizedStore.planOrder[0]]

      return {
        ...normalizedStore,
        plansById: {
          ...normalizedStore.plansById,
          [currentPlanRecord.id]: {
            ...currentPlanRecord,
            plan: updater(currentPlanRecord.plan),
          },
        },
      }
    })
  }

  const createPlan = () => {
    const nextPlan = createPlanRecord(`Plan ${normalizedPlannerStore.planOrder.length + 1}`)

    setPlannerStore((currentStore) => {
      const normalizedStore = normalizePlannerStore(currentStore)

      return {
        activePlanId: nextPlan.id,
        planOrder: [...normalizedStore.planOrder, nextPlan.id],
        plansById: {
          ...normalizedStore.plansById,
          [nextPlan.id]: nextPlan,
        },
      }
    })

    setActiveYearIndex(0)
    setActiveItem(null)
  }

  const selectPlan = (planId) => {
    if (!normalizedPlannerStore.plansById[planId]) return
    setPlannerStore((currentStore) => {
      const normalizedStore = normalizePlannerStore(currentStore)
      if (!normalizedStore.plansById[planId]) {
        return normalizedStore
      }

      return {
        ...normalizedStore,
        activePlanId: planId,
      }
    })
    setActiveYearIndex(0)
    setActiveItem(null)
  }

  const renamePlan = (planId, name) => {
    const trimmedName = name.trim()
    if (!trimmedName) return false

    setPlannerStore((currentStore) => {
      const normalizedStore = normalizePlannerStore(currentStore)
      const planRecord = normalizedStore.plansById[planId]
      if (!planRecord) {
        return normalizedStore
      }

      return {
        ...normalizedStore,
        plansById: {
          ...normalizedStore.plansById,
          [planId]: {
            ...planRecord,
            name: trimmedName,
          },
        },
      }
    })

    return true
  }

  const deletePlan = (planId) => {
    if (normalizedPlannerStore.planOrder.length <= 1) {
      return false
    }

    setPlannerStore((currentStore) => {
      const normalizedStore = normalizePlannerStore(currentStore)
      if (!normalizedStore.plansById[planId] || normalizedStore.planOrder.length <= 1) {
        return normalizedStore
      }

      const nextPlanOrder = normalizedStore.planOrder.filter((id) => id !== planId)
      const { [planId]: _removedPlan, ...remainingPlans } = normalizedStore.plansById

      return {
        activePlanId:
          normalizedStore.activePlanId === planId
            ? nextPlanOrder[0]
            : normalizedStore.activePlanId,
        planOrder: nextPlanOrder,
        plansById: remainingPlans,
      }
    })

    setActiveYearIndex(0)
    setActiveItem(null)
    return true
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
      updateActivePlan((currentPlan) => ({
        ...currentPlan,
        [to.year]: {
          ...currentPlan[to.year],
          [to.quarter]: [...currentPlan[to.year][to.quarter], courseID],
        },
      }))
      return
    }

    if (from.type === 'plan' && to.type === 'sidebar') {
      updateActivePlan((currentPlan) => ({
        ...currentPlan,
        [from.year]: {
          ...currentPlan[from.year],
          [from.quarter]: currentPlan[from.year][from.quarter].filter((id) => id !== courseID),
        },
      }))
      return
    }

    if (from.type === 'plan' && to.type === 'plan') {
      updateActivePlan((currentPlan) => {
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
    activePlanId,
    activePlanName,
    activeYearIndex,
    courseMap,
    createPlan,
    deletePlan,
    filteredCourses,
    handleDragEnd,
    handleDragStart,
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
