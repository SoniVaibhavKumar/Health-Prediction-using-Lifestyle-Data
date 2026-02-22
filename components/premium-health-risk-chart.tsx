"use client"

import type React from "react"

import { useState, useRef, useEffect, type KeyboardEvent, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Info, Heart, Activity, Brain, Moon, Shield, Pill } from "lucide-react"
import { useTheme } from "next-themes"

// Define our data structure
interface RiskCategory {
  id: string
  category: string
  risk: number
  previousRisk: number
  color: string
  icon: React.ReactNode
}

// Sample data - this would be replaced with actual user data
const defaultRiskData: RiskCategory[] = [
  {
    id: "cardiovascular",
    category: "Cardiovascular",
    risk: 28,
    previousRisk: 32,
    color: "#e11d48", // rose-600
    icon: <Heart className="h-4 w-4" />,
  },
  {
    id: "metabolic",
    category: "Metabolic",
    risk: 42,
    previousRisk: 45,
    color: "#0891b2", // cyan-600
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "sleep",
    category: "Sleep",
    risk: 35,
    previousRisk: 38,
    color: "#7c3aed", // violet-600
    icon: <Moon className="h-4 w-4" />,
  },
  {
    id: "mental",
    category: "Mental",
    risk: 22,
    previousRisk: 25,
    color: "#8b5cf6", // violet-500
    icon: <Brain className="h-4 w-4" />,
  },
  {
    id: "immune",
    category: "Immune",
    risk: 30,
    previousRisk: 28,
    color: "#16a34a", // green-600
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "chronic",
    category: "Chronic",
    risk: 38,
    previousRisk: 36,
    color: "#ea580c", // orange-600
    icon: <Pill className="h-4 w-4" />,
  },
]

interface PremiumHealthRiskChartProps {
  data?: RiskCategory[]
  title?: string
  subtitle?: string
}

