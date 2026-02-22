"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, ExternalLink, Info, Check, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Import the same icons as in premium-results.tsx
import {
  Activity,
  Dumbbell,
  Brain,
  Moon,
  Sun,
  Users,
  Thermometer,
  Droplets,
  Utensils,
  Clock,
  AlertCircle,
  Heart,
  Shield,
  Pill,
  Zap,
  Leaf,
  Apple,
  Salad,
  Bike,
  Footprints,
  Bed,
  BookOpen,
  Smartphone,
  Coffee,
  Wine,
  Cigarette,
  Scale,
  Stethoscope,
} from "lucide-react"

// Define risk category type (same as in premium-results.tsx)
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
    timeframe: string
    difficulty: string
    evidence: string
    details: string
  }[]
}

export default function RecommendationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("immediate")

  // Parse user data from URL parameters
  const userData = useMemo(() => {
    const dataParam = searchParams.get("data")
    if (!dataParam) return null
    try {
      return JSON.parse(decodeURIComponent(dataParam))
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  }, [searchParams])

  // This would normally come from a global state or API call with the user data
  // For now, we'll use the same risk calculation functions as in premium-results.tsx
  const riskData = useMemo(() => {
    if (!userData) {
      return [] // Return empty array if no user data
    }

    // Calculate BMI
    const bmi = userData.weight / (userData.height / 100) ** 2

    // Calculate risks using the same functions as in premium-results.tsx
    const cardiovascularRisk = calculateCardiovascularRisk(userData, bmi)
    const metabolicRisk = calculateMetabolicRisk(userData, bmi)
    const sleepRisk = calculateSleepRisk(userData)
    const mentalRisk = calculateMentalRisk(userData)
    const immuneRisk = calculateImmuneRisk(userData)
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

  // Get icon for factor
  const getIconForFactor = (factor: string) => {
    const factorLower = factor.toLowerCase()
    if (factorLower.includes("exercise") || factorLower.includes("physical") || factorLower.includes("activity"))
      return <Dumbbell className="h-5 w-5 text-blue-500" />
    if (factorLower.includes("weight") || factorLower.includes("bmi"))
      return <Scale className="h-5 w-5 text-blue-500" />
    if (factorLower.includes("diet") || factorLower.includes("nutrition"))
      return <Utensils className="h-5 w-5 text-green-500" />
    if (factorLower.includes("fruit") || factorLower.includes("vegetable"))
      return <Apple className="h-5 w-5 text-red-500" />
    if (factorLower.includes("salad") || factorLower.includes("greens"))
      return <Salad className="h-5 w-5 text-green-500" />
    if (factorLower.includes("sleep")) return <Moon className="h-5 w-5 text-indigo-500" />
    if (factorLower.includes("bed") || factorLower.includes("rest")) return <Bed className="h-5 w-5 text-indigo-500" />
    if (factorLower.includes("stress") || factorLower.includes("mental") || factorLower.includes("mindful"))
      return <Brain className="h-5 w-5 text-purple-500" />
    if (factorLower.includes("screen")) return <Smartphone className="h-5 w-5 text-orange-500" />
    if (factorLower.includes("outdoor")) return <Sun className="h-5 w-5 text-yellow-500" />
    if (factorLower.includes("social") || factorLower.includes("connection"))
      return <Users className="h-5 w-5 text-pink-500" />
    if (factorLower.includes("smoking") || factorLower.includes("cigarette"))
      return <Cigarette className="h-5 w-5 text-red-500" />
    if (factorLower.includes("alcohol") || factorLower.includes("wine") || factorLower.includes("drinking"))
      return <Wine className="h-5 w-5 text-red-500" />
    if (factorLower.includes("water") || factorLower.includes("hydration"))
      return <Droplets className="h-5 w-5 text-cyan-500" />
    if (factorLower.includes("coffee") || factorLower.includes("caffeine"))
      return <Coffee className="h-5 w-5 text-amber-700" />
    if (factorLower.includes("medical") || factorLower.includes("checkup") || factorLower.includes("doctor"))
      return <Stethoscope className="h-5 w-5 text-red-500" />
    if (factorLower.includes("cycling") || factorLower.includes("bike"))
      return <Bike className="h-5 w-5 text-blue-500" />
    if (factorLower.includes("walking") || factorLower.includes("steps"))
      return <Footprints className="h-5 w-5 text-blue-500" />
    if (factorLower.includes("reading") || factorLower.includes("learn"))
      return <BookOpen className="h-5 w-5 text-amber-500" />
    if (factorLower.includes("energy")) return <Zap className="h-5 w-5 text-yellow-500" />
    if (factorLower.includes("nature") || factorLower.includes("plant"))
      return <Leaf className="h-5 w-5 text-green-500" />
    if (factorLower.includes("time") || factorLower.includes("schedule"))
      return <Clock className="h-5 w-5 text-blue-500" />
    if (factorLower.includes("pain")) return <Thermometer className="h-5 w-5 text-red-500" />
    if (factorLower.includes("family")) return <Users className="h-5 w-5 text-blue-500" />
    if (factorLower.includes("heart") || factorLower.includes("cardio"))
      return <Heart className="h-5 w-5 text-red-500" />
    if (factorLower.includes("immune")) return <Shield className="h-5 w-5 text-green-500" />
    if (factorLower.includes("medication") || factorLower.includes("pill"))
      return <Pill className="h-5 w-5 text-purple-500" />

    return <Activity className="h-5 w-5 text-gray-500" />
  }

  // Get difficulty badge
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            Easy
          </Badge>
        )
      case "moderate":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
          >
            Moderate
          </Badge>
        )
      case "challenging":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            Challenging
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            {difficulty}
          </Badge>
        )
    }
  }

  // Get timeframe badge
  const getTimeframeBadge = (timeframe: string) => {
    switch (timeframe) {
      case "immediate":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
          >
            Start Now
          </Badge>
        )
      case "short-term":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            Within 2 Weeks
          </Badge>
        )
      case "medium-term":
        return (
          <Badge
            variant="outline"
            className="bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800"
          >
            1-3 Months
          </Badge>
        )
      case "long-term":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
          >
            Ongoing
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
          >
            {timeframe}
          </Badge>
        )
    }
  }

  // Get evidence badge
  const getEvidenceBadge = (evidence: string) => {
    switch (evidence) {
      case "strong":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            Strong Evidence
          </Badge>
        )
      case "moderate":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
          >
            Moderate Evidence
          </Badge>
        )
      case "limited":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
          >
            Limited Evidence
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            {evidence}
          </Badge>
        )
    }
  }

  // Group recommendations by priority
  const immediateActions = riskData
    .flatMap((category) =>
      category.factors
        .filter((f) => f.timeframe === "immediate")
        .map((factor) => ({
          category: category.category,
          categoryId: category.id,
          categoryColor: category.color,
          factor: factor,
        })),
    )
    .slice(0, 6)

  const shortTermActions = riskData
    .flatMap((category) =>
      category.factors
        .filter((f) => f.timeframe === "short-term")
        .map((factor) => ({
          category: category.category,
          categoryId: category.id,
          categoryColor: category.color,
          factor: factor,
        })),
    )
    .slice(0, 6)

  const mediumTermActions = riskData
    .flatMap((category) =>
      category.factors
        .filter((f) => f.timeframe === "medium-term")
        .map((factor) => ({
          category: category.category,
          categoryId: category.id,
          categoryColor: category.color,
          factor: factor,
        })),
    )
    .slice(0, 6)

  const maintenanceActions = riskData
    .flatMap((category) =>
      category.factors
        .filter((f) => f.impact.includes("positive"))
        .map((factor) => ({
          category: category.category,
          categoryId: category.id,
          categoryColor: category.color,
          factor: factor,
        })),
    )
    .slice(0, 6)

  // Calculate overall health score
  const overallHealthScore = useMemo(() => {
    if (riskData.length === 0) return 0
    const averageRisk = riskData.reduce((sum, category) => sum + category.risk, 0) / riskData.length
    return Math.round(100 - averageRisk)
  }, [riskData])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Overview
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Personalized Health Plan</h1>
          </div>
          <Button
            onClick={() => {
              // Download functionality would go here
              alert("Downloading your personalized health plan...")
            }}
            className="hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Download className="h-4 w-4" />
            Download Plan
          </Button>
        </div>

        <div className="mb-8">
          <Card className="border border-gray-200 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-gray-900 dark:text-white">Your Health Overview</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Based on your assessment, we've created a personalized plan to help you improve your health outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">{overallHealthScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Health Score</div>
                  <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-500">
                    {overallHealthScore >= 80
                      ? "Excellent! You're on the right track."
                      : overallHealthScore >= 60
                        ? "Good. Some improvements can help."
                        : "Needs attention. Follow your plan closely."}
                  </div>
                </div>
                <div className="flex flex-col justify-center p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Top Priority Areas</div>
                  <div className="space-y-2">
                    {riskData
                      .sort((a, b) => b.risk - a.risk)
                      .slice(0, 2)
                      .map((category) => (
                        <div key={category.id} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">{category.category}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">({category.risk}% risk)</div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommended Focus</div>
                  <div className="space-y-2">
                    {immediateActions.slice(0, 2).map((item, index) => (
                      <div key={`focus-${index}`} className="flex items-center gap-2">
                        <div className="text-primary-600 dark:text-primary-400">
                          {getIconForFactor(item.factor.name)}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{item.factor.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card className="border border-gray-200 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900">
                  <Activity className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                Your Health Overview
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Based on your assessment, we've created a personalized plan to help you improve your health outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Health Score Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Health Score */}
                <div className="lg:col-span-1">
                  <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(overallHealthScore / 100) * 251.2} 251.2`}
                          className="text-primary-600 dark:text-primary-400 transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                          {overallHealthScore}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Health Score</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Overall Assessment
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {overallHealthScore >= 80
                          ? "Excellent! You're on the right track."
                          : overallHealthScore >= 60
                            ? "Good. Some improvements can help."
                            : "Needs attention. Follow your plan closely."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Categories Breakdown */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    {riskData
                      .sort((a, b) => b.risk - a.risk)
                      .slice(0, 4)
                      .map((category, index) => (
                        <div key={category.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-full text-white" style={{ backgroundColor: category.color }}>
                              {category.icon}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {category.category}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-500">{category.risk}% risk</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${category.risk}%`,
                                backgroundColor: category.color,
                              }}
                            ></div>
                          </div>
                          <div className="mt-2 flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-500">Low</span>
                            <span className="text-gray-500 dark:text-gray-500">High</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Action Items Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {immediateActions.length}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Immediate Actions</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Start today</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{shortTermActions.length}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Short-term Goals</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Next 2 weeks</div>
                </div>
                <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{mediumTermActions.length}</div>
                  <div className="text-sm text-cyan-700 dark:text-cyan-300">Medium-term Plans</div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">1-3 months</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {maintenanceActions.length}
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">Maintenance</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Keep doing</div>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Your Health Journey
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Assessment Complete</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Your health profile analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Action Plan Ready</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Personalized recommendations</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Your Journey</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Begin improving today</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="immediate" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8 bg-gray-100 dark:bg-gray-800 p-1">
            <TabsTrigger
              value="immediate"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white dark:data-[state=active]:bg-primary-700"
            >
              Start Now
            </TabsTrigger>
            <TabsTrigger
              value="short-term"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white dark:data-[state=active]:bg-primary-700"
            >
              Next 2 Weeks
            </TabsTrigger>
            <TabsTrigger
              value="medium-term"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white dark:data-[state=active]:bg-primary-700"
            >
              1-3 Months
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white dark:data-[state=active]:bg-primary-700"
            >
              Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="immediate" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {immediateActions.length > 0 ? (
                immediateActions.map((item, index) => (
                  <motion.div
                    key={`immediate-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="h-full border border-gray-200 shadow-md overflow-hidden dark:border-gray-800 dark:bg-gray-900">
                      <div className="h-1" style={{ backgroundColor: item.categoryColor }}></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full" style={{ backgroundColor: `${item.categoryColor}20` }}>
                              {getIconForFactor(item.factor.name)}
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900 dark:text-white">
                                {item.factor.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-400">
                                {item.category} Health
                              </CardDescription>
                            </div>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  This recommendation is based on your {item.category.toLowerCase()} health assessment.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{item.factor.suggestion}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.factor.details}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {getTimeframeBadge(item.factor.timeframe)}
                          {getDifficultyBadge(item.factor.difficulty)}
                          {getEvidenceBadge(item.factor.evidence)}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {item.factor.impact.includes("negative")
                            ? "Risk factor if not addressed"
                            : "Positive health factor"}
                        </div>
                        <Link
                          href={`#${item.categoryId}`}
                          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                        >
                          Learn more
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">No Immediate Actions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't have any high-priority actions that need immediate attention.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="short-term" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortTermActions.length > 0 ? (
                shortTermActions.map((item, index) => (
                  <motion.div
                    key={`short-term-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="h-full border border-gray-200 shadow-md overflow-hidden dark:border-gray-800 dark:bg-gray-900">
                      <div className="h-1" style={{ backgroundColor: item.categoryColor }}></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full" style={{ backgroundColor: `${item.categoryColor}20` }}>
                              {getIconForFactor(item.factor.name)}
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900 dark:text-white">
                                {item.factor.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-400">
                                {item.category} Health
                              </CardDescription>
                            </div>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  This recommendation is based on your {item.category.toLowerCase()} health assessment.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{item.factor.suggestion}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.factor.details}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {getTimeframeBadge(item.factor.timeframe)}
                          {getDifficultyBadge(item.factor.difficulty)}
                          {getEvidenceBadge(item.factor.evidence)}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {item.factor.impact.includes("negative")
                            ? "Risk factor if not addressed"
                            : "Positive health factor"}
                        </div>
                        <Link
                          href={`#${item.categoryId}`}
                          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                        >
                          Learn more
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">No Short-Term Actions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't have any actions recommended for the next 2 weeks.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="medium-term" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediumTermActions.length > 0 ? (
                mediumTermActions.map((item, index) => (
                  <motion.div
                    key={`medium-term-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="h-full border border-gray-200 shadow-md overflow-hidden dark:border-gray-800 dark:bg-gray-900">
                      <div className="h-1" style={{ backgroundColor: item.categoryColor }}></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full" style={{ backgroundColor: `${item.categoryColor}20` }}>
                              {getIconForFactor(item.factor.name)}
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900 dark:text-white">
                                {item.factor.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-400">
                                {item.category} Health
                              </CardDescription>
                            </div>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  This recommendation is based on your {item.category.toLowerCase()} health assessment.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{item.factor.suggestion}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.factor.details}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {getTimeframeBadge(item.factor.timeframe)}
                          {getDifficultyBadge(item.factor.difficulty)}
                          {getEvidenceBadge(item.factor.evidence)}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {item.factor.impact.includes("negative")
                            ? "Risk factor if not addressed"
                            : "Positive health factor"}
                        </div>
                        <Link
                          href={`#${item.categoryId}`}
                          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                        >
                          Learn more
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">No Medium-Term Actions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't have any actions recommended for the 1-3 month timeframe.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {maintenanceActions.length > 0 ? (
                maintenanceActions.map((item, index) => (
                  <motion.div
                    key={`maintenance-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="h-full border border-gray-200 shadow-md overflow-hidden dark:border-gray-800 dark:bg-gray-900">
                      <div className="h-1" style={{ backgroundColor: item.categoryColor }}></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full" style={{ backgroundColor: `${item.categoryColor}20` }}>
                              {getIconForFactor(item.factor.name)}
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900 dark:text-white">
                                {item.factor.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-400">
                                {item.category} Health
                              </CardDescription>
                            </div>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  This recommendation is based on your {item.category.toLowerCase()} health assessment.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{item.factor.suggestion}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.factor.details}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {getTimeframeBadge("long-term")}
                          {getDifficultyBadge(item.factor.difficulty)}
                          {getEvidenceBadge(item.factor.evidence)}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Continue this positive health habit
                        </div>
                        <Link
                          href={`#${item.categoryId}`}
                          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                        >
                          Learn more
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">No Maintenance Actions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't have any positive habits identified for maintenance.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <motion.p
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          This health plan is based on your assessment results and should be used as a guide.
          <br />
          Always consult with healthcare professionals before making significant changes to your health routine.
        </motion.p>
      </div>
    </div>
  )
}

// Risk calculation functions
function calculateCardiovascularRisk(userData: any, bmi: number) {
  // Copy the function from premium-results.tsx
  let risk = 0
  const factors = []

  // Age
  if (userData.age >= 45) {
    risk += 10
    factors.push({
      name: "Age-Related Cardiovascular Risk",
      impact: "Medium negative impact",
      suggestion: "Schedule regular cardiovascular checkups with your healthcare provider",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "As we age, the risk of cardiovascular disease increases. Regular monitoring becomes more important after age 45, especially for blood pressure, cholesterol, and overall heart health.",
    })
  }

  // Smoking
  if (userData.smoking) {
    risk += 15
    factors.push({
      name: "Smoking Cessation",
      impact: "High negative impact",
      suggestion: "Consider a smoking cessation program or nicotine replacement therapy",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Smoking damages blood vessels, reduces oxygen in the blood, and increases blood pressure and heart rate. Quitting smoking can reduce your heart disease risk by up to 50% within one year.",
    })
  }

  // Blood Pressure (Systolic)
  if (userData.systolicBloodPressure >= 140) {
    risk += 12
    factors.push({
      name: "Blood Pressure Management",
      impact: "Medium negative impact",
      suggestion: "Consult your doctor about a blood pressure management plan",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "High blood pressure forces your heart to work harder, damaging arteries over time. A combination of medication, diet changes, and regular exercise can effectively manage blood pressure.",
    })
  }

  // Cholesterol
  if (userData.cholesterol >= 200) {
    risk += 8
    factors.push({
      name: "Cholesterol Reduction",
      impact: "Medium negative impact",
      suggestion: "Reduce saturated fat intake and increase fiber-rich foods",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "High cholesterol contributes to plaque buildup in arteries. Dietary changes like reducing saturated fats, increasing soluble fiber, and adding plant sterols can help lower cholesterol naturally.",
    })
  }

  // Physical Activity
  if (!userData.exercise) {
    risk += 10
    factors.push({
      name: "Regular Cardiovascular Exercise",
      impact: "Medium negative impact",
      suggestion: "Start with 30 minutes of moderate activity 3 times per week",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Regular aerobic exercise strengthens your heart, improves circulation, and helps manage weight and stress. Even walking briskly for 30 minutes several times a week can significantly improve heart health.",
    })
  } else {
    factors.push({
      name: "Maintain Exercise Routine",
      impact: "Medium positive impact",
      suggestion: "Continue your regular exercise routine and consider adding variety",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your current exercise habits are benefiting your cardiovascular health. For continued benefits, consider adding variety to your routine, such as incorporating both cardio and strength training.",
    })
  }

  // Family History
  if (userData.familyHistory) {
    risk += 7
    factors.push({
      name: "Family History Awareness",
      impact: "Medium negative impact",
      suggestion: "Inform your doctor about your family history of heart disease",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "moderate",
      details:
        "A family history of heart disease increases your risk. Sharing this information with your healthcare provider allows for more targeted prevention strategies and earlier screening when appropriate.",
    })
  }

  // Diet (Example: High sodium intake)
  if (userData.diet === "unhealthy") {
    risk += 8
    factors.push({
      name: "Sodium Reduction",
      impact: "Medium negative impact",
      suggestion: "Limit processed foods and read nutrition labels for sodium content",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "High sodium intake can raise blood pressure and increase heart disease risk. Aim to consume less than 2,300mg of sodium daily by limiting processed foods and adding flavor with herbs and spices instead of salt.",
    })
  } else {
    factors.push({
      name: "Heart-Healthy Diet",
      impact: "Medium positive impact",
      suggestion: "Continue with your healthy diet rich in fruits, vegetables, and whole grains",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your current diet is supporting your heart health. Focus on maintaining a balanced intake of fruits, vegetables, whole grains, lean proteins, and healthy fats like those found in olive oil and fatty fish.",
    })
  }

  // Obesity (BMI)
  if (bmi > 30) {
    risk += 10
    factors.push({
      name: "Weight Management",
      impact: "Medium negative impact",
      suggestion: "Aim for a gradual 10% weight reduction through diet and exercise",
      timeframe: "medium-term",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Obesity increases strain on the heart and is linked to high blood pressure, diabetes, and high cholesterol. Even a modest weight loss of 5-10% can significantly improve heart health metrics.",
    })
  }

  // Alcohol Consumption
  if (userData.alcohol === "high") {
    risk += 5
    factors.push({
      name: "Alcohol Moderation",
      impact: "Low negative impact",
      suggestion: "Limit alcohol to no more than 1-2 drinks per day",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "moderate",
      details:
        "Excessive alcohol consumption can raise blood pressure, contribute to irregular heartbeats, and weaken heart muscle. Limit intake to no more than 1 drink daily for women and 2 for men.",
    })
  }

  // Stress Management
  factors.push({
    name: "Stress Management",
    impact: "Medium negative impact",
    suggestion: "Practice stress reduction techniques like deep breathing or meditation",
    timeframe: "short-term",
    difficulty: "easy",
    evidence: "moderate",
    details:
      "Chronic stress contributes to inflammation, high blood pressure, and unhealthy coping behaviors. Regular stress management practices like meditation, deep breathing, or yoga can help reduce these effects.",
  })

  return { risk, factors: factors.slice(0, 5) }
}

function calculateMetabolicRisk(userData: any, bmi: number) {
  let risk = 0
  const factors = []

  // BMI
  if (bmi > 25) {
    risk += 12
    factors.push({
      name: "Healthy Weight Achievement",
      impact: "Medium negative impact",
      suggestion: "Focus on a balanced diet with portion control and regular exercise",
      timeframe: "medium-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Excess weight, especially around the abdomen, increases insulin resistance and metabolic syndrome risk. A sustainable approach combining dietary changes and increased physical activity is most effective for long-term weight management.",
    })
  }

  // Waist Circumference (simplified)
  if (userData.waistCircumference > 40) {
    risk += 10
    factors.push({
      name: "Abdominal Fat Reduction",
      impact: "Medium negative impact",
      suggestion: "Focus on core-strengthening exercises and overall weight management",
      timeframe: "medium-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Abdominal fat is metabolically active and increases insulin resistance. A combination of cardio exercise, strength training, and a diet low in refined carbohydrates can help reduce visceral fat specifically.",
    })
  }

  // Physical Activity
  if (!userData.exercise) {
    risk += 10
    factors.push({
      name: "Regular Physical Activity",
      impact: "Medium negative impact",
      suggestion: "Start with 150 minutes of moderate exercise weekly, including strength training",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Regular exercise improves insulin sensitivity and glucose metabolism. Aim for a combination of cardio and resistance training, which has been shown to have the greatest benefit for metabolic health.",
    })
  } else {
    factors.push({
      name: "Maintain Exercise Routine",
      impact: "Medium positive impact",
      suggestion: "Continue your regular exercise routine with both cardio and strength training",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your current exercise habits are benefiting your metabolic health. For optimal results, ensure your routine includes both cardiovascular exercise and strength training at least twice weekly.",
    })
  }

  // Diet (High processed carbs)
  if (userData.diet === "unhealthy") {
    risk += 15
    factors.push({
      name: "Reduce Refined Carbohydrates",
      impact: "Medium negative impact",
      suggestion: "Replace processed carbs with whole grains, legumes, and vegetables",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Refined carbohydrates cause rapid blood sugar spikes and contribute to insulin resistance. Focus on complex carbohydrates with fiber, which slow digestion and help maintain stable blood sugar levels.",
    })
  } else {
    factors.push({
      name: "Balanced Nutrition",
      impact: "Medium positive impact",
      suggestion: "Continue with your balanced diet rich in whole foods",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your current diet supports metabolic health. Continue focusing on whole foods, adequate protein, healthy fats, and complex carbohydrates while minimizing added sugars and highly processed foods.",
    })
  }

  // Fast Food Consumption
  if (userData.fastFood === "high") {
    risk += 8
    factors.push({
      name: "Reduce Fast Food Intake",
      impact: "Medium negative impact",
      suggestion: "Limit fast food to once per week and choose healthier options when available",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "moderate",
      details:
        "Fast food is typically high in calories, unhealthy fats, sodium, and refined carbohydrates. Meal planning and preparation at home gives you more control over ingredients and portion sizes.",
    })
  }

  // Water Intake
  if (userData.waterIntake < 6) {
    risk += 5
    factors.push({
      name: "Hydration Improvement",
      impact: "Low negative impact",
      suggestion: "Gradually increase water intake to 8-10 glasses daily",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "moderate",
      details:
        "Proper hydration supports metabolic processes and helps distinguish thirst from hunger. Carry a reusable water bottle and set regular reminders to drink throughout the day.",
    })
  } else {
    factors.push({
      name: "Maintain Hydration",
      impact: "Medium positive impact",
      suggestion: "Continue with good hydration habits throughout the day",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "moderate",
      details:
        "Your current hydration habits support metabolic health. Water helps regulate body temperature, aids digestion, and supports nutrient transport throughout the body.",
    })
  }

  // Sleep Duration
  if (userData.sleep < 7) {
    risk += 7
    factors.push({
      name: "Sleep Duration Improvement",
      impact: "Medium negative impact",
      suggestion: "Aim for 7-8 hours of quality sleep per night with a consistent schedule",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Insufficient sleep disrupts hunger hormones and insulin sensitivity. Establish a regular sleep schedule, create a relaxing bedtime routine, and optimize your sleep environment for quality rest.",
    })
  }

  // Blood Sugar Monitoring
  factors.push({
    name: "Regular Blood Sugar Monitoring",
    impact: "Medium negative impact",
    suggestion: "Consider periodic blood sugar testing, especially if you have risk factors",
    timeframe: "medium-term",
    difficulty: "easy",
    evidence: "moderate",
    details:
      "Regular monitoring can detect prediabetes early when lifestyle interventions are most effective. Discuss appropriate screening intervals with your healthcare provider based on your risk factors.",
  })

  return { risk, factors: factors.slice(0, 5) }
}

function calculateSleepRisk(userData: any) {
  let risk = 0
  const factors = []

  // Screen Time Before Bed
  if (userData.screenTimeBeforeBed > 2) {
    risk += 15
    factors.push({
      name: "Reduce Evening Screen Time",
      impact: "High negative impact",
      suggestion: "Avoid screens at least 1 hour before bedtime and use blue light filters",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Blue light from screens suppresses melatonin production and disrupts your circadian rhythm. Replace screen time with reading, gentle stretching, or meditation to prepare your body for sleep.",
    })
  }

  // Stress Levels
  if (userData.stressLevel > 7) {
    risk += 12
    factors.push({
      name: "Evening Relaxation Routine",
      impact: "Medium negative impact",
      suggestion: "Develop a 15-minute relaxation routine before bed with deep breathing or meditation",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "High stress levels make it difficult to fall and stay asleep. A consistent pre-sleep relaxation routine signals to your body that it's time to wind down and prepares your mind for restful sleep.",
    })
  }

  // Exercise Timing
  if (userData.exerciseTiming === "late") {
    risk += 8
    factors.push({
      name: "Adjust Exercise Timing",
      impact: "Low negative impact",
      suggestion: "Complete intense exercise at least 3-4 hours before bedtime",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "moderate",
      details:
        "Evening exercise can raise body temperature and stimulate the nervous system, making it harder to fall asleep. Morning or afternoon exercise tends to promote better sleep quality.",
    })
  }

  // Sleep Environment
  if (userData.sleepEnvironment === "uncomfortable") {
    risk += 7
    factors.push({
      name: "Optimize Sleep Environment",
      impact: "Medium negative impact",
      suggestion: "Create a cool, dark, quiet bedroom with a comfortable mattress and pillows",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Your sleep environment significantly impacts sleep quality. Aim for a room temperature between 60-67°F (15-20°C), use blackout curtains if needed, and consider white noise for sound masking if your environment is noisy.",
    })
  } else {
    factors.push({
      name: "Maintain Sleep Environment",
      impact: "Medium positive impact",
      suggestion: "Continue maintaining your comfortable sleep environment",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your current sleep environment supports quality rest. Regularly wash bedding, replace pillows every 1-2 years, and consider mattress replacement every 7-10 years for continued comfort.",
    })
  }

  // Sleep Consistency
  if (!userData.consistentSleep) {
    risk += 10
    factors.push({
      name: "Consistent Sleep Schedule",
      impact: "Medium negative impact",
      suggestion: "Go to bed and wake up at the same time daily, even on weekends",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "A regular sleep schedule strengthens your circadian rhythm, improving both sleep quality and daytime alertness. Try to maintain consistency within 30-60 minutes, even on weekends.",
    })
  }

  // Caffeine Consumption
  factors.push({
    name: "Caffeine Management",
    impact: "Medium negative impact",
    suggestion: "Avoid caffeine at least 8 hours before bedtime",
    timeframe: "immediate",
    difficulty: "moderate",
    evidence: "strong",
    details:
      "Caffeine has a half-life of 5-6 hours, meaning half remains in your system that long after consumption. For sensitive individuals, even morning caffeine can affect sleep quality.",
  })

  // Alcohol Before Bed
  factors.push({
    name: "Evening Alcohol Consumption",
    impact: "Medium negative impact",
    suggestion: "Limit alcohol in the evening or have it at least 3 hours before bed",
    timeframe: "short-term",
    difficulty: "moderate",
    evidence: "strong",
    details:
      "While alcohol may help you fall asleep initially, it disrupts REM sleep and causes more awakenings later in the night, reducing overall sleep quality.",
  })

  return { risk, factors: factors.slice(0, 5) }
}

function calculateMentalRisk(userData: any) {
  let risk = 0
  const factors = []

  // Social Connection
  if (userData.socialConnection === "low") {
    risk += 15
    factors.push({
      name: "Social Connection Building",
      impact: "High negative impact",
      suggestion: "Schedule regular social activities and consider joining community groups",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Social isolation is strongly linked to depression, anxiety, and cognitive decline. Even brief social interactions can improve mood and reduce stress. Start with small, manageable social activities that align with your interests.",
    })
  } else {
    factors.push({
      name: "Maintain Social Connections",
      impact: "High positive impact",
      suggestion: "Continue nurturing your existing relationships and social network",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your current social connections provide valuable emotional support and resilience. Regular meaningful interactions with others help buffer against stress and improve overall mental wellbeing.",
    })
  }

  // Stress Management
  if (!userData.mindfulness) {
    risk += 12
    factors.push({
      name: "Mindfulness Practice",
      impact: "Medium negative impact",
      suggestion: "Start with 5-10 minutes of daily mindfulness meditation",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Regular mindfulness practice reduces stress hormones, improves emotional regulation, and enhances focus. Begin with guided meditations using apps like Headspace or Calm if you're new to the practice.",
    })
  }

  // Sleep Quality
  if (userData.sleep < 7) {
    risk += 10
    factors.push({
      name: "Sleep Quality Improvement",
      impact: "Medium negative impact",
      suggestion: "Prioritize sleep hygiene and aim for 7-8 hours of quality sleep",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Poor sleep significantly impacts mood, cognitive function, and stress resilience. Establish a consistent sleep schedule, create a relaxing bedtime routine, and optimize your sleep environment for better mental health.",
    })
  }

  // Outdoor Time
  if (userData.outdoorTime < 1) {
    risk += 8
    factors.push({
      name: "Nature Exposure",
      impact: "Medium negative impact",
      suggestion: "Spend at least 30 minutes outdoors daily, preferably in natural settings",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "moderate",
      details:
        "Time in nature reduces stress hormones, improves mood, and enhances cognitive function. Even urban parks or gardens provide benefits. Morning outdoor time has the added benefit of regulating circadian rhythm.",
    })
  } else {
    factors.push({
      name: "Continue Outdoor Activities",
      impact: "Medium positive impact",
      suggestion: "Maintain your outdoor time and consider nature-based activities",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "moderate",
      details:
        "Your time outdoors benefits your mental health through reduced stress, improved mood, and enhanced vitamin D production. Consider varying your outdoor environments for additional cognitive benefits.",
    })
  }

  // Physical Activity
  if (!userData.exercise) {
    risk += 7
    factors.push({
      name: "Mood-Boosting Exercise",
      impact: "Medium negative impact",
      suggestion: "Start with 20-30 minutes of enjoyable physical activity 3 times weekly",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Regular exercise increases endorphins, improves sleep, and reduces anxiety and depression symptoms. Choose activities you enjoy to increase adherence - walking, dancing, cycling, or yoga are all excellent options.",
    })
  } else {
    factors.push({
      name: "Maintain Exercise Routine",
      impact: "High positive impact",
      suggestion: "Continue your regular physical activity for mental health benefits",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your current exercise routine provides significant mental health benefits through endorphin release, improved sleep quality, and stress reduction. Consider adding variety to maintain motivation and engagement.",
    })
  }

  // Screen Time Management
  factors.push({
    name: "Digital Wellbeing",
    impact: "Medium negative impact",
    suggestion: "Set boundaries around social media use and news consumption",
    timeframe: "short-term",
    difficulty: "moderate",
    evidence: "moderate",
    details:
      "Excessive screen time, particularly social media and news, is associated with increased anxiety and depression. Consider designated tech-free times, removing social apps from your phone, or using screen time limiting apps.",
  })

  // Gratitude Practice
  factors.push({
    name: "Gratitude Journaling",
    impact: "Medium positive impact",
    suggestion: "Write down three things you're grateful for each day",
    timeframe: "immediate",
    difficulty: "easy",
    evidence: "moderate",
    details:
      "Regular gratitude practice shifts attention toward positive experiences and away from rumination. This simple habit has been shown to improve mood, sleep quality, and overall life satisfaction when practiced consistently.",
  })

  return { risk, factors: factors.slice(0, 5) }
}

function calculateImmuneRisk(userData: any) {
  let risk = 0
  const factors = []

  // Vaccination Status
  if (userData.vaccinationStatus === "Not vaccinated") {
    risk += 20
    factors.push({
      name: "Vaccination Update",
      impact: "High negative impact",
      suggestion: "Consult with your healthcare provider about recommended vaccinations",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Vaccines train your immune system to recognize and fight specific pathogens without causing disease. Staying current with recommended vaccinations provides protection against serious infectious diseases and contributes to community immunity.",
    })
  } else if (userData.vaccinationStatus === "Partially vaccinated") {
    risk += 10
    factors.push({
      name: "Complete Vaccination Schedule",
      impact: "Medium negative impact",
      suggestion: "Follow up on any incomplete vaccination series",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Many vaccines require multiple doses to achieve full protection. Completing your vaccination schedule ensures you receive the maximum immune benefit and longest-lasting protection.",
    })
  }

  // Hygiene Practices
  if (userData.hygienePractices === "Poor") {
    risk += 20
    factors.push({
      name: "Hand Hygiene Improvement",
      impact: "High negative impact",
      suggestion:
        "Wash hands thoroughly with soap for at least 20 seconds, especially before eating and after using the bathroom",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Proper hand washing is one of the most effective ways to prevent infection. Focus on washing before meals, after using the bathroom, after being in public places, and after coughing or sneezing.",
    })
  } else if (userData.hygienePractices === "Fair") {
    risk += 10
    factors.push({
      name: "Hygiene Habit Reinforcement",
      impact: "Medium negative impact",
      suggestion: "Strengthen hygiene practices and be consistent with handwashing",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Consistent hygiene practices significantly reduce infection risk. Consider setting reminders for handwashing after high-risk activities and keep hand sanitizer available when soap and water aren't accessible.",
    })
  }

  // Exposure to Infections
  if (userData.exposureToInfections === "High") {
    risk += 15
    factors.push({
      name: "Infection Exposure Reduction",
      impact: "High negative impact",
      suggestion: "Wear masks in crowded indoor settings and practice social distancing when appropriate",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Reducing exposure to pathogens is especially important during disease outbreaks or if you have risk factors for severe illness. Consider wearing masks in crowded indoor settings and maintaining distance from visibly ill individuals.",
    })
  } else if (userData.exposureToInfections === "Moderate") {
    risk += 8
    factors.push({
      name: "Mindful Exposure Management",
      impact: "Medium negative impact",
      suggestion: "Take precautions in high-risk settings and during seasonal illness peaks",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "moderate",
      details:
        "Being selective about environments and timing can reduce infection risk. Consider avoiding crowded indoor spaces during peak illness seasons and practicing extra vigilance with hand hygiene in high-risk settings.",
    })
  }

  // Autoimmune Conditions
  if (userData.autoimmuneConditions === "Yes") {
    risk += 20
    factors.push({
      name: "Autoimmune Management",
      impact: "High negative impact",
      suggestion: "Work closely with healthcare providers to manage your autoimmune condition",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Autoimmune conditions require careful management to prevent flares and complications. Follow your treatment plan consistently and communicate any symptom changes promptly to your healthcare provider.",
    })
  }

  // Inflammation Markers
  if (userData.inflammationMarkers === "High") {
    risk += 15
    factors.push({
      name: "Anti-Inflammatory Diet",
      impact: "High negative impact",
      suggestion: "Adopt an anti-inflammatory diet rich in colorful fruits, vegetables, and omega-3 fatty acids",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "moderate",
      details:
        "Chronic inflammation impairs immune function and increases disease risk. Focus on foods with natural anti-inflammatory properties like fatty fish, berries, leafy greens, nuts, olive oil, and turmeric while limiting processed foods, refined carbohydrates, and excessive alcohol.",
    })
  } else if (userData.inflammationMarkers === "Moderate") {
    risk += 8
    factors.push({
      name: "Inflammation Reduction",
      impact: "Medium negative impact",
      suggestion: "Incorporate anti-inflammatory foods and practices into your routine",
      timeframe: "medium-term",
      difficulty: "moderate",
      evidence: "moderate",
      details:
        "Moderate inflammation can be addressed through diet and lifestyle. Regular exercise, stress management, adequate sleep, and an anti-inflammatory diet can help reduce inflammatory markers and improve immune function.",
    })
  }

  // Sleep Quality
  factors.push({
    name: "Immune-Supporting Sleep",
    impact: "Medium negative impact",
    suggestion: "Prioritize 7-8 hours of quality sleep for optimal immune function",
    timeframe: "immediate",
    difficulty: "moderate",
    evidence: "strong",
    details:
      "Sleep is when your body produces and releases cytokines and other immune cells. Consistent, quality sleep strengthens immune response to pathogens and improves vaccine effectiveness.",
  })

  // Stress Management
  factors.push({
    name: "Stress Reduction for Immunity",
    impact: "Medium negative impact",
    suggestion: "Practice regular stress management techniques like deep breathing or meditation",
    timeframe: "short-term",
    difficulty: "easy",
    evidence: "moderate",
    details:
      "Chronic stress suppresses immune function through elevated cortisol levels. Regular stress management practices can help maintain healthy immune cell counts and improve your body's ability to fight infection.",
  })

  risk = Math.min(risk, 100)

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateChronicRisk(userData: any, bmi: number) {
  let risk = 0
  const factors = []

  // Family History
  if (userData.familyHistory === "Yes") {
    risk += 20
    factors.push({
      name: "Family History Awareness",
      impact: "High negative impact",
      suggestion: "Schedule regular screenings based on your family disease history",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Genetic factors significantly influence chronic disease risk. Discuss your family history with healthcare providers to determine appropriate screening schedules and preventive measures specific to your risk profile.",
    })
  }

  // Smoking History
  if (userData.smokingHistory === "Current" || userData.smokingHistory === "Past") {
    risk += 20
    factors.push({
      name: "Smoking Cessation",
      impact: "High negative impact",
      suggestion: "If currently smoking, seek support for quitting through counseling or medication",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Smoking damages nearly every organ system and is linked to multiple chronic diseases. Quitting at any age provides immediate and long-term health benefits, with risk of heart disease dropping significantly within one year.",
    })
  }

  // Alcohol Consumption
  if (userData.alcoholConsumption === "High") {
    risk += 15
    factors.push({
      name: "Alcohol Reduction",
      impact: "High negative impact",
      suggestion: "Reduce alcohol consumption to no more than 1 drink daily for women or 2 for men",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Excessive alcohol consumption increases risk for liver disease, certain cancers, heart problems, and metabolic disorders. Consider tracking your intake, setting drink limits, or seeking support if reduction is challenging.",
    })
  } else if (userData.alcoholConsumption === "Moderate") {
    risk += 8
    factors.push({
      name: "Moderate Alcohol Management",
      impact: "Medium negative impact",
      suggestion: "Be mindful of alcohol consumption and consider alcohol-free days each week",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "moderate",
      details:
        "Even moderate alcohol consumption can impact health over time. Consider implementing several alcohol-free days each week and being mindful of serving sizes, as many people underestimate what constitutes a standard drink.",
    })
  }

  // Physical Inactivity
  if (userData.physicalInactivity === "Yes") {
    risk += 15
    factors.push({
      name: "Regular Physical Activity",
      impact: "High negative impact",
      suggestion: "Start with short daily walks and gradually increase activity level",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Physical inactivity is a major risk factor for chronic diseases including heart disease, diabetes, and certain cancers. Even modest increases in activity provide significant health benefits - aim for at least 150 minutes of moderate activity weekly.",
    })
  }

  // Unhealthy Diet
  if (userData.unhealthyDiet === "Yes") {
    risk += 15
    factors.push({
      name: "Dietary Pattern Improvement",
      impact: "High negative impact",
      suggestion: "Gradually shift toward a plant-focused diet with minimal processed foods",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Diet quality significantly impacts chronic disease risk. Focus on increasing vegetables, fruits, whole grains, and healthy proteins while reducing ultra-processed foods, added sugars, and unhealthy fats.",
    })
  }

  // BMI
  if (bmi > 30) {
    risk += 10
    factors.push({
      name: "Weight Management",
      impact: "Medium negative impact",
      suggestion: "Focus on sustainable lifestyle changes rather than rapid weight loss",
      timeframe: "medium-term",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Obesity increases risk for numerous chronic conditions including diabetes, heart disease, and certain cancers. Even modest weight loss of 5-10% can significantly improve health markers and reduce disease risk.",
    })
  }

  // Preventive Healthcare
  factors.push({
    name: "Regular Health Screenings",
    impact: "Medium positive impact",
    suggestion: "Schedule age-appropriate health screenings and preventive care visits",
    timeframe: "short-term",
    difficulty: "easy",
    evidence: "strong",
    details:
      "Regular screenings can detect conditions early when treatment is most effective. Common screenings include blood pressure, cholesterol, blood glucose, colorectal cancer, and for women, mammograms and cervical cancer screening.",
  })

  // Stress Management
  factors.push({
    name: "Chronic Stress Management",
    impact: "Medium negative impact",
    suggestion: "Develop regular stress reduction practices like meditation or deep breathing",
    timeframe: "short-term",
    difficulty: "moderate",
    evidence: "moderate",
    details:
      "Chronic stress contributes to inflammation and hormonal imbalances that increase chronic disease risk. Regular stress management practices help regulate stress hormones and reduce their negative impact on multiple body systems.",
  })

  risk = Math.min(risk, 100)

  return { risk, factors: factors.slice(0, 5) }
}
