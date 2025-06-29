import { Progress } from "../../ui/progress"
import { useEffect, useRef, useState } from "react"

// Easing function (easeOutCubic)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function ProgressBar() {
  const [progress, setProgress] = useState(0)
  const duration = 5000 // 5 seconds
  const target = 100
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const t = Math.min(elapsed / duration, 1) // Normalize to 0-1
      const eased = easeOutCubic(t) * target

      setProgress(eased)

      if (t < 1) {
        requestAnimationFrame(animate)
      }
    }

    const frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <Progress value={progress} />
}
