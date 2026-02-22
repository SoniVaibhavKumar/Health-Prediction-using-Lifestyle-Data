"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import PremiumResultsPage from "./premium-results"
import { ResultsHeader } from "@/components/results-header"

// Default results for when user data is not available
const defaultResults = {
  cardiovascular: {
    risk: 28,
    factors: [
      { name: "Exercise", impact: "High positive impact", suggestion: "Continue your regular exercise routine" },
      { name: "Diet", impact: "Medium positive impact", suggestion: "Consider reducing sodium intake" },
      { name: "Sleep", impact: "Medium negative impact", suggestion: "Try to increase sleep duration by 1 hour" },
      { name: "Screen Time", impact: "Low negative impact", suggestion: "Reduce screen time before bed" },
      {
        name: "Family History",
        impact: "Medium negative impact",
        suggestion: "Regular cardiovascular checkups are recommended",
      },
    ],
  },
  metabolic: {
    risk: 42,
    factors: [
      { name: "Diet", impact: "Medium negative impact", suggestion: "Reduce processed carbohydrates" },
      { name: "Exercise", impact: "Medium positive impact", suggestion: "Add 2 more days of strength training" },
      { name: "Weight", impact: "Low negative impact", suggestion: "A 5% weight reduction would be beneficial" },
      { name: "Water Intake", impact: "Medium positive impact", suggestion: "Continue with good hydration habits" },
      {
        name: "Fast Food",
        impact: "Medium negative impact",
        suggestion: "Try to limit fast food to once per week",
      },
    ],
  },
  sleep: {
    risk: 35,
    factors: [
      { name: "Screen Time", impact: "High negative impact", suggestion: "Avoid screens 1 hour before bedtime" },
      { name: "Stress", impact: "Medium negative impact", suggestion: "Try meditation before sleep" },
      {
        name: "Exercise Timing",
        impact: "Low negative impact",
        suggestion: "Avoid intense exercise 3 hours before bed",
      },
      {
        name: "Sleep Environment",
        impact: "Medium positive impact",
        suggestion: "Maintain your comfortable sleep environment",
      },
      {
        name: "Sleep Consistency",
        impact: "Medium negative impact",
        suggestion: "Try to go to bed at the same time each night",
      },
    ],
  },
  mental: {
    risk: 22,
    factors: [
      {
        name: "Social Connection",
        impact: "High positive impact",
        suggestion: "Continue maintaining social connections",
      },
      {
        name: "Stress Management",
        impact: "Medium negative impact",
        suggestion: "Consider adding mindfulness practice",
      },
      {
        name: "Sleep",
        impact: "Medium negative impact",
        suggestion: "Improve sleep quality with a consistent schedule",
      },
      {
        name: "Outdoor Time",
        impact: "Medium positive impact",
        suggestion: "Your time outdoors benefits your mental health",
      },
      {
        name: "Physical Activity",
        impact: "High positive impact",
        suggestion: "Exercise is benefiting your mental health",
      },
    ],
  },
  immune: {
    risk: 30,
    factors: [
      {
        name: "Vaccination",
        impact: "High positive impact",
        suggestion: "Staying up-to-date with vaccinations strengthens your immune protection",
      },
      {
        name: "Sleep Quality",
        impact: "Medium negative impact",
        suggestion: "Poor sleep can weaken immune function; aim for 7-8 hours of quality sleep",
      },
      {
        name: "Stress Management",
        impact: "Medium negative impact",
        suggestion: "Chronic stress suppresses immune function; consider stress reduction techniques",
      },
      {
        name: "Nutrition",
        impact: "Medium positive impact",
        suggestion: "Continue consuming a variety of fruits and vegetables rich in antioxidants",
      },
      {
        name: "Physical Activity",
        impact: "Medium positive impact",
        suggestion: "Regular moderate exercise supports immune health",
      },
    ],
  },
  chronic: {
    risk: 38,
    factors: [
      {
        name: "Family History",
        impact: "High negative impact",
        suggestion: "With your family history, regular preventive screenings are essential",
      },
      {
        name: "Diet Quality",
        impact: "Medium negative impact",
        suggestion: "Reducing processed foods can lower chronic disease risk",
      },
      {
        name: "Physical Activity",
        impact: "Medium positive impact",
        suggestion: "Your activity level helps prevent chronic conditions",
      },
      {
        name: "Weight Management",
        impact: "Medium negative impact",
        suggestion: "Maintaining a healthy weight reduces risk of multiple chronic conditions",
      },
      {
        name: "Regular Checkups",
        impact: "High positive impact",
        suggestion: "Continue with regular health screenings for early detection",
      },
    ],
  },
}

export default function ResultsPage() {
  // Use refs to prevent re-renders
  const initialized = useRef(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const [resultsData, setResultsData] = useState<any>(null)

  // Initialize data only once
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Simulate loading progress regardless of data availability
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simulate API call to Python backend with the user data
    setTimeout(() => {
      // Get user data from URL parameters with better error handling
      const dataParam = searchParams.get("data")

      if (dataParam) {
        try {
          // Safely decode and parse the data
          const decodedData = decodeURIComponent(dataParam)
          if (decodedData && decodedData !== "undefined" && decodedData !== "null") {
            const parsedData = JSON.parse(decodedData)

            // Validate that parsedData is an object and not null
            if (parsedData && typeof parsedData === "object" && !Array.isArray(parsedData)) {
              setUserData(parsedData)
              console.log("Successfully parsed user data:", parsedData)

              // In a real app, you would call your prediction API here
              // For now, we'll use the default results
              setResultsData(defaultResults)
            } else {
              console.warn("Parsed data is not a valid object:", parsedData)
              throw new Error("Invalid data format")
            }
          } else {
            console.warn("Decoded data is empty or invalid:", decodedData)
            throw new Error("Empty or invalid data")
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
          toast({
            title: "Using sample data",
            description: "We couldn't process your specific data, so we're showing sample results.",
            variant: "default",
          })
          // Use default results if there's an error
          setUserData(null)
          setResultsData(defaultResults)
        }
      } else {
        console.log("No user data provided, using default results")
        // Use default results if no data is provided
        setUserData(null)
        setResultsData(defaultResults)
      }

      setLoading(false)
      clearInterval(interval)
    }, 2000)
  }, [searchParams, toast])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Analyzing Your Health Data</h1>
          <p className="text-muted-foreground mb-8">
            Please wait while we process your information and generate personalized insights...
          </p>

          <div className="w-full bg-muted rounded-full h-4 mb-6">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>

          <div className="flex flex-col items-center space-y-8 mt-12">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-muted h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Our AI is analyzing your data to provide personalized health insights...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Add this check before the return statement in the component
  if (!resultsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Results...</h1>
          <p className="text-muted-foreground">Please wait while we prepare your health insights.</p>
        </div>
      </div>
    )
  }

  // Render the premium results page
  return (
    <>
      <ResultsHeader />
      <PremiumResultsPage />
    </>
  )
}
