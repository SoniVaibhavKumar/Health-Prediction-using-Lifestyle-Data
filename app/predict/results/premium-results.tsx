"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Heart,
  Brain,
  Moon,
  Shield,
  Pill,
  AlertCircle,
  Utensils,
  Clock,
  Sun,
  Users,
  Thermometer,
  Droplets,
  Dumbbell,
  Download,
  Share2,
} from "lucide-react"
import { motion } from "framer-motion"
import PremiumHealthRiskChart from "@/components/premium-health-risk-chart"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Add imports for the new components at the top of the file
import AnxietyTrendChart from "@/components/anxiety-trend-chart"
import AnxietyTriggersChart from "@/components/anxiety-triggers-chart"
import AnxietyCopingStrategies from "@/components/anxiety-coping-strategies"

// Define risk category type
interface RiskCategory {
  id: string
  category: string
  risk: number
  previousRisk: number
  color: string
  icon: React.ReactNode
  factors: {
    name: string
    impact: string
    suggestion: string
  }[]
}

export default function PremiumResultsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [savingReport, setSavingReport] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Parse user data from URL parameters
  const userData = useMemo(() => {
    const dataParam = searchParams.get("data")
    if (!dataParam) return null
    try {
      const parsed = JSON.parse(decodeURIComponent(dataParam))
      // Ensure we have a valid object with default values
      return {
        age: parsed?.age || "30",
        gender: parsed?.gender || "male",
        weight: parsed?.weight || "70",
        height: parsed?.height || "170",
        exerciseFrequency: parsed?.exerciseFrequency || "rarely",
        sleepHours: parsed?.sleepHours || "7",
        sleepQuality: parsed?.sleepQuality || "good",
        dietType: parsed?.dietType || "omnivore",
        stressLevel: parsed?.stressLevel || "5",
        anxietyLevel: parsed?.anxietyLevel || "5",
        smokingStatus: parsed?.smokingStatus || "never",
        alcoholConsumption: parsed?.alcoholConsumption || "rarely",
        bloodPressure: parsed?.bloodPressure || "normal",
        cholesterolLevels: parsed?.cholesterolLevels || "normal",
        bloodSugarLevel: parsed?.bloodSugarLevel || "70-100",
        familyHistory: parsed?.familyHistory || [],
        existingConditions: parsed?.existingConditions || [],
        anxietyTriggers: parsed?.anxietyTriggers || [],
        vaccinationStatus: parsed?.vaccinationStatus || "fully-vaccinated",
        lastCheckup: parsed?.lastCheckup || "6-12-months",
        fastFoodFrequency: parsed?.fastFoodFrequency || "rarely",
        screenTime: parsed?.screenTime || "4-6",
        outdoorTime: parsed?.outdoorTime || "1-2hours",
        waterIntake: parsed?.waterIntake || "2-3L",
        ...parsed,
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  }, [searchParams])

  // Generate risk data based on user input
  const riskData: RiskCategory[] = useMemo(() => {
    if (!userData) {
      return [] // Return empty array if no user data
    }

    // Calculate BMI with safe parsing
    const weight = Number.parseFloat(userData.weight) || 70
    const height = Number.parseFloat(userData.height) || 170
    const bmi = weight / (height / 100) ** 2

    // Calculate cardiovascular risk based on user inputs
    const cardiovascularRisk = calculateCardiovascularRisk(userData, bmi)

    // Calculate metabolic risk based on user inputs
    const metabolicRisk = calculateMetabolicRisk(userData, bmi)

    // Calculate sleep risk based on user inputs
    const sleepRisk = calculateSleepRisk(userData)

    // Calculate mental risk based on user inputs
    const mentalRisk = calculateMentalRisk(userData)

    // Calculate immune risk based on user inputs
    const immuneRisk = calculateImmuneRisk(userData)

    // Calculate chronic disease risk based on user inputs
    const chronicRisk = calculateChronicRisk(userData, bmi)

    return [
      {
        id: "cardiovascular",
        category: "Cardiovascular",
        risk: cardiovascularRisk.risk,
        previousRisk: cardiovascularRisk.risk + 4, // Mock previous risk for demonstration
        color: "#e11d48", // rose-600
        icon: <Heart className="h-4 w-4" />,
        factors: cardiovascularRisk.factors,
      },
      {
        id: "metabolic",
        category: "Metabolic",
        risk: metabolicRisk.risk,
        previousRisk: metabolicRisk.risk + 3, // Mock previous risk for demonstration
        color: "#0891b2", // cyan-600
        icon: <Activity className="h-4 w-4" />,
        factors: metabolicRisk.factors,
      },
      {
        id: "sleep",
        category: "Sleep",
        risk: sleepRisk.risk,
        previousRisk: sleepRisk.risk + 3, // Mock previous risk for demonstration
        color: "#7c3aed", // violet-600
        icon: <Moon className="h-4 w-4" />,
        factors: sleepRisk.factors,
      },
      {
        id: "mental",
        category: "Mental",
        risk: mentalRisk.risk,
        previousRisk: mentalRisk.risk + 3, // Mock previous risk for demonstration
        color: "#8b5cf6", // violet-500
        icon: <Brain className="h-4 w-4" />,
        factors: mentalRisk.factors,
      },
      {
        id: "immune",
        category: "Immune",
        risk: immuneRisk.risk,
        previousRisk: immuneRisk.risk - 2, // Mock previous risk for demonstration
        color: "#16a34a", // green-600
        icon: <Shield className="h-4 w-4" />,
        factors: immuneRisk.factors,
      },
      {
        id: "chronic",
        category: "Chronic",
        risk: chronicRisk.risk,
        previousRisk: chronicRisk.risk - 2, // Mock previous risk for demonstration
        color: "#ea580c", // orange-600
        icon: <Pill className="h-4 w-4" />,
        factors: chronicRisk.factors,
      },
    ]
  }, [userData])

  // Get risk level based on score
  const getRiskLevel = (score: number) => {
    if (score < 25)
      return { label: "Low Risk", color: "text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30" }
    if (score < 50)
      return { label: "Moderate Risk", color: "text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30" }
    if (score < 75) return { label: "High Risk", color: "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30" }
    return { label: "Very High Risk", color: "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/40" }
  }

  // Get icon for factor
  const getIconForFactor = (factor: string) => {
    const factorLower = factor.toLowerCase()
    if (factorLower.includes("exercise") || factorLower.includes("physical") || factorLower.includes("activity"))
      return <Dumbbell className="h-4 w-4 text-blue-500 dark:text-blue-400" />
    if (
      factorLower.includes("diet") ||
      factorLower.includes("food") ||
      factorLower.includes("eating") ||
      factorLower.includes("nutrition")
    )
      return <Utensils className="h-4 w-4 text-green-500 dark:text-green-400" />
    if (factorLower.includes("sleep")) return <Moon className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
    if (factorLower.includes("stress") || factorLower.includes("mental") || factorLower.includes("mindful"))
      return <Brain className="h-4 w-4 text-purple-500 dark:text-purple-400" />
    if (factorLower.includes("screen")) return <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
    if (factorLower.includes("outdoor")) return <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
    if (factorLower.includes("social") || factorLower.includes("connection"))
      return <Users className="h-4 w-4 text-pink-500 dark:text-pink-400" />
    if (factorLower.includes("weight") || factorLower.includes("bmi"))
      return <Activity className="h-4 w-4 text-blue-500 dark:text-blue-400" />
    if (factorLower.includes("smoking") || factorLower.includes("alcohol"))
      return <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
    if (factorLower.includes("water") || factorLower.includes("hydration"))
      return <Droplets className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
    if (factorLower.includes("medical") || factorLower.includes("checkup") || factorLower.includes("vaccination"))
      return <Thermometer className="h-4 w-4 text-red-500 dark:text-red-400" />
    if (factorLower.includes("pain")) return <Thermometer className="h-4 w-4 text-red-500 dark:text-red-400" />
    if (factorLower.includes("family")) return <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />

    return <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
  }

  // Calculate overall risk with safety check
  const overallRisk =
    riskData.length > 0 ? Math.round(riskData.reduce((sum, item) => sum + item.risk, 0) / riskData.length) : 25
  const overallRiskLevel = getRiskLevel(overallRisk)

  // Mock function for downloading report
  const downloadReport = async () => {
    setSavingReport(true)
    setDownloadError(null)

    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a simple text report
      const reportContent =
        `Health Prediction Report\n\nOverall Risk: ${overallRisk}%\n\n` +
        riskData
          .map(
            (category) =>
              `${category.category} Risk: ${category.risk}%\n` +
              category.factors.map((factor) => `- ${factor.name}: ${factor.suggestion}`).join("\n"),
          )
          .join("\n\n")

      // Create a blob and download it
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "health-prediction-report.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      setDownloadError("Download failed. Please try again.")
    } finally {
      setSavingReport(false)
    }
  }

  // Mock function for sharing results
  const shareResults = async () => {
    setShareError(null)

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Health Prediction Results",
          text: `My overall health risk is ${overallRisk}%. Check out my detailed health prediction results.`,
          url: window.location.href,
        })
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href)
        alert("Share link copied to clipboard!")
      }
    } catch (error) {
      console.error("Share error:", error)
      setShareError("Unable to share results. Please try again.")
    }
  }

  // Show loading state if no data
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find your health prediction data. Please complete the questionnaire first.
            </p>
            <Button onClick={() => router.push("/predict")} className="w-full">
              Take Questionnaire
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Health Prediction Results</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Based on your information, we've analyzed your health risks and identified key factors affecting your
            wellbeing.
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 bg-muted p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="detailed"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-primary-foreground"
            >
              Detailed Analysis
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-primary-foreground"
            >
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="space-y-8">
              {/* Health Score Overview Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overall Risk Summary Card */}
                <Card className="lg:col-span-2 border border-border shadow-lg overflow-hidden bg-gradient-to-br from-card to-muted/20">
                  <div className="h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                          <Activity className="h-6 w-6 text-primary-600" />
                          Overall Health Score
                        </CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">
                          Your comprehensive health assessment based on {riskData.length} key areas
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Risk Level</div>
                        <div className={`text-lg font-semibold px-3 py-1 rounded-full ${overallRiskLevel.color}`}>
                          {overallRiskLevel.label}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Enhanced Circular Progress */}
                      <div className="relative">
                        <div className="relative w-56 h-56">
                          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                            {/* Background circle */}
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              fill="none"
                              stroke="hsl(var(--muted))"
                              strokeWidth="8"
                              opacity="0.3"
                            />
                            {/* Progress circle */}
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              fill="none"
                              stroke={
                                overallRisk < 25
                                  ? "#16a34a"
                                  : overallRisk < 50
                                    ? "#f59e0b"
                                    : overallRisk < 75
                                      ? "#ef4444"
                                      : "#dc2626"
                              }
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${(100 - overallRisk) * 3.14} 314`}
                              className="transition-all duration-1000 ease-out"
                            />
                            {/* Inner decorative circles */}
                            <circle
                              cx="60"
                              cy="60"
                              r="35"
                              fill="none"
                              stroke="hsl(var(--border))"
                              strokeWidth="1"
                              opacity="0.2"
                            />
                            <circle
                              cx="60"
                              cy="60"
                              r="25"
                              fill="none"
                              stroke="hsl(var(--border))"
                              strokeWidth="1"
                              opacity="0.1"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-4xl font-bold text-foreground">{overallRisk}%</div>
                            <div className="text-sm text-muted-foreground">Health Risk</div>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                              Target: {Math.max(15, overallRisk - 20)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Risk Breakdown */}
                      <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Risk Categories Breakdown</h3>
                        {riskData.slice(0, 4).map((category, index) => (
                          <div key={category.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full" style={{ backgroundColor: category.color + "20" }}>
                                  <span style={{ color: category.color }}>{category.icon}</span>
                                </div>
                                <span className="text-sm font-medium text-foreground">{category.category}</span>
                              </div>
                              <span className="text-sm font-semibold text-foreground">{category.risk}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${category.risk}%`,
                                  backgroundColor: category.color,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats Card */}
                <Card className="border border-border shadow-lg overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Health Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* BMI Indicator */}
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-foreground">
                        {userData
                          ? Math.round(
                              (Number.parseFloat(userData.weight) || 70) /
                                (Number.parseFloat(userData.height) / 100 || 1.7) ** 2,
                            )
                          : 22}
                      </div>
                      <div className="text-sm text-muted-foreground">BMI Score</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {userData &&
                        (Number.parseFloat(userData.weight) || 70) /
                          (Number.parseFloat(userData.height) / 100 || 1.7) ** 2 <
                          25
                          ? "Normal Range"
                          : "Above Normal"}
                      </div>
                    </div>

                    {/* Risk Factors Count */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <div className="text-xl font-bold text-red-600">
                          {riskData.filter((r) => r.risk > 50).length}
                        </div>
                        <div className="text-xs text-red-600">High Risk Areas</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {riskData.filter((r) => r.risk < 30).length}
                        </div>
                        <div className="text-xs text-green-600">Low Risk Areas</div>
                      </div>
                    </div>

                    {/* Health Score Trend */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Health Improvement Potential</span>
                        <span className="font-medium text-foreground">{Math.max(15, overallRisk - 20)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(15, overallRisk - 20)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">Achievable in 6-12 months</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Health Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {riskData.map((category, index) => (
                  <Card
                    key={category.id}
                    className="border border-border shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-1" style={{ backgroundColor: category.color }}></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-full group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: category.color + "20" }}
                          >
                            <span style={{ color: category.color }}>{category.icon}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-foreground">{category.category}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                              {getRiskLevel(category.risk).label}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: category.color }}>
                            {category.risk}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {category.risk < category.previousRisk ? "↓" : "↑"}{" "}
                            {Math.abs(category.risk - category.previousRisk)}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Risk Level Bar */}
                      <div className="space-y-3">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${category.risk}%`,
                              backgroundColor: category.color,
                            }}
                          ></div>
                        </div>

                        {/* Top Risk Factor */}
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium text-foreground mb-1">Primary Factor</div>
                          <div className="text-xs text-muted-foreground">
                            {category.factors[0]?.name || "Overall lifestyle factors"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Premium Health Risk Chart */}
              <Card className="border border-border shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary-600" />
                    Comprehensive Risk Analysis
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Interactive visualization of your health risk factors across all categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PremiumHealthRiskChart data={riskData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="mt-0">
            <div className="grid grid-cols-1 gap-8">
              {riskData.map((category) => (
                <Card key={category.id} className="border border-border shadow-md overflow-hidden">
                  <div className="h-1" style={{ backgroundColor: category.color }}></div>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span
                        className="p-2 rounded-full text-white dark:text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </span>
                      <CardTitle className="text-foreground">{category.category} Health</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {getRiskLevel(category.risk).label} ({category.risk}%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium text-lg mb-4 text-foreground">Key Factors</h4>
                    <div className="space-y-4">
                      {category.factors.map((factor, index) => (
                        <motion.div
                          key={index}
                          className="bg-muted p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-start">
                            <div className="mt-0.5">{getIconForFactor(factor.name)}</div>
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h5 className="font-medium text-foreground">{factor.name}</h5>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    factor.impact.includes("positive")
                                      ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                                      : factor.impact.includes("negative")
                                        ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                                  }`}
                                >
                                  {factor.impact}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{factor.suggestion}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* Anxiety Trend Chart */}
              {userData && userData.anxietyLevel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <AnxietyTrendChart
                    data={[
                      {
                        date: "1 week ago",
                        anxietyLevel: Math.min(10, Number(userData.anxietyLevel) + 1),
                        stressLevel: Math.min(10, Number(userData.stressLevel) + 2),
                      },
                      {
                        date: "5 days ago",
                        anxietyLevel: Math.min(10, Number(userData.anxietyLevel) + 2),
                        stressLevel: Math.min(10, Number(userData.stressLevel) + 1),
                      },
                      {
                        date: "3 days ago",
                        anxietyLevel: Math.min(10, Number(userData.anxietyLevel)),
                        stressLevel: Math.min(10, Number(userData.stressLevel)),
                      },
                      {
                        date: "Yesterday",
                        anxietyLevel: Math.min(10, Number(userData.anxietyLevel) - 1),
                        stressLevel: Math.min(10, Number(userData.stressLevel) - 1),
                      },
                      {
                        date: "Today",
                        anxietyLevel: Number(userData.anxietyLevel),
                        stressLevel: Number(userData.stressLevel),
                      },
                    ]}
                  />
                </motion.div>
              )}

              {/* Anxiety Triggers Chart */}
              {userData &&
                userData.anxietyTriggers &&
                Array.isArray(userData.anxietyTriggers) &&
                userData.anxietyTriggers.length > 0 &&
                !userData.anxietyTriggers.includes("none") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <AnxietyTriggersChart
                      data={userData.anxietyTriggers.map((trigger) => ({
                        trigger,
                        count: Math.floor(Math.random() * 5) + 1, // Mock data for visualization
                      }))}
                    />
                  </motion.div>
                )}

              {/* Anxiety Coping Strategies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <AnxietyCopingStrategies
                  strategies={[
                    {
                      name: "Mindfulness Meditation",
                      effectiveness: 85,
                      description: "Daily 10-minute sessions to reduce anxiety and improve focus",
                      icon: <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
                    },
                    {
                      name: "Deep Breathing Exercises",
                      effectiveness: 78,
                      description: "4-7-8 breathing technique to calm your nervous system",
                      icon: <Heart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
                    },
                    {
                      name: "Regular Physical Activity",
                      effectiveness: 82,
                      description: "30 minutes of moderate exercise 5 times per week",
                      icon: <Dumbbell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
                    },
                    {
                      name: "Consistent Sleep Schedule",
                      effectiveness: 75,
                      description: "Maintain regular sleep and wake times, even on weekends",
                      icon: <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
                    },
                    {
                      name: "Social Connection",
                      effectiveness: 70,
                      description: "Regular meaningful interactions with supportive people",
                      icon: <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
                    },
                  ]}
                />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-0">
            <Card className="border border-border shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
              <CardHeader>
                <CardTitle className="text-foreground">Personalized Recommendations</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Actionable steps to improve your health based on your assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Priority Actions Section */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 dark:bg-red-950/50 p-2 rounded-full mr-3">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-xl font-bold text-red-800 dark:text-red-300">Immediate Priority Actions</h3>
                      <span className="ml-auto bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Next 7 Days
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {riskData
                        .flatMap((category) =>
                          category.factors
                            .filter((f) => f.impact.includes("High negative"))
                            .map((factor) => ({
                              category: category.category,
                              factor: factor,
                              color: category.color,
                              icon: category.icon,
                            })),
                        )
                        .slice(0, 6)
                        .map((item, index) => (
                          <motion.div
                            key={`priority-${index}`}
                            className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-200 dark:border-red-800 shadow-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start mb-3">
                              <div className="p-2 rounded-full mr-3" style={{ backgroundColor: item.color + "20" }}>
                                <span style={{ color: item.color }}>{item.icon}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground text-sm">{item.factor.name}</h4>
                                <span className="text-xs text-muted-foreground">{item.category}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{item.factor.suggestion}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                                High Impact
                              </span>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />7 days
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* Medium-Term Goals Section */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center mb-4">
                      <div className="bg-amber-100 dark:bg-amber-950/50 p-2 rounded-full mr-3">
                        <Dumbbell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300">Medium-Term Improvements</h3>
                      <span className="ml-auto bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        30-90 Days
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {riskData
                        .flatMap((category) =>
                          category.factors
                            .filter((f) => f.impact.includes("Medium negative"))
                            .map((factor) => ({
                              category: category.category,
                              factor: factor,
                              color: category.color,
                              icon: category.icon,
                            })),
                        )
                        .slice(0, 4)
                        .map((item, index) => (
                          <motion.div
                            key={`medium-${index}`}
                            className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-amber-200 dark:border-amber-800 shadow-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 + 0.1 * index }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start mb-4">
                              <div className="p-2 rounded-full mr-3" style={{ backgroundColor: item.color + "20" }}>
                                <span style={{ color: item.color }}>{item.icon}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{item.factor.name}</h4>
                                <span className="text-sm text-muted-foreground">{item.category} Health</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{item.factor.suggestion}</p>

                            {/* Mini progress bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="text-amber-600 dark:text-amber-400 font-medium">
                                  {Math.floor(Math.random() * 30)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.floor(Math.random() * 30)}%` }}
                                ></div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* Long-Term Lifestyle Changes */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 dark:bg-green-950/50 p-2 rounded-full mr-3">
                        <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                        Long-Term Lifestyle Changes
                      </h3>
                      <span className="ml-auto bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        3-12 Months
                      </span>
                    </div>

                    {/* Lifestyle Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center mb-3">
                          <Utensils className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                          <h4 className="font-semibold text-foreground">Nutrition</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Increase fiber intake to 25-35g daily
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Reduce processed food by 50%
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Add 2 servings of fish weekly
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center mb-3">
                          <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                          <h4 className="font-semibold text-foreground">Exercise</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            150 min moderate cardio weekly
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>2 strength training sessions
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Daily 10-minute walks
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center mb-3">
                          <Brain className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                          <h4 className="font-semibold text-foreground">Mental Health</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Daily 10-minute meditation
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Weekly social activities
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Stress management techniques
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Health Metrics Improvement Chart */}
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        Expected Health Improvements Over Time
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            metric: "Cardiovascular",
                            current: overallRisk,
                            target: Math.max(overallRisk - 15, 10),
                            color: "#e11d48",
                          },
                          {
                            metric: "Metabolic",
                            current: overallRisk,
                            target: Math.max(overallRisk - 12, 15),
                            color: "#0891b2",
                          },
                          {
                            metric: "Sleep Quality",
                            current: overallRisk,
                            target: Math.max(overallRisk - 20, 10),
                            color: "#7c3aed",
                          },
                          {
                            metric: "Mental Health",
                            current: overallRisk,
                            target: Math.max(overallRisk - 18, 10),
                            color: "#8b5cf6",
                          },
                        ].map((item, index) => (
                          <div key={item.metric} className="text-center">
                            <div className="text-xs text-muted-foreground mb-2">{item.metric}</div>
                            <div className="relative w-16 h-16 mx-auto mb-2">
                              <svg viewBox="0 0 36 36" className="w-full h-full">
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke={item.color}
                                  strokeWidth="2"
                                  strokeDasharray={`${100 - item.target}, 100`}
                                  className="transition-all duration-1000"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-semibold" style={{ color: item.color }}>
                                  {item.target}%
                                </span>
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">From </span>
                              <span className="font-medium">{item.current}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Plan Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 dark:bg-blue-950/50 p-2 rounded-full mr-3">
                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">
                        Your Personalized Action Plan
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {riskData.filter((r) => r.risk > 50).length}
                        </div>
                        <div className="text-sm text-muted-foreground">High Priority Areas</div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {Math.max(15, overallRisk - 20)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Target Risk Reduction</div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">6-12</div>
                        <div className="text-sm text-muted-foreground">Months to See Results</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={downloadReport}
              disabled={savingReport}
              className="bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-700 dark:hover:bg-primary-600 flex items-center gap-2"
            >
              <Download size={16} />
              {savingReport ? "Generating PDF..." : "Download Report"}
            </Button>
            <Button
              onClick={shareResults}
              variant="outline"
              className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-950/50 flex items-center gap-2"
            >
              <Share2 size={16} />
              Share Results
            </Button>
          </div>

          {downloadError && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{downloadError}</AlertDescription>
            </Alert>
          )}

          {shareError && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{shareError}</AlertDescription>
            </Alert>
          )}
        </motion.div>

        <motion.p
          className="text-center text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          This health prediction is based on self-reported data and should not replace professional medical advice.
          <br />
          Please consult with a healthcare provider for any health concerns.
        </motion.p>
      </div>
    </div>
  )
}

// Risk calculation functions with safe property access
function calculateCardiovascularRisk(userData: any, bmi: number) {
  let risk = 0
  const factors = []

  // Age factor with safe parsing
  if (userData?.age) {
    const age = Number.parseInt(userData.age) || 30
    const ageRisk = Math.min(Math.max(age - 30, 0) * 0.5, 30)
    risk += ageRisk
    if (age > 50) {
      factors.push({
        name: "Age",
        impact: "Medium negative impact",
        suggestion: "Regular cardiovascular checkups are recommended for your age group",
      })
    }
  }

  // BMI factor
  if (bmi && !isNaN(bmi)) {
    if (bmi < 18.5) {
      risk += 10
      factors.push({
        name: "Weight",
        impact: "Medium negative impact",
        suggestion: "Being underweight may affect heart health. Consider a nutrition plan to reach a healthy weight.",
      })
    } else if (bmi >= 25 && bmi < 30) {
      risk += 15
      factors.push({
        name: "Weight",
        impact: "Medium negative impact",
        suggestion: "Being overweight increases cardiovascular risk. Aim for a 5-10% weight reduction.",
      })
    } else if (bmi >= 30) {
      risk += 25
      factors.push({
        name: "Weight",
        impact: "High negative impact",
        suggestion:
          "Obesity significantly increases cardiovascular risk. Consult a healthcare provider about weight management.",
      })
    }
  }

  // Exercise factor
  if (userData?.exerciseFrequency) {
    if (userData.exerciseFrequency === "rarely" || userData.exerciseFrequency === "never") {
      risk += 20
      factors.push({
        name: "Exercise",
        impact: "High negative impact",
        suggestion: "Aim for at least 150 minutes of moderate aerobic activity weekly",
      })
    } else if (userData.exerciseFrequency === "once-week") {
      risk += 15
      factors.push({
        name: "Exercise",
        impact: "Medium negative impact",
        suggestion: "Consider increasing your exercise frequency to 3-4 times per week",
      })
    } else if (userData.exerciseFrequency === "2-3-times-week") {
      risk += 5
      factors.push({
        name: "Exercise",
        impact: "Low negative impact",
        suggestion: "Consider adding more variety to your exercise routine",
      })
    } else {
      factors.push({
        name: "Exercise",
        impact: "High positive impact",
        suggestion: "Continue your regular exercise routine",
      })
    }
  }

  // Blood pressure factor
  if (userData?.bloodPressure) {
    if (userData.bloodPressure === "stage1" || userData.bloodPressure === "stage2") {
      risk += 25
      factors.push({
        name: "Blood Pressure",
        impact: "High negative impact",
        suggestion: "Consult with a healthcare provider about managing your blood pressure",
      })
    } else if (userData.bloodPressure === "elevated") {
      risk += 15
      factors.push({
        name: "Blood Pressure",
        impact: "Medium negative impact",
        suggestion: "Monitor your blood pressure regularly and consider dietary changes",
      })
    } else if (userData.bloodPressure === "normal") {
      factors.push({
        name: "Blood Pressure",
        impact: "High positive impact",
        suggestion: "Continue maintaining healthy blood pressure levels",
      })
    }
  }

  // Smoking factor
  if (userData?.smokingStatus) {
    if (userData.smokingStatus === "regular") {
      risk += 30
      factors.push({
        name: "Smoking",
        impact: "High negative impact",
        suggestion: "Quitting smoking is the single most important step for heart health",
      })
    } else if (userData.smokingStatus === "occasional") {
      risk += 15
      factors.push({
        name: "Smoking",
        impact: "Medium negative impact",
        suggestion: "Even occasional smoking increases cardiovascular risk. Consider quitting completely.",
      })
    } else if (userData.smokingStatus === "former") {
      risk += 5
      factors.push({
        name: "Smoking History",
        impact: "Low negative impact",
        suggestion: "Your risk decreases the longer you stay smoke-free",
      })
    }
  }

  // Family history factor
  if (userData?.familyHistory && Array.isArray(userData.familyHistory)) {
    if (
      userData.familyHistory.includes("heart-disease") ||
      userData.familyHistory.includes("hypertension") ||
      userData.familyHistory.includes("stroke")
    ) {
      risk += 15
      factors.push({
        name: "Family History",
        impact: "Medium negative impact",
        suggestion: "Given your family history, regular cardiovascular checkups are recommended",
      })
    }
  }

  // Diet factor
  if (userData?.dietType) {
    if (userData.dietType === "mediterranean") {
      risk -= 10
      factors.push({
        name: "Diet",
        impact: "High positive impact",
        suggestion: "The Mediterranean diet is excellent for heart health",
      })
    } else if (userData.fastFoodFrequency === "daily" || userData.fastFoodFrequency === "several-times-week") {
      risk += 15
      factors.push({
        name: "Diet",
        impact: "Medium negative impact",
        suggestion: "Reducing fast food consumption can improve heart health",
      })
    }
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Sleep",
      impact: "Medium negative impact",
      suggestion: "Poor sleep quality can affect heart health. Aim for 7-8 hours of quality sleep.",
    })
  }

  // Cap risk between 10 and 85
  risk = Math.max(10, Math.min(85, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateMetabolicRisk(userData: any, bmi: number) {
  let risk = 0
  const factors = []

  // BMI factor
  if (bmi && !isNaN(bmi)) {
    if (bmi >= 30) {
      risk += 30
      factors.push({
        name: "Weight",
        impact: "High negative impact",
        suggestion: "Obesity significantly increases metabolic risk. A 5-10% weight reduction would be beneficial.",
      })
    } else if (bmi >= 25) {
      risk += 20
      factors.push({
        name: "Weight",
        impact: "Medium negative impact",
        suggestion: "Being overweight increases metabolic risk. Consider a balanced diet and regular exercise.",
      })
    } else if (bmi < 18.5) {
      risk += 10
      factors.push({
        name: "Weight",
        impact: "Low negative impact",
        suggestion:
          "Being underweight may affect metabolic health. Consider a nutrition plan to reach a healthy weight.",
      })
    }
  }

  // Diet factor
  if (userData?.dietType) {
    if (userData.dietType === "vegetarian" || userData.dietType === "vegan") {
      risk -= 10
      factors.push({
        name: "Diet",
        impact: "High positive impact",
        suggestion: "Your diet choice is beneficial for metabolic health",
      })
    } else if (userData.fastFoodFrequency === "daily" || userData.fastFoodFrequency === "several-times-week") {
      risk += 20
      factors.push({
        name: "Diet",
        impact: "Medium negative impact",
        suggestion: "Reduce processed carbohydrates and fast food consumption",
      })
    }
  }

  // Exercise factor
  if (userData?.exerciseFrequency) {
    if (userData.exerciseFrequency === "never") {
      risk += 25
      factors.push({
        name: "Exercise",
        impact: "High negative impact",
        suggestion: "Regular physical activity is essential for metabolic health. Start with short daily walks.",
      })
    } else if (userData.exerciseFrequency === "rarely") {
      risk += 15
      factors.push({
        name: "Exercise",
        impact: "Medium negative impact",
        suggestion: "Increase your physical activity to at least 150 minutes per week",
      })
    } else if (userData.exerciseFrequency === "once-week") {
      risk += 10
      factors.push({
        name: "Exercise",
        impact: "Medium negative impact",
        suggestion: "Increase exercise frequency to at least 3 times per week",
      })
    } else if (userData.exerciseFrequency === "2-3-times-week") {
      risk += 5
      factors.push({
        name: "Exercise",
        impact: "Low negative impact",
        suggestion: "Add 2 more days of strength training to your routine",
      })
    } else {
      factors.push({
        name: "Exercise",
        impact: "Medium positive impact",
        suggestion: "Your activity level benefits your metabolic health",
      })
    }
  }

  // Water intake
  if (userData?.waterIntake) {
    if (userData.waterIntake === "less-than-1L") {
      risk += 10
      factors.push({
        name: "Hydration",
        impact: "Medium negative impact",
        suggestion: "Increase water intake to at least 8 glasses daily",
      })
    } else {
      factors.push({
        name: "Hydration",
        impact: "Medium positive impact",
        suggestion: "Continue with good hydration habits",
      })
    }
  }

  // Family history
  if (userData?.familyHistory && Array.isArray(userData.familyHistory) && userData.familyHistory.includes("diabetes")) {
    risk += 15
    factors.push({
      name: "Family History",
      impact: "Medium negative impact",
      suggestion: "With your family history of diabetes, regular metabolic screenings are important",
    })
  }

  // Existing conditions
  if (
    userData?.existingConditions &&
    Array.isArray(userData.existingConditions) &&
    userData.existingConditions.includes("diabetes")
  ) {
    risk += 30
    factors.push({
      name: "Diabetes",
      impact: "High negative impact",
      suggestion: "Continue following your diabetes management plan and regular check-ups",
    })
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Fast Food",
      impact: "Medium negative impact",
      suggestion: "Try to limit fast food to once per week",
    })
  }

  // Cap risk between 15 and 85
  risk = Math.max(15, Math.min(85, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateSleepRisk(userData: any) {
  let risk = 0
  const factors = []

  // Sleep hours
  if (userData?.sleepHours) {
    const sleepHours = Number.parseFloat(userData.sleepHours) || 7
    if (sleepHours < 6) {
      risk += 30
      factors.push({
        name: "Sleep Duration",
        impact: "High negative impact",
        suggestion: `Aim for 7-8 hours of sleep instead of your current ${sleepHours} hours`,
      })
    } else if (sleepHours > 9) {
      risk += 15
      factors.push({
        name: "Sleep Duration",
        impact: "Medium negative impact",
        suggestion: "Excessive sleep can affect quality. Aim for 7-8 hours of quality sleep.",
      })
    } else if (sleepHours >= 7 && sleepHours <= 8) {
      factors.push({
        name: "Sleep Duration",
        impact: "High positive impact",
        suggestion: "Your sleep duration is optimal",
      })
    }
  }

  // Sleep quality
  if (userData?.sleepQuality) {
    if (userData.sleepQuality === "poor" || userData.sleepQuality === "very-poor") {
      risk += 25
      factors.push({
        name: "Sleep Quality",
        impact: "High negative impact",
        suggestion: "Create a dark, quiet, and cool sleeping environment",
      })
    } else if (userData.sleepQuality === "fair") {
      risk += 15
      factors.push({
        name: "Sleep Quality",
        impact: "Medium negative impact",
        suggestion: "Establish a consistent pre-sleep routine to improve sleep quality",
      })
    } else if (userData.sleepQuality === "excellent" || userData.sleepQuality === "good") {
      factors.push({
        name: "Sleep Quality",
        impact: "High positive impact",
        suggestion: "Continue maintaining your good sleep environment",
      })
    }
  }

  // Screen time
  if (userData?.screenTime) {
    if (userData.screenTime === "more-than-9" || userData.screenTime === "7-9") {
      risk += 20
      factors.push({
        name: "Screen Time",
        impact: "High negative impact",
        suggestion: "Avoid screens 1-2 hours before bedtime",
      })
    } else if (userData.screenTime === "4-6") {
      risk += 10
      factors.push({
        name: "Screen Time",
        impact: "Medium negative impact",
        suggestion: "Try to reduce screen time, especially before bed",
      })
    }
  }

  // Stress level
  if (userData?.stressLevel) {
    const stressLevel = Number.parseInt(userData.stressLevel) || 5
    if (stressLevel >= 7) {
      risk += 20
      factors.push({
        name: "Stress",
        impact: "Medium negative impact",
        suggestion: "Try meditation or deep breathing before sleep",
      })
    } else if (stressLevel >= 5) {
      risk += 10
      factors.push({
        name: "Stress",
        impact: "Low negative impact",
        suggestion: "Consider relaxation techniques to improve sleep",
      })
    }
  }

  // Alcohol consumption
  if (userData?.alcoholConsumption) {
    if (userData.alcoholConsumption === "daily" || userData.alcoholConsumption === "weekly") {
      risk += 15
      factors.push({
        name: "Alcohol Consumption",
        impact: "Medium negative impact",
        suggestion: "Alcohol disrupts sleep quality. Try to avoid alcohol close to bedtime.",
      })
    }
  }

  // Exercise timing
  if (userData?.exerciseFrequency && userData.exerciseFrequency !== "never") {
    factors.push({
      name: "Exercise Timing",
      impact: "Low negative impact",
      suggestion: "Avoid intense exercise 3 hours before bed",
    })
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Sleep Consistency",
      impact: "Medium negative impact",
      suggestion: "Try to go to bed at the same time each night",
    })
  }

  // Cap risk between 15 and 80
  risk = Math.max(15, Math.min(80, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateMentalRisk(userData: any) {
  let risk = 0
  const factors = []

  // Stress level
  if (userData?.stressLevel) {
    const stressLevel = Number.parseInt(userData.stressLevel) || 5
    if (stressLevel >= 8) {
      risk += 30
      factors.push({
        name: "Stress Management",
        impact: "High negative impact",
        suggestion: "Your stress levels are high. Consider professional support and stress reduction techniques.",
      })
    } else if (stressLevel >= 6) {
      risk += 20
      factors.push({
        name: "Stress Management",
        impact: "Medium negative impact",
        suggestion: "Consider adding mindfulness practice to manage stress",
      })
    } else if (stressLevel <= 3) {
      factors.push({
        name: "Stress Management",
        impact: "High positive impact",
        suggestion: "Continue your effective stress management techniques",
      })
    }
  }

  // Sleep quality
  if (userData?.sleepQuality) {
    if (userData.sleepQuality === "poor" || userData.sleepQuality === "fair") {
      risk += 20
      factors.push({
        name: "Sleep",
        impact: "Medium negative impact",
        suggestion: "Improve sleep quality with a consistent schedule",
      })
    }
  } else if (userData?.sleepHours) {
    const sleepHours = Number.parseFloat(userData.sleepHours) || 7
    if (sleepHours < 6) {
      risk += 20
      factors.push({
        name: "Sleep",
        impact: "Medium negative impact",
        suggestion: "Poor sleep affects mental health. Aim for 7-8 hours nightly.",
      })
    }
  }

  // Exercise
  if (userData?.exerciseFrequency) {
    if (userData.exerciseFrequency === "never" || userData.exerciseFrequency === "rarely") {
      risk += 15
      factors.push({
        name: "Physical Activity",
        impact: "Medium negative impact",
        suggestion: "Regular exercise can significantly improve mood and reduce anxiety",
      })
    } else if (userData.exerciseFrequency === "daily" || userData.exerciseFrequency === "4-6-times-week") {
      risk -= 15
      factors.push({
        name: "Physical Activity",
        impact: "High positive impact",
        suggestion: "Exercise is benefiting your mental health",
      })
    }
  }

  // Outdoor time
  if (userData?.outdoorTime) {
    if (userData.outdoorTime === "less-than-30min") {
      risk += 15
      factors.push({
        name: "Outdoor Time",
        impact: "Medium negative impact",
        suggestion: "Spending time in nature can improve mental wellbeing",
      })
    } else if (userData.outdoorTime === "more-than-4hours" || userData.outdoorTime === "2-4hours") {
      risk -= 10
      factors.push({
        name: "Outdoor Time",
        impact: "Medium positive impact",
        suggestion: "Your time outdoors benefits your mental health",
      })
    }
  }

  // Family history
  if (
    userData?.familyHistory &&
    Array.isArray(userData.familyHistory) &&
    userData.familyHistory.includes("mental-health")
  ) {
    risk += 15
    factors.push({
      name: "Family History",
      impact: "Medium negative impact",
      suggestion: "With your family history, be proactive about mental health care",
    })
  }

  // Existing conditions
  if (userData?.existingConditions && Array.isArray(userData.existingConditions)) {
    if (userData.existingConditions.includes("mental-health")) {
      risk += 25
      factors.push({
        name: "Mental Health Condition",
        impact: "High negative impact",
        suggestion: "Continue with your treatment plan and regular check-ins with healthcare providers",
      })
    }
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Mindfulness",
      impact: "Medium positive impact",
      suggestion: "Regular mindfulness practice can improve mental wellbeing",
    })
  }

  // Cap risk between 10 and 80
  risk = Math.max(10, Math.min(80, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateImmuneRisk(userData: any) {
  let risk = 0
  const factors = []

  // Vaccination status
  if (userData?.vaccinationStatus) {
    if (userData.vaccinationStatus === "fully-vaccinated") {
      risk -= 15
      factors.push({
        name: "Vaccination",
        impact: "High positive impact",
        suggestion: "Staying up-to-date with vaccinations strengthens your immune protection",
      })
    } else if (userData.vaccinationStatus === "not-vaccinated") {
      risk += 20
      factors.push({
        name: "Vaccination",
        impact: "High negative impact",
        suggestion: "Consider updating your vaccinations to improve immune protection",
      })
    } else if (userData.vaccinationStatus === "partially-vaccinated") {
      risk += 10
      factors.push({
        name: "Vaccination",
        impact: "Medium negative impact",
        suggestion: "Complete your vaccination schedule for better immune protection",
      })
    }
  }

  // Sleep quality
  if (userData?.sleepQuality) {
    if (userData.sleepQuality === "poor") {
      risk += 15
      factors.push({
        name: "Sleep Quality",
        impact: "Medium negative impact",
        suggestion: "Poor sleep can weaken immune function; aim for 7-8 hours of quality sleep",
      })
    }
  } else if (userData?.sleepHours) {
    const sleepHours = Number.parseFloat(userData.sleepHours) || 7
    if (sleepHours < 6) {
      risk += 15
      factors.push({
        name: "Sleep Duration",
        impact: "Medium negative impact",
        suggestion: "Insufficient sleep weakens immunity. Aim for 7-8 hours nightly.",
      })
    }
  }

  // Stress level
  if (userData?.stressLevel) {
    const stressLevel = Number.parseInt(userData.stressLevel) || 5
    if (stressLevel >= 7) {
      risk += 20
      factors.push({
        name: "Stress Management",
        impact: "Medium negative impact",
        suggestion: "Chronic stress suppresses immune function; consider stress reduction techniques",
      })
    }
  }

  // Diet
  if (userData?.dietType) {
    if (userData.dietType === "vegetarian" || userData.dietType === "vegan") {
      risk -= 10
      factors.push({
        name: "Nutrition",
        impact: "Medium positive impact",
        suggestion: "Continue consuming a variety of fruits and vegetables rich in antioxidants",
      })
    }
  } else if (userData?.fastFoodFrequency === "daily") {
    risk += 15
    factors.push({
      name: "Nutrition",
      impact: "Medium negative impact",
      suggestion: "A diet high in processed foods may weaken immunity. Increase fruits and vegetables.",
    })
  }

  // Exercise
  if (userData?.exerciseFrequency) {
    if (userData.exerciseFrequency === "never") {
      risk += 15
      factors.push({
        name: "Physical Activity",
        impact: "Medium negative impact",
        suggestion: "Regular moderate exercise supports immune health",
      })
    } else if (userData.exerciseFrequency === "2-3-times-week" || userData.exerciseFrequency === "4-6-times-week") {
      risk -= 10
      factors.push({
        name: "Physical Activity",
        impact: "Medium positive impact",
        suggestion: "Your exercise routine supports immune function",
      })
    } else if (userData.exerciseFrequency === "daily") {
      risk += 5
      factors.push({
        name: "Physical Activity",
        impact: "Low negative impact",
        suggestion: "Very intense exercise may temporarily suppress immunity. Ensure adequate recovery.",
      })
    }
  }

  // Smoking
  if (userData?.smokingStatus) {
    if (userData.smokingStatus === "regular" || userData.smokingStatus === "occasional") {
      risk += 20
      factors.push({
        name: "Smoking",
        impact: "High negative impact",
        suggestion: "Smoking weakens immune function and lung defenses",
      })
    }
  }

  // Alcohol
  if (userData?.alcoholConsumption) {
    if (userData.alcoholConsumption === "daily") {
      risk += 20
      factors.push({
        name: "Alcohol Consumption",
        impact: "High negative impact",
        suggestion: "Excessive alcohol weakens immune function",
      })
    }
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Hydration",
      impact: "Medium positive impact",
      suggestion: "Staying well-hydrated supports immune function",
    })
  }

  // Cap risk between 15 and 75
  risk = Math.max(15, Math.min(75, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateChronicRisk(userData: any, bmi: number) {
  let risk = 0
  const factors = []

  // Age factor
  if (userData?.age) {
    const age = Number.parseInt(userData.age) || 30
    if (age >= 60) {
      risk += 25
      factors.push({
        name: "Age",
        impact: "High negative impact",
        suggestion: "Regular preventive screenings are essential at your age",
      })
    } else if (age >= 45) {
      risk += 15
      factors.push({
        name: "Age",
        impact: "Medium negative impact",
        suggestion: "Begin regular screenings for common chronic conditions",
      })
    }
  }

  // Family history
  if (userData?.familyHistory && Array.isArray(userData.familyHistory)) {
    let familyRiskCount = 0
    if (userData.familyHistory.includes("heart-disease")) familyRiskCount++
    if (userData.familyHistory.includes("diabetes")) familyRiskCount++
    if (userData.familyHistory.includes("cancer")) familyRiskCount++
    if (userData.familyHistory.includes("hypertension")) familyRiskCount++

    if (familyRiskCount >= 2) {
      risk += 25
      factors.push({
        name: "Family History",
        impact: "High negative impact",
        suggestion: "With your family history, regular preventive screenings are essential",
      })
    } else if (familyRiskCount === 1) {
      risk += 15
      factors.push({
        name: "Family History",
        impact: "Medium negative impact",
        suggestion: "Your family history increases risk for certain conditions. Regular check-ups are important.",
      })
    }
  }

  // BMI factor
  if (bmi && !isNaN(bmi)) {
    if (bmi >= 30) {
      risk += 25
      factors.push({
        name: "Weight Management",
        impact: "Medium negative impact",
        suggestion: "Maintaining a healthy weight reduces risk of multiple chronic conditions",
      })
    } else if (bmi >= 25) {
      risk += 15
      factors.push({
        name: "Weight Management",
        impact: "Low negative impact",
        suggestion: "Even modest weight loss can reduce chronic disease risk",
      })
    }
  }

  // Diet quality
  if (userData?.dietType) {
    if (userData.fastFoodFrequency === "daily" || userData.fastFoodFrequency === "several-times-week") {
      risk += 20
      factors.push({
        name: "Diet Quality",
        impact: "Medium negative impact",
        suggestion: "Reducing processed foods can lower chronic disease risk",
      })
    } else if (userData.dietType === "vegetarian" || userData.dietType === "vegan") {
      risk -= 15
      factors.push({
        name: "Diet Quality",
        impact: "High positive impact",
        suggestion: "Your diet helps protect against many chronic diseases",
      })
    }
  }

  // Physical activity
  if (userData?.exerciseFrequency) {
    if (userData.exerciseFrequency === "never" || userData.exerciseFrequency === "rarely") {
      risk += 20
      factors.push({
        name: "Physical Activity",
        impact: "Medium negative impact",
        suggestion: "Regular physical activity reduces risk of many chronic diseases",
      })
    } else if (userData.exerciseFrequency === "2-3-times-week" || userData.exerciseFrequency === "4-6-times-week") {
      risk -= 10
      factors.push({
        name: "Physical Activity",
        impact: "Medium positive impact",
        suggestion: "Your activity level helps prevent chronic conditions",
      })
    }
  }

  // Smoking
  if (userData?.smokingStatus) {
    if (userData.smokingStatus === "regular") {
      risk += 30
      factors.push({
        name: "Smoking",
        impact: "High negative impact",
        suggestion: "Smoking increases risk for numerous chronic diseases",
      })
    } else if (userData.smokingStatus === "occasional") {
      risk += 15
      factors.push({
        name: "Smoking",
        impact: "Medium negative impact",
        suggestion: "Even occasional smoking increases chronic disease risk",
      })
    }
  }

  // Regular checkups
  if (userData?.lastCheckup) {
    if (userData.lastCheckup === "less-than-6-months" || userData.lastCheckup === "6-12-months") {
      risk -= 10
      factors.push({
        name: "Regular Checkups",
        impact: "High positive impact",
        suggestion: "Continue with regular health screenings for early detection",
      })
    } else if (userData.lastCheckup === "more-than-5-years" || userData.lastCheckup === "never") {
      risk += 15
      factors.push({
        name: "Regular Checkups",
        impact: "Medium negative impact",
        suggestion: "Schedule a comprehensive health checkup soon",
      })
    }
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Stress Management",
      impact: "Medium negative impact",
      suggestion: "Chronic stress contributes to many chronic diseases",
    })
  }

  // Cap risk between 15 and 85
  risk = Math.max(15, Math.min(85, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}
