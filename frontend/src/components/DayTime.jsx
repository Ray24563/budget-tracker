import dayjs from 'dayjs'

function DayTime() {
  const hour = dayjs().hour() // 0 - 23

  if (hour >= 5 && hour < 12)  return 'Good morning! Ready to take on expenses?'
  if (hour >= 12 && hour < 17) return 'Good afternoon! Keep the momentum going.'
  if (hour >= 17 && hour < 21) return 'Good evening! How did the day go?'
  return 'Jarvis, Play "A Night to Remember" by Laufey and Beabadobee.'
}

export default DayTime;