export default function PremiumHealthRiskChart({
  data = defaultRiskData,
  title = "Health Risk Distribution",
  subtitle = "Overview of your health risk factors by category",
}: PremiumHealthRiskChartProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const [riskData, setRiskData] = useState<RiskCategory[]>(data)
  const [activeSlice, setActiveSlice] = useState<string | null>(null)
  const [legendCollapsed, setLegendCollapsed] = useState(false)
  const [focusedSliceIndex, setFocusedSliceIndex] = useState<number | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  // Set mounted to true on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate total for percentages
  const total = useMemo(() => riskData.reduce((sum, item) => sum + item.risk, 0), [riskData])

  // Calculate average risk
  const averageRisk = useMemo(() => Math.round(total / riskData.length), [total, riskData])

  // Find the highest risk category for annotation
  const highestRiskCategory = useMemo(() => [...riskData].sort((a, b) => b.risk - a.risk)[0], [riskData])

  // Calculate pie chart segments
  const segments = useMemo(() => {
    let startAngle = 0
    return riskData.map((item) => {
      const percentage = (item.risk / total) * 100
      const angle = (percentage / 100) * 360
      const endAngle = startAngle + angle

      // Calculate coordinates for the path
      const startRad = (startAngle - 90) * (Math.PI / 180)
      const endRad = (endAngle - 90) * (Math.PI / 180)

      const x1 = 50 + 40 * Math.cos(startRad)
      const y1 = 50 + 40 * Math.sin(startRad)
      const x2 = 50 + 40 * Math.cos(endRad)
      const y2 = 50 + 40 * Math.sin(endRad)

      // Determine if the arc should be drawn as a large arc
      const largeArcFlag = angle > 180 ? 1 : 0

      // Create the path data
      const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

      // Calculate label position (middle of the arc)
      const midAngle = startAngle + angle / 2
      const midRad = (midAngle - 90) * (Math.PI / 180)
      const labelX = 50 + 30 * Math.cos(midRad)
      const labelY = 50 + 30 * Math.sin(midRad)

      // Calculate annotation position for highest risk
      const annotationX = 50 + 55 * Math.cos(midRad)
      const annotationY = 50 + 55 * Math.sin(midRad)

      // Calculate percentage change
      const percentageChange = item.previousRisk > 0 ? ((item.risk - item.previousRisk) / item.previousRisk) * 100 : 0

      const segment = {
        id: item.id,
        category: item.category,
        risk: item.risk,
        percentage,
        percentageChange,
        color: item.color,
        icon: item.icon,
        pathData,
        startAngle,
        endAngle,
        labelX,
        labelY,
        annotationX,
        annotationY,
        hasSignificantChange: Math.abs(percentageChange) > 5,
      }

      startAngle = endAngle
      return segment
    })
  }, [riskData, total])

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (focusedSliceIndex === null && riskData.length > 0) {
      setFocusedSliceIndex(0)
      return
    }

    if (focusedSliceIndex !== null) {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault()
          setFocusedSliceIndex((focusedSliceIndex + 1) % riskData.length)
          break
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          setFocusedSliceIndex((focusedSliceIndex - 1 + riskData.length) % riskData.length)
          break
        case "Enter":
        case " ":
          e.preventDefault()
          setActiveSlice(riskData[focusedSliceIndex].id)
          break
        default:
          break
      }
    }
  }

  // Update active slice when focused slice changes
  useEffect(() => {
    if (focusedSliceIndex !== null) {
      setActiveSlice(riskData[focusedSliceIndex].id)
    }
  }, [focusedSliceIndex, riskData])

  // Format date for the timestamp
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get risk level based on score
  const getRiskLevel = (score: number) => {
    if (score < 25) return { label: "Low Risk", color: "text-green-600 dark:text-green-400" }
    if (score < 50) return { label: "Moderate Risk", color: "text-amber-600 dark:text-amber-400" }
    if (score < 75) return { label: "High Risk", color: "text-red-600 dark:text-red-400" }
    return { label: "Very High Risk", color: "text-red-700 dark:text-red-300" }
  }

  // If not mounted yet, don't render to avoid hydration mismatch
  if (!mounted) return null

  // Determine if we're in dark mode
  const isDarkMode = theme === "dark"

  return (
    <div
      className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg transition-colors duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950"
      ref={chartRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Health Risk Distribution Chart"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-primary-50 dark:bg-primary-950/30 border-b border-primary-100 dark:border-primary-900/30">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</div>
      </div>

      {/* Main content area with chart and legend */}
      <div className="flex flex-col md:flex-row p-6">
        {/* Chart area */}
        <div className="relative flex-1 aspect-square max-w-md mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" aria-hidden="true">
            {/* Pie segments */}
            {segments.map((segment, index) => {
              const isActive = activeSlice === segment.id || focusedSliceIndex === index

              return (
                <motion.path
                  key={segment.id}
                  d={segment.pathData}
                  fill={segment.color}
                  stroke={isDarkMode ? "#1f2937" : "white"}
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.8, transformOrigin: "50% 50%" }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.05 : 1,
                    transformOrigin: "50% 50%",
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                  }}
                  onMouseEnter={() => setActiveSlice(segment.id)}
                  onMouseLeave={() => setActiveSlice(null)}
                  className="filter drop-shadow-md cursor-pointer transition-all duration-200 will-change-transform"
                  aria-label={`${segment.category}: ${segment.risk}% risk`}
                  role="button"
                  tabIndex={-1}
                />
              )
            })}

            {/* Center circle for better aesthetics */}
            <circle
              cx="50"
              cy="50"
              r="15"
              fill={isDarkMode ? "#1f2937" : "white"}
              stroke={isDarkMode ? "#374151" : "#E2E8F0"}
              strokeWidth="1"
              className="filter drop-shadow-sm"
            />

            {/* Center text showing average risk */}
            <text
              x="50"
              y="48"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isDarkMode ? "#e5e7eb" : "#1E293B"}
              fontSize="6"
              fontWeight="bold"
              className="select-none"
            >
              {averageRisk}%
            </text>
            <text
              x="50"
              y="54"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isDarkMode ? "#9ca3af" : "#64748B"}
              fontSize="3"
              className="select-none"
            >
              Overall Risk
            </text>

            {/* Annotation for highest risk category */}
            {segments.map((segment) => {
              if (segment.category === highestRiskCategory.category) {
                return (
                  <g key={`annotation-${segment.id}`}>
                    <line
                      x1={segment.labelX}
                      y1={segment.labelY}
                      x2={segment.annotationX}
                      y2={segment.annotationY}
                      stroke={isDarkMode ? "#6b7280" : "#94A3B8"}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    <circle
                      cx={segment.annotationX}
                      cy={segment.annotationY}
                      r="1.5"
                      fill={isDarkMode ? "#6b7280" : "#94A3B8"}
                    />
                    <text
                      x={segment.annotationX + (segment.annotationX > 50 ? 3 : -3)}
                      y={segment.annotationY}
                      fill={isDarkMode ? "#9ca3af" : "#64748B"}
                      fontSize="3"
                      textAnchor={segment.annotationX > 50 ? "start" : "end"}
                      dominantBaseline="middle"
                      className="font-medium"
                    >
                      Highest risk factor
                    </text>
                  </g>
                )
              }
              return null
            })}
          </svg>
        </div>

        {/* Legend */}
        <div
          className={`mt-6 md:mt-0 md:ml-6 md:w-64 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 transition-all duration-300 ${
            legendCollapsed ? "md:w-12" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-medium text-gray-800 dark:text-gray-200 ${legendCollapsed ? "hidden md:hidden" : ""}`}>
              Risk Categories
            </h3>
            <button
              onClick={() => setLegendCollapsed(!legendCollapsed)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label={legendCollapsed ? "Expand legend" : "Collapse legend"}
            >
              {legendCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {!legendCollapsed && (
            <div className="space-y-3">
              {segments.map((segment, index) => {
                const riskLevel = getRiskLevel(segment.risk)

                return (
                  <motion.div
                    key={segment.id}
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      activeSlice === segment.id
                        ? "bg-gray-100 dark:bg-gray-700/50"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onMouseEnter={() => setActiveSlice(segment.id)}
                    onMouseLeave={() => setActiveSlice(null)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={activeSlice === segment.id}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setActiveSlice(segment.id)
                      }
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-sm mr-3 flex items-center justify-center text-white"
                      style={{ backgroundColor: segment.color }}
                    >
                      {segment.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">{segment.category}</div>
                      <div className={`text-xs ${riskLevel.color}`}>{riskLevel.label}</div>
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">{segment.risk}%</div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-primary-50 dark:bg-primary-950/30 border-t border-primary-100 dark:border-primary-900/30 flex justify-between items-center">
        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
          <Info size={12} className="mr-1" />
          Assessment based on your self-reported data
        </div>
        <button
          className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center"
          onClick={() => {}}
        >
          View detailed analysis
          <ChevronRight size={12} className="ml-1" />
        </button>
      </div>

      {/* Footnote */}
      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-500 italic">
        Risk scores are calculated using validated health assessment algorithms.
      </div>
    </div>
  )
}
