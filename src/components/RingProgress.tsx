import { useEffect } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import SVG, { Circle } from 'react-native-svg'
import { AntDesign } from '@expo/vector-icons'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type RingProgressProps = {
  radius?: number
  strokeWidth?: number
  progress?: number
}

const color = '#EE0F55'

const RingProgress = ({
  radius = 100,
  strokeWidth = 30,
  progress = 0.5,
}: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2
  const circumference = 2 * Math.PI * innerRadius

  const fill = useSharedValue(0)

  useEffect(() => {
    fill.value = withTiming(progress, { duration: 1500 })
  }, [progress])

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }))

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        alignSelf: 'center',
      }}
    >
      <SVG style={{ flex: 1 }}>
        {/* Background */}
        <Circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          strokeWidth={strokeWidth}
          stroke={color}
          opacity={0.2}
          fill="transparent"
        />
        {/* Foreground */}
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={radius}
          cy={radius}
          r={innerRadius}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={[circumference * progress, circumference]}
          strokeLinecap="round"
          rotation="-90"
          originX={radius}
          originY={radius}
        />
      </SVG>
      <AntDesign
        name="arrowright"
        size={strokeWidth * 0.8}
        color="black"
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: strokeWidth * 0.1,
        }}
      />
    </View>
  )
}

export default RingProgress
