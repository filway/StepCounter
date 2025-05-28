import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import Value from './src/components/Value'
import RingProgress from './src/components/RingProgress'
import AppleHealthKit from 'react-native-health'
import useHealthData from './src/Hooks/useHealthData'
import { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'

const STEPS_GOAL = 10000

export default function App() {
  const [date, setDate] = useState(new Date())
  const { steps, distance, flights } = useHealthData(date)

  const changeDate = (numDays: number) => {
    const currentDate = new Date(date)

    currentDate.setDate(currentDate.getDate() + numDays)

    setDate(currentDate)
  }

  return (
    <View style={styles.container}>
      <View style={styles.datePicker}>
        <AntDesign
          onPress={() => changeDate(-1)}
          name="left"
          size={20}
          color="#C3FF53"
        />
        <Text style={styles.date}>{date.toDateString()}</Text>
        <AntDesign
          onPress={() => changeDate(1)}
          name="right"
          size={20}
          color="#C3FF53"
        />
      </View>

      <RingProgress
        radius={150}
        strokeWidth={50}
        progress={steps / STEPS_GOAL}
      />

      <View style={styles.values}>
        <Value label="Steps" value={steps.toString()} />
        <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
        <Value label="Flights Climbed" value={flights.toString()} />
      </View>

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 12,
    justifyContent: 'center',
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 100,
  },
  datePicker: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  date: {
    color: 'white',
    fontWeight: 500,
    fontSize: 20,
    marginHorizontal: 20,
  },
})
