"use client"

import * as React from "react"

export function CountdownTimer({ hoursInitial = 8 }: { hoursInitial?: number }) {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: hoursInitial,
    minutes: 0,
    seconds: 0,
  })

  React.useEffect(() => {
    // Set static target time: today + hoursInitial hours
    const targetTime = new Date()
    targetTime.setHours(targetTime.getHours() + hoursInitial)

    const timer = setInterval(() => {
      const difference = targetTime.getTime() - new Date().getTime()

      if (difference <= 0) {
        clearInterval(timer)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)
        setTimeLeft({ hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [hoursInitial])

  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  return (
    <div className="flex items-center gap-2 select-none">
      <div className="flex flex-col items-center justify-center bg-[#FF6B35] text-white font-mono font-bold text-base px-2.5 py-1.5 rounded-lg shadow-sm">
        {formatNumber(timeLeft.hours)}
      </div>
      <span className="font-bold text-[#FF6B35] animate-pulse">:</span>
      <div className="flex flex-col items-center justify-center bg-[#FF6B35] text-white font-mono font-bold text-base px-2.5 py-1.5 rounded-lg shadow-sm">
        {formatNumber(timeLeft.minutes)}
      </div>
      <span className="font-bold text-[#FF6B35] animate-pulse">:</span>
      <div className="flex flex-col items-center justify-center bg-[#FF6B35] text-white font-mono font-bold text-base px-2.5 py-1.5 rounded-lg shadow-sm">
        {formatNumber(timeLeft.seconds)}
      </div>
    </div>
  )
}
