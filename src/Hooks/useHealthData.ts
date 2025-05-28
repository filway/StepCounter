import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health'
import {
  initialize,
  Permission,
  readRecords,
  requestPermission,
} from 'react-native-health-connect'
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types'

const { Permissions } = AppleHealthKit.Constants

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      Permissions.Steps,
      Permissions.FlightsClimbed,
      Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
}

// iOS HealthKit
const useHealthData = (date: Date) => {
  const [hasPermissisons, setHasPermissions] = useState(false)
  const [steps, setSteps] = useState(0)
  const [flights, setFlights] = useState(0)
  const [distance, setDistance] = useState(0)

  const [androidPermissions, setAndroidPermissions] = useState<Permission[]>([])

  // HealthKit implementation
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      console.log('HealthKit is only available on iOS')
      return
    }

    AppleHealthKit.isAvailable((err, available) => {
      if (err) {
        console.log('Error checking HealthKit availability:', err)
        return
      }

      if (!available) {
        console.log('HealthKit is not available on this device')
        return
      }

      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions')
          return
        }
        setHasPermissions(true)
      })
    })
  }, [])

  useEffect(() => {
    if (!hasPermissisons) return

    const options: HealthInputOptions = {
      date: new Date().toISOString(),
    }

    // Fetch steps
    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error fetching steps:', err)
        return
      }
      setSteps(results?.value || 0)
    })

    // Fetch flights climbed
    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error fetching flights climbed:', err)
        return
      }
      setFlights(results?.value || 0)
    })

    // Fetch distance walking/running
    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error fetching distance:', err)
        return
      }
      setDistance(results?.value || 0)
    })
  }, [hasPermissisons, date])

  useEffect(() => {
    if (Platform.OS !== 'android') {
      console.log('Health Connect is only available on Android')
      return
    }

    const init = async () => {
      // initialize the client
      const isInitialized = await initialize()
      if (!isInitialized) {
        console.log('Failed to initialize Health Connect')
        return
      }

      // request permissions
      const grantedPermissions = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'FloorsClimbed' },
      ])

      setAndroidPermissions(grantedPermissions)
    }

    init()
  }, [])

  const hasAndroidPermission = (recordType: string) =>
    androidPermissions.some((perm) => perm.recordType === recordType)

  useEffect(() => {
    if (!hasAndroidPermission('Steps')) {
      console.log('No permission to read Steps')
      return
    }

    const getHealthData = async () => {
      const today = new Date()
      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
        endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
      }

      // Steps
      const steps = await readRecords('Steps', { timeRangeFilter })
      console.log(steps.records)
      const totalSteps = steps.records.reduce((sum, cur) => sum + cur.count, 0)
      setSteps(totalSteps)

      // Distance
      const distance = await readRecords('Distance', { timeRangeFilter })
      console.log(distance.records)
      const totalDistance = distance.records.reduce(
        (sum, cur) => sum + cur.distance.inMeters,
        0
      )
      setDistance(totalDistance)

      // Floors climbed
      const floorsClimbed = await readRecords('FloorsClimbed', {
        timeRangeFilter,
      })
      console.log(floorsClimbed.records)
      const totalFloors = floorsClimbed.records.reduce(
        (sum, cur) => sum + cur.floors,
        0
      )
      setFlights(totalFloors)
    }

    getHealthData()
  }, [androidPermissions, date])

  return { steps, flights, distance }
}

export default useHealthData
