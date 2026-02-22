"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle, X } from "lucide-react"
import Link from "next/link"
import type { ValidationErrors } from "@/lib/validation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PredictPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    heightFeet: "",
    heightInches: "",
    exerciseFrequency: "",
    exerciseTypes: [] as string[],
    otherExerciseType: "",
    sleepHours: "",
    sleepQuality: "",
    dietType: "",
    waterIntake: "",
    stressLevel: "5",
    anxietyLevel: "5",
    anxietyFrequency: "",
    anxietyTriggers: [] as string[],
    otherAnxietyTrigger: "",
    smokingStatus: "",
    alcoholConsumption: "",
    fastFoodFrequency: "",
    screenTime: "",
    outdoorTime: "",
    familyHistory: [] as string[],
    existingConditions: [] as string[],
    chronicPain: "",
    painLevel: "",
    allergies: [] as string[],
    medications: [] as string[],
    bloodPressure: "",
    cholesterolLevels: "",
    bloodSugarLevel: "",
    lastCheckup: "",
    vaccinationStatus: "",
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [validationAttempted, setValidationAttempted] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [isFormValid, setIsFormValid] = useState(false)

  // Update the handleChange function for real-time validation
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Mark field as touched
    setTouchedFields((prev) => ({ ...prev, [field]: true }))

    // Clear error for this field when user makes a change
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Validate the field in real-time
    validateField(field, value)
  }

  // Handle checkbox changes for multi-select fields
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = [...((prev[field as keyof typeof prev] as string[]) || [])]

      if (checked) {
        // If "None of the above" is selected, clear other selections
        if (value === "none") {
          return { ...prev, [field]: ["none"] }
        }

        // If another option is selected, remove "None of the above" if present
        const newValues = currentValues.filter((v) => v !== "none")
        if (!newValues.includes(value)) {
          newValues.push(value)
        }
        return { ...prev, [field]: newValues }
      } else {
        return { ...prev, [field]: currentValues.filter((v) => v !== value) }
      }
    })

    // Mark field as touched
    setTouchedFields((prev) => ({ ...prev, [field]: true }))

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validate a single field
  const validateField = (field: string, value: any): boolean => {
    let isValid = true
    const newErrors: ValidationErrors = { ...errors }

    switch (field) {
      case "age":
        const ageValue = Number.parseInt(value as string)
        if (!value) {
          newErrors[field] = ["Age is required"]
          isValid = false
        } else if (isNaN(ageValue) || ageValue < 0 || ageValue > 114) {
          newErrors[field] = ["Please enter an age between 0 and 114."]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "gender":
        if (!value) {
          newErrors[field] = ["Gender is required"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "weight":
        const weightValue = Number.parseFloat(value as string)
        if (!value) {
          newErrors[field] = ["Weight is required"]
          isValid = false
        } else if (isNaN(weightValue) || weightValue < 2 || weightValue > 250) {
          newErrors[field] = ["Please enter a weight between 2 kg and 250 kg."]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "heightFeet":
      case "heightInches":
        const feet =
          field === "heightFeet" ? Number.parseInt(value as string) : Number.parseInt(formData.heightFeet as string)

        const inches =
          field === "heightInches" ? Number.parseInt(value as string) : Number.parseInt(formData.heightInches as string)

        if (field === "heightFeet" && (!value || isNaN(feet))) {
          newErrors["heightFeet"] = ["Height (feet) is required"]
          isValid = false
        } else if (field === "heightFeet" && (feet < 1 || feet > 8)) {
          newErrors["heightFeet"] = ["Feet must be between 1 and 8."]
          isValid = false
        } else if (field === "heightInches" && (value === "" || isNaN(inches))) {
          newErrors["heightInches"] = ["Height (inches) is required"]
          isValid = false
        } else if (field === "heightInches" && (inches < 0 || inches > 11)) {
          newErrors["heightInches"] = ["Inches must be between 0 and 11."]
          isValid = false
        } else if (!isNaN(feet) && !isNaN(inches)) {
          const totalInches = feet * 12 + inches
          if (totalInches < 18 || totalInches > 102) {
            newErrors[field] = ["Total height must be between 1′ 6″ and 8′ 6″."]
            isValid = false
          } else {
            delete newErrors["heightFeet"]
            delete newErrors["heightInches"]
          }
        }
        break

      case "exerciseFrequency":
        if (!value) {
          newErrors[field] = ["Exercise frequency is required"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "exerciseTypes":
        if (!Array.isArray(value) || value.length === 0) {
          newErrors[field] = ["Please select at least one exercise type"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "otherExerciseType":
        if (formData.exerciseTypes.includes("other") && !value) {
          newErrors[field] = ["Please specify your exercise type"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "sleepHours":
        const sleepValue = Number.parseFloat(value as string)
        if (!value) {
          newErrors[field] = ["Sleep hours is required"]
          isValid = false
        } else if (isNaN(sleepValue) || sleepValue < 0 || sleepValue > 24) {
          newErrors[field] = ["Please enter sleep hours between 0 and 24."]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "sleepQuality":
      case "dietType":
      case "waterIntake":
      case "fastFoodFrequency":
      case "screenTime":
      case "outdoorTime":
      case "smokingStatus":
      case "alcoholConsumption":
      case "anxietyFrequency":
      case "chronicPain":
      case "vaccinationStatus":
        if (!value) {
          newErrors[field] = [`${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "bloodSugarLevel":
        if (!value) {
          newErrors[field] = ["Blood sugar level is required"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "bloodPressure":
      case "cholesterolLevels":
      case "lastCheckup":
        if (!value) {
          newErrors[field] = [`${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "familyHistory":
      case "existingConditions":
        if (!Array.isArray(value) || value.length === 0) {
          newErrors[field] = ["Please select at least one option or 'None of the above'"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "anxietyTriggers":
        if (Number(formData.anxietyLevel) > 5 && (!Array.isArray(value) || value.length === 0)) {
          newErrors[field] = ["Please select at least one anxiety trigger or 'None'"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "otherAnxietyTrigger":
        if (formData.anxietyTriggers.includes("other") && !value) {
          newErrors[field] = ["Please specify your anxiety trigger"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      case "painLevel":
        if (formData.chronicPain === "yes" && !value) {
          newErrors[field] = ["Please rate your pain level"]
          isValid = false
        } else {
          delete newErrors[field]
        }
        break

      default:
        // For any other fields not explicitly handled
        if (typeof value === "string" && value.trim() === "") {
          newErrors[field] = [`${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`]
          isValid = false
        } else {
          delete newErrors[field]
        }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }))
    return isValid
  }

  const validateCurrentStep = (): boolean => {
    let fieldsToValidate: Record<string, any> = {}
    let isStepValid = true

    // Determine which fields to validate based on current step
    if (currentStep === 1) {
      fieldsToValidate = {
        age: formData.age,
        gender: formData.gender,
        weight: formData.weight,
        heightFeet: formData.heightFeet,
        heightInches: formData.heightInches,
        bloodPressure: formData.bloodPressure,
        cholesterolLevels: formData.cholesterolLevels,
        lastCheckup: formData.lastCheckup,
      }
    } else if (currentStep === 2) {
      fieldsToValidate = {
        exerciseFrequency: formData.exerciseFrequency,
        exerciseTypes: formData.exerciseTypes,
        sleepHours: formData.sleepHours,
        sleepQuality: formData.sleepQuality,
        dietType: formData.dietType,
        waterIntake: formData.waterIntake,
        fastFoodFrequency: formData.fastFoodFrequency,
        screenTime: formData.screenTime,
        outdoorTime: formData.outdoorTime,
      }

      // Validate "other" exercise type if selected
      if (formData.exerciseTypes.includes("other")) {
        fieldsToValidate.otherExerciseType = formData.otherExerciseType
      }
    } else if (currentStep === 3) {
      fieldsToValidate = {
        stressLevel: formData.stressLevel,
        anxietyLevel: formData.anxietyLevel,
        anxietyFrequency: formData.anxietyFrequency,
        smokingStatus: formData.smokingStatus,
        alcoholConsumption: formData.alcoholConsumption,
        bloodSugarLevel: formData.bloodSugarLevel,
        chronicPain: formData.chronicPain,
        familyHistory: formData.familyHistory,
        existingConditions: formData.existingConditions,
        vaccinationStatus: formData.vaccinationStatus,
      }

      // Only validate pain level if chronic pain is "yes"
      if (formData.chronicPain === "yes") {
        fieldsToValidate.painLevel = formData.painLevel
      }

      // Only validate anxiety triggers if anxiety level is high
      if (Number(formData.anxietyLevel) > 5) {
        fieldsToValidate.anxietyTriggers = formData.anxietyTriggers

        // Validate "other" anxiety trigger if selected
        if (formData.anxietyTriggers.includes("other")) {
          fieldsToValidate.otherAnxietyTrigger = formData.otherAnxietyTrigger
        }
      }
    }

    // Mark all fields in current step as touched
    const newTouchedFields = { ...touchedFields }
    Object.keys(fieldsToValidate).forEach((key) => {
      newTouchedFields[key] = true
    })
    setTouchedFields(newTouchedFields)

    // Validate each field
    Object.entries(fieldsToValidate).forEach(([key, value]) => {
      if (!validateField(key, value)) {
        isStepValid = false
      }
    })

    return isStepValid
  }

  // Check if the entire form is valid
  useEffect(() => {
    if (currentStep === 3 && submitAttempted) {
      const isValid = validateCurrentStep()
      setIsFormValid(isValid)
    }
  }, [formData, currentStep, submitAttempted])

  const nextStep = () => {
    setValidationAttempted(true)
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
      setValidationAttempted(false) // Reset for the next step
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Shake the form on validation error
      const form = document.querySelector("form")
      if (form) {
        form.classList.add("form-error-shake")
        setTimeout(() => {
          form.classList.remove("form-error-shake")
        }, 500)
      }
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Updated handleSubmit function with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    setValidationAttempted(true)

    // Validate current step first
    if (!validateCurrentStep()) {
      // Shake the form on validation error
      const form = document.querySelector("form")
      if (form) {
        form.classList.add("form-error-shake")
        setTimeout(() => {
          form.classList.remove("form-error-shake")
        }, 500)
      }
      return
    }

    setIsSubmitting(true)
    setGeneralError(null)

    try {
      // Convert height from feet/inches to cm for backend processing
      const heightInCm = calculateHeightInCm()

      // Create a copy of the form data with the calculated height in cm
      const processedData = {
        ...formData,
        height: heightInCm.toString(),
      }

      console.log("Proceeding to results with data:", processedData)

      // Navigate directly to results page with better error handling
      try {
        const dataString = JSON.stringify(processedData)
        const encodedData = encodeURIComponent(dataString)

        // Verify the encoding worked properly
        if (encodedData && encodedData !== "undefined") {
          console.log("Navigating to results with encoded data length:", encodedData.length)
          router.push(`/predict/results?data=${encodedData}`)
        } else {
          throw new Error("Failed to encode form data")
        }
      } catch (encodingError) {
        console.error("Error encoding form data:", encodingError)
        setGeneralError("There was an error processing your data. Please try again.")
        setIsSubmitting(false)
        return
      }
    } catch (error) {
      console.error("Error processing form data:", error)
      setGeneralError("There was an error processing your data. Please try again.")
      setIsSubmitting(false)
    }
  }

  const calculateHeightInCm = () => {
    const feet = Number.parseInt(formData.heightFeet as string) || 0
    const inches = Number.parseInt(formData.heightInches as string) || 0
    return Math.round(feet * 30.48 + inches * 2.54)
  }

  // Only show validation errors if the field has been touched or validation attempted
  const shouldShowError = (field: string) => {
    return (touchedFields[field] || validationAttempted || submitAttempted) && errors[field]
  }

  // Check if field is valid (for showing success state)
  const isFieldValid = (field: string) => {
    return touchedFields[field] && !errors[field] && formData[field as keyof typeof formData]
  }

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="bg-background border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0.9, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
                HealthPredict
              </h1>
            </Link>
          </motion.div>
          <div className="flex items-center space-x-4">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="font-medium text-foreground/80 hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="font-medium text-foreground/80 hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div className="max-w-3xl mx-auto" initial="hidden" animate="visible" variants={fadeInVariants}>
          <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
            Health Prediction Questionnaire
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Complete this questionnaire to receive your personalized health insights
          </p>

          <AnimatePresence>
            {generalError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="relative">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{generalError}</AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => setGeneralError(null)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <motion.button
                  key={step}
                  onClick={() => {
                    // Only allow going back to previous steps or current step
                    if (step <= currentStep) {
                      setCurrentStep(step)
                    }
                  }}
                  className={`flex-1 text-center py-2 rounded hover:bg-muted transition-colors ${
                    currentStep === step
                      ? "text-primary font-medium border-b-2 border-primary"
                      : step < currentStep
                        ? "text-foreground cursor-pointer"
                        : "text-muted-foreground cursor-not-allowed"
                  }`}
                  whileHover={{ scale: step <= currentStep ? 1.05 : 1 }}
                  whileTap={{ scale: step <= currentStep ? 0.95 : 1 }}
                >
                  {step === 1 && "Personal"}
                  {step === 2 && "Lifestyle"}
                  {step === 3 && "Medical"}
                </motion.button>
              ))}
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 mt-2">
              <motion.div
                className="bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 h-2.5 rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400"></div>
                <CardHeader className="bg-card border-b border-border">
                  <CardTitle className="flex items-center">
                    {currentStep === 1 && (
                      <>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-primary font-bold">1</span>
                        </div>
                        Personal & Physical Health
                      </>
                    )}
                    {currentStep === 2 && (
                      <>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-primary font-bold">2</span>
                        </div>
                        Lifestyle Habits
                      </>
                    )}
                    {currentStep === 3 && (
                      <>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-primary font-bold">3</span>
                        </div>
                        Medical History & Health Behaviors
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 && "Please provide your basic information and physical health metrics"}
                    {currentStep === 2 && "Tell us about your daily activities and lifestyle habits"}
                    {currentStep === 3 && "Share your medical history and health-related behaviors"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Label htmlFor="age" className={shouldShowError("age") ? "text-destructive" : ""}>
                            Age
                          </Label>
                          <Input
                            id="age"
                            type="number"
                            min="0"
                            max="114"
                            placeholder="Enter your age"
                            value={formData.age}
                            onChange={(e) => handleChange("age", e.target.value)}
                            className={`${shouldShowError("age") ? "border-destructive" : ""} 
                                       ${isFieldValid("age") ? "border-green-500 dark:border-green-400" : ""}`}
                          />
                          {shouldShowError("age") && <p className="text-sm text-destructive mt-1">{errors.age?.[0]}</p>}
                          {isFieldValid("age") && (
                            <p className="text-sm text-green-500 dark:text-green-400 mt-1">Age looks good!</p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Label htmlFor="gender" className={shouldShowError("gender") ? "text-destructive" : ""}>
                            Gender
                          </Label>
                          <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                            <SelectTrigger
                              className={`${shouldShowError("gender") ? "border-destructive" : ""} 
                                         ${isFieldValid("gender") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("gender") && (
                            <p className="text-sm text-destructive mt-1">{errors.gender?.[0]}</p>
                          )}
                          {isFieldValid("gender") && (
                            <p className="text-sm text-green-500 dark:text-green-400 mt-1">Gender selected</p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Label htmlFor="weight" className={shouldShowError("weight") ? "text-destructive" : ""}>
                            Weight (kg)
                          </Label>
                          <Input
                            id="weight"
                            type="number"
                            min="2"
                            max="250"
                            step="0.1"
                            placeholder="Enter your weight in kg"
                            value={formData.weight}
                            onChange={(e) => handleChange("weight", e.target.value)}
                            className={`${shouldShowError("weight") ? "border-destructive" : ""} 
                                       ${isFieldValid("weight") ? "border-green-500 dark:border-green-400" : ""}`}
                          />
                          {shouldShowError("weight") && (
                            <p className="text-sm text-destructive mt-1">{errors.weight?.[0]}</p>
                          )}
                          {isFieldValid("weight") && (
                            <p className="text-sm text-green-500 dark:text-green-400 mt-1">Weight looks good!</p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label
                            className={
                              shouldShowError("heightFeet") || shouldShowError("heightInches") ? "text-destructive" : ""
                            }
                          >
                            Height
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Input
                                id="heightFeet"
                                type="number"
                                min="1"
                                max="8"
                                placeholder="Feet"
                                value={formData.heightFeet}
                                onChange={(e) => handleChange("heightFeet", e.target.value)}
                                className={`${shouldShowError("heightFeet") ? "border-destructive" : ""} 
                                           ${isFieldValid("heightFeet") && !shouldShowError("heightInches") ? "border-green-500 dark:border-green-400" : ""}`}
                              />
                            </div>
                            <div>
                              <Input
                                id="heightInches"
                                type="number"
                                min="0"
                                max="11"
                                placeholder="Inches"
                                value={formData.heightInches}
                                onChange={(e) => handleChange("heightInches", e.target.value)}
                                className={`${shouldShowError("heightInches") ? "border-destructive" : ""} 
                                           ${isFieldValid("heightInches") && !shouldShowError("heightFeet") ? "border-green-500 dark:border-green-400" : ""}`}
                              />
                            </div>
                          </div>
                          {shouldShowError("heightFeet") && (
                            <p className="text-sm text-destructive mt-1">{errors.heightFeet?.[0]}</p>
                          )}
                          {shouldShowError("heightInches") && (
                            <p className="text-sm text-destructive mt-1">{errors.heightInches?.[0]}</p>
                          )}
                          {isFieldValid("heightFeet") && isFieldValid("heightInches") && (
                            <p className="text-sm text-green-500 dark:text-green-400 mt-1">Height looks good!</p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Label
                            htmlFor="bloodPressure"
                            className={shouldShowError("bloodPressure") ? "text-destructive" : ""}
                          >
                            Blood Pressure
                          </Label>
                          <Select
                            value={formData.bloodPressure}
                            onValueChange={(value) => handleChange("bloodPressure", value)}
                          >
                            <SelectTrigger
                              className={`${shouldShowError("bloodPressure") ? "border-destructive" : ""} 
                                         ${isFieldValid("bloodPressure") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Select blood pressure" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal (120/80 or lower)</SelectItem>
                              <SelectItem value="elevated">Elevated (120-129/80)</SelectItem>
                              <SelectItem value="stage1">Stage 1 Hypertension (130-139/80-89)</SelectItem>
                              <SelectItem value="stage2">Stage 2 Hypertension (140+/90+)</SelectItem>
                              <SelectItem value="low">Low Blood Pressure</SelectItem>
                              <SelectItem value="unknown">Don't know</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("bloodPressure") && (
                            <p className="text-sm text-destructive mt-1">{errors.bloodPressure?.[0]}</p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Label
                            htmlFor="cholesterolLevels"
                            className={shouldShowError("cholesterolLevels") ? "text-destructive" : ""}
                          >
                            Cholesterol Levels
                          </Label>
                          <Select
                            value={formData.cholesterolLevels}
                            onValueChange={(value) => handleChange("cholesterolLevels", value)}
                          >
                            <SelectTrigger
                              className={`${shouldShowError("cholesterolLevels") ? "border-destructive" : ""} 
                                         ${isFieldValid("cholesterolLevels") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Select cholesterol level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="borderline">Borderline High</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="very-high">Very High</SelectItem>
                              <SelectItem value="unknown">Don't know</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("cholesterolLevels") && (
                            <p className="text-sm text-destructive mt-1">{errors.cholesterolLevels?.[0]}</p>
                          )}
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label
                          htmlFor="lastCheckup"
                          className={shouldShowError("lastCheckup") ? "text-destructive" : ""}
                        >
                          Last Medical Checkup
                        </Label>
                        <Select
                          value={formData.lastCheckup}
                          onValueChange={(value) => handleChange("lastCheckup", value)}
                        >
                          <SelectTrigger
                            className={`${shouldShowError("lastCheckup") ? "border-destructive" : ""} 
                                       ${isFieldValid("lastCheckup") ? "border-green-500 dark:border-green-400" : ""}`}
                          >
                            <SelectValue placeholder="When was your last checkup?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less-than-6-months">Less than 6 months ago</SelectItem>
                            <SelectItem value="6-12-months">6-12 months ago</SelectItem>
                            <SelectItem value="1-2-years">1-2 years ago</SelectItem>
                            <SelectItem value="2-5-years">2-5 years ago</SelectItem>
                            <SelectItem value="more-than-5-years">More than 5 years ago</SelectItem>
                            <SelectItem value="never">Never had a checkup</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("lastCheckup") && (
                          <p className="text-sm text-destructive mt-1">{errors.lastCheckup?.[0]}</p>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label
                          htmlFor="exerciseFrequency"
                          className={shouldShowError("exerciseFrequency") ? "text-destructive" : ""}
                        >
                          Exercise Frequency
                        </Label>
                        <Select
                          value={formData.exerciseFrequency}
                          onValueChange={(value) => handleChange("exerciseFrequency", value)}
                        >
                          <SelectTrigger
                            className={`${shouldShowError("exerciseFrequency") ? "border-destructive" : ""} 
                                       ${isFieldValid("exerciseFrequency") ? "border-green-500 dark:border-green-400" : ""}`}
                          >
                            <SelectValue placeholder="How often do you exercise?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="4-6-times-week">4-6 times per week</SelectItem>
                            <SelectItem value="2-3-times-week">2-3 times per week</SelectItem>
                            <SelectItem value="once-week">Once per week</SelectItem>
                            <SelectItem value="rarely">Rarely</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("exerciseFrequency") && (
                          <p className="text-sm text-destructive mt-1">{errors.exerciseFrequency?.[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label className={shouldShowError("exerciseTypes") ? "text-destructive" : ""}>
                          Exercise Types
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["cardio", "strength", "flexibility", "sports", "walking", "other", "none"].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`exercise-${type}`}
                                checked={formData.exerciseTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  handleCheckboxChange("exerciseTypes", type, checked === true)
                                }}
                              />
                              <Label htmlFor={`exercise-${type}`} className="cursor-pointer">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                {type === "none" && " of the above"}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {formData.exerciseTypes.includes("other") && (
                          <Input
                            placeholder="Specify other exercise type"
                            value={formData.otherExerciseType}
                            onChange={(e) => handleChange("otherExerciseType", e.target.value)}
                            className={shouldShowError("otherExerciseType") ? "border-destructive mt-2" : "mt-2"}
                          />
                        )}
                        {shouldShowError("exerciseTypes") && (
                          <p className="text-sm text-destructive mt-1">{errors.exerciseTypes?.[0]}</p>
                        )}
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Label
                            htmlFor="sleepHours"
                            className={shouldShowError("sleepHours") ? "text-destructive" : ""}
                          >
                            Sleep Hours (per night)
                          </Label>
                          <Input
                            id="sleepHours"
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            placeholder="Hours of sleep per night"
                            value={formData.sleepHours}
                            onChange={(e) => handleChange("sleepHours", e.target.value)}
                            className={`${shouldShowError("sleepHours") ? "border-destructive" : ""} 
                                       ${isFieldValid("sleepHours") ? "border-green-500 dark:border-green-400" : ""}`}
                          />
                          {shouldShowError("sleepHours") && (
                            <p className="text-sm text-destructive mt-1">{errors.sleepHours?.[0]}</p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label
                            htmlFor="sleepQuality"
                            className={shouldShowError("sleepQuality") ? "text-destructive" : ""}
                          >
                            Sleep Quality
                          </Label>
                          <Select
                            value={formData.sleepQuality}
                            onValueChange={(value) => handleChange("sleepQuality", value)}
                          >
                            <SelectTrigger
                              className={`${shouldShowError("sleepQuality") ? "border-destructive" : ""} 
                                         ${isFieldValid("sleepQuality") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Rate your sleep quality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                              <SelectItem value="very-poor">Very Poor</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("sleepQuality") && (
                            <p className="text-sm text-destructive mt-1">{errors.sleepQuality?.[0]}</p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Label htmlFor="dietType" className={shouldShowError("dietType") ? "text-destructive" : ""}>
                            Diet Type
                          </Label>
                          <Select value={formData.dietType} onValueChange={(value) => handleChange("dietType", value)}>
                            <SelectTrigger
                              className={`${shouldShowError("dietType") ? "border-destructive" : ""} 
                                         ${isFieldValid("dietType") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Select your diet type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="omnivore">Omnivore (Meat & Plants)</SelectItem>
                              <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="vegan">Vegan</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="dont-know">Don't know</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("dietType") && (
                            <p className="text-sm text-destructive mt-1">{errors.dietType?.[0]}</p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Label
                            htmlFor="waterIntake"
                            className={shouldShowError("waterIntake") ? "text-destructive" : ""}
                          >
                            Water Intake
                          </Label>
                          <Select
                            value={formData.waterIntake}
                            onValueChange={(value) => handleChange("waterIntake", value)}
                          >
                            <SelectTrigger
                              className={`${shouldShowError("waterIntake") ? "border-destructive" : ""} 
                                         ${isFieldValid("waterIntake") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Daily water consumption" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="less-than-1L">Less than 1 liter</SelectItem>
                              <SelectItem value="1-2L">1-2 liters</SelectItem>
                              <SelectItem value="2-3L">2-3 liters</SelectItem>
                              <SelectItem value="more-than-3L">More than 3 liters</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("waterIntake") && (
                            <p className="text-sm text-destructive mt-1">{errors.waterIntake?.[0]}</p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Label
                            htmlFor="fastFoodFrequency"
                            className={shouldShowError("fastFoodFrequency") ? "text-destructive" : ""}
                          >
                            Fast Food Consumption
                          </Label>
                          <Select
                            value={formData.fastFoodFrequency}
                            onValueChange={(value) => handleChange("fastFoodFrequency", value)}
                          >
                            <SelectTrigger
                              className={`${shouldShowError("fastFoodFrequency") ? "border-destructive" : ""} 
                                         ${isFieldValid("fastFoodFrequency") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="How often do you eat fast food?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="several-times-week">Several times a week</SelectItem>
                              <SelectItem value="once-week">Once a week</SelectItem>
                              <SelectItem value="few-times-month">A few times a month</SelectItem>
                              <SelectItem value="rarely">Rarely</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("fastFoodFrequency") && (
                            <p className="text-sm text-destructive mt-1">{errors.fastFoodFrequency?.[0]}</p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <Label
                            htmlFor="screenTime"
                            className={shouldShowError("screenTime") ? "text-destructive" : ""}
                          >
                            Daily Screen Time
                          </Label>
                          <Select
                            value={formData.screenTime}
                            onValueChange={(value) => handleChange("screenTime", value)}
                          >
                            <SelectTrigger
                              className={`${shouldShowError("screenTime") ? "border-destructive" : ""} 
                                         ${isFieldValid("screenTime") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Hours spent on screens daily" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="less-than-1">Less than 1 hour</SelectItem>
                              <SelectItem value="1-3">1-3 hours</SelectItem>
                              <SelectItem value="4-6">4-6 hours</SelectItem>
                              <SelectItem value="7-9">7-9 hours</SelectItem>
                              <SelectItem value="more-than-9">More than 9 hours</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("screenTime") && (
                            <p className="text-sm text-destructive mt-1">{errors.screenTime?.[0]}</p>
                          )}
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <Label
                          htmlFor="outdoorTime"
                          className={shouldShowError("outdoorTime") ? "text-destructive" : ""}
                        >
                          Time Spent Outdoors
                        </Label>
                        <Select
                          value={formData.outdoorTime}
                          onValueChange={(value) => handleChange("outdoorTime", value)}
                        >
                          <SelectTrigger
                            className={`${shouldShowError("outdoorTime") ? "border-destructive" : ""} 
                                       ${isFieldValid("outdoorTime") ? "border-green-500 dark:border-green-400" : ""}`}
                          >
                            <SelectValue placeholder="Hours spent outdoors daily" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less-than-30min">Less than 30 minutes</SelectItem>
                            <SelectItem value="30min-1hour">30 minutes - 1 hour</SelectItem>
                            <SelectItem value="1-2hours">1-2 hours</SelectItem>
                            <SelectItem value="2-4hours">2-4 hours</SelectItem>
                            <SelectItem value="more-than-4hours">More than 4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("outdoorTime") && (
                          <p className="text-sm text-destructive mt-1">{errors.outdoorTime?.[0]}</p>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Label
                            htmlFor="stressLevel"
                            className={shouldShowError("stressLevel") ? "text-destructive" : ""}
                          >
                            Stress Level (1-10)
                          </Label>
                          <div className="pt-2 px-1">
                            <Slider
                              id="stressLevel"
                              min={1}
                              max={10}
                              step={1}
                              value={[Number.parseInt(formData.stressLevel)]}
                              onValueChange={(value) => handleChange("stressLevel", value[0].toString())}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <span>Low (1)</span>
                              <span>Moderate (5)</span>
                              <span>High (10)</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">
                            Your stress level: <span className="font-medium">{formData.stressLevel}</span>
                          </p>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Label
                            htmlFor="anxietyLevel"
                            className={shouldShowError("anxietyLevel") ? "text-destructive" : ""}
                          >
                            Anxiety Level (1-10)
                          </Label>
                          <div className="pt-2 px-1">
                            <Slider
                              id="anxietyLevel"
                              min={1}
                              max={10}
                              step={1}
                              value={[Number.parseInt(formData.anxietyLevel)]}
                              onValueChange={(value) => handleChange("anxietyLevel", value[0].toString())}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <span>Low (1)</span>
                              <span>Moderate (5)</span>
                              <span>High (10)</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">
                            Your anxiety level: <span className="font-medium">{formData.anxietyLevel}</span>
                          </p>
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label
                          htmlFor="anxietyFrequency"
                          className={shouldShowError("anxietyFrequency") ? "text-destructive" : ""}
                        >
                          Anxiety Frequency
                        </Label>
                        <Select
                          value={formData.anxietyFrequency}
                          onValueChange={(value) => handleChange("anxietyFrequency", value)}
                        >
                          <SelectTrigger
                            className={`${shouldShowError("anxietyFrequency") ? "border-destructive" : ""} 
                                       ${isFieldValid("anxietyFrequency") ? "border-green-500 dark:border-green-400" : ""}`}
                          >
                            <SelectValue placeholder="How often do you experience anxiety?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="several-times-week">Several times a week</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="rarely">Rarely</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("anxietyFrequency") && (
                          <p className="text-sm text-destructive mt-1">{errors.anxietyFrequency?.[0]}</p>
                        )}
                      </motion.div>

                      {Number(formData.anxietyLevel) > 5 && (
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label className={shouldShowError("anxietyTriggers") ? "text-destructive" : ""}>
                            Anxiety Triggers
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {["work", "social", "health", "financial", "family", "other", "none"].map((trigger) => (
                              <div key={trigger} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`anxiety-${trigger}`}
                                  checked={formData.anxietyTriggers.includes(trigger)}
                                  onCheckedChange={(checked) => {
                                    handleCheckboxChange("anxietyTriggers", trigger, checked === true)
                                  }}
                                />
                                <Label htmlFor={`anxiety-${trigger}`} className="cursor-pointer">
                                  {trigger.charAt(0).toUpperCase() + trigger.slice(1)}
                                  {trigger === "none" && " (rarely anxious)"}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {formData.anxietyTriggers.includes("other") && (
                            <Input
                              placeholder="Specify other anxiety trigger"
                              value={formData.otherAnxietyTrigger}
                              onChange={(e) => handleChange("otherAnxietyTrigger", e.target.value)}
                              className={shouldShowError("otherAnxietyTrigger") ? "border-destructive mt-2" : "mt-2"}
                            />
                          )}
                          {shouldShowError("anxietyTriggers") && (
                            <p className="text-sm text-destructive mt-1">{errors.anxietyTriggers?.[0]}</p>
                          )}
                          {shouldShowError("otherAnxietyTrigger") && (
                            <p className="text-sm text-destructive mt-1">{errors.otherAnxietyTrigger?.[0]}</p>
                          )}
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Label
                            htmlFor="smokingStatus"
                            className={shouldShowError("smokingStatus") ? "text-destructive" : ""}
                          >
                            Smoking Status
                          </Label>
                          <Select
                            value={formData.smokingStatus}
                            onValueChange={(value) => handleChange("smokingStatus", value)}
                          >
                            <SelectTrigger
                              className={`${shouldShowError("smokingStatus") ? "border-destructive" : ""} 
                                         ${isFieldValid("smokingStatus") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Select smoking status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never smoked</SelectItem>
                              <SelectItem value="former">Former smoker</SelectItem>
                              <SelectItem value="occasional">Occasional smoker</SelectItem>
                              <SelectItem value="regular">Regular smoker</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("smokingStatus") && (
                            <p className="text-sm text-destructive mt-1">{errors.smokingStatus?.[0]}</p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Label
                            htmlFor="alcoholConsumption"
                            className={shouldShowError("alcoholConsumption") ? "text-destructive" : ""}
                          >
                            Alcohol Consumption
                          </Label>
                          <Select
                            value={formData.alcoholConsumption}
                            onValueChange={(value) => handleChange("alcoholConsumption", value)}
                          >
                            <SelectTrigger
                              className={`${shouldShowError("alcoholConsumption") ? "border-destructive" : ""} 
                                         ${isFieldValid("alcoholConsumption") ? "border-green-500 dark:border-green-400" : ""}`}
                            >
                              <SelectValue placeholder="Select alcohol consumption" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never</SelectItem>
                              <SelectItem value="rarely">Rarely</SelectItem>
                              <SelectItem value="occasionally">Occasionally</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("alcoholConsumption") && (
                            <p className="text-sm text-destructive mt-1">{errors.alcoholConsumption?.[0]}</p>
                          )}
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label
                          htmlFor="bloodSugarLevel"
                          className={shouldShowError("bloodSugarLevel") ? "text-destructive" : ""}
                        >
                          Blood Sugar Level
                        </Label>
                        <Select
                          value={formData.bloodSugarLevel}
                          onValueChange={(value) => handleChange("bloodSugarLevel", value)}
                        >
                          <SelectTrigger
                            className={`${shouldShowError("bloodSugarLevel") ? "border-destructive" : ""} 
                                       ${isFieldValid("bloodSugarLevel") ? "border-green-500 dark:border-green-400" : ""}`}
                          >
                            <SelectValue placeholder="Select your blood sugar level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="70-100">Normal Fasting (70-100 mg/dL)</SelectItem>
                            <SelectItem value="101-125">Prediabetes Fasting (101-125 mg/dL)</SelectItem>
                            <SelectItem value="126+">Diabetes Fasting (126+ mg/dL)</SelectItem>
                            <SelectItem value="less-than-140">Normal After Eating (Less than 140 mg/dL)</SelectItem>
                            <SelectItem value="140-199">Prediabetes After Eating (140-199 mg/dL)</SelectItem>
                            <SelectItem value="200+">Diabetes After Eating (200+ mg/dL)</SelectItem>
                            <SelectItem value="dont-know">Don't know</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("bloodSugarLevel") && (
                          <p className="text-sm text-destructive mt-1">{errors.bloodSugarLevel?.[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Label
                          htmlFor="chronicPain"
                          className={shouldShowError("chronicPain") ? "text-destructive" : ""}
                        >
                          Do you experience chronic pain?
                        </Label>
                        <RadioGroup
                          value={formData.chronicPain}
                          onValueChange={(value) => handleChange("chronicPain", value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="pain-yes" />
                            <Label htmlFor="pain-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="pain-no" />
                            <Label htmlFor="pain-no">No</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("chronicPain") && (
                          <p className="text-sm text-destructive mt-1">{errors.chronicPain?.[0]}</p>
                        )}
                      </motion.div>

                      {formData.chronicPain === "yes" && (
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                        >
                          <Label htmlFor="painLevel" className={shouldShowError("painLevel") ? "text-destructive" : ""}>
                            Pain Level (1-10)
                          </Label>
                          <div className="pt-2 px-1">
                            <Slider
                              id="painLevel"
                              min={1}
                              max={10}
                              step={1}
                              value={[Number.parseInt(formData.painLevel || "1")]}
                              onValueChange={(value) => handleChange("painLevel", value[0].toString())}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <span>Mild (1)</span>
                              <span>Moderate (5)</span>
                              <span>Severe (10)</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">
                            Your pain level: <span className="font-medium">{formData.painLevel || "1"}</span>
                          </p>
                          {shouldShowError("painLevel") && (
                            <p className="text-sm text-destructive mt-1">{errors.painLevel?.[0]}</p>
                          )}
                        </motion.div>
                      )}

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                      >
                        <Label className={shouldShowError("familyHistory") ? "text-destructive" : ""}>
                          Family History
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "heart-disease",
                            "diabetes",
                            "cancer",
                            "hypertension",
                            "stroke",
                            "mental-health",
                            "respiratory",
                            "none",
                          ].map((condition) => (
                            <div key={condition} className="flex items-center space-x-2">
                              <Checkbox
                                id={`family-${condition}`}
                                checked={formData.familyHistory.includes(condition)}
                                onCheckedChange={(checked) => {
                                  handleCheckboxChange("familyHistory", condition, checked === true)
                                }}
                              />
                              <Label htmlFor={`family-${condition}`} className="cursor-pointer">
                                {condition === "heart-disease" && "Heart Disease"}
                                {condition === "diabetes" && "Diabetes"}
                                {condition === "cancer" && "Cancer"}
                                {condition === "hypertension" && "Hypertension"}
                                {condition === "stroke" && "Stroke"}
                                {condition === "mental-health" && "Mental Health Disorders"}
                                {condition === "respiratory" && "Respiratory Diseases"}
                                {condition === "none" && "None of the above"}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {shouldShowError("familyHistory") && (
                          <p className="text-sm text-destructive mt-1">{errors.familyHistory?.[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <Label className={shouldShowError("existingConditions") ? "text-destructive" : ""}>
                          Existing Medical Conditions
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "heart-disease",
                            "diabetes",
                            "hypertension",
                            "asthma",
                            "arthritis",
                            "thyroid",
                            "mental-health",
                            "none",
                          ].map((condition) => (
                            <div key={condition} className="flex items-center space-x-2">
                              <Checkbox
                                id={`condition-${condition}`}
                                checked={formData.existingConditions.includes(condition)}
                                onCheckedChange={(checked) => {
                                  handleCheckboxChange("existingConditions", condition, checked === true)
                                }}
                              />
                              <Label htmlFor={`condition-${condition}`} className="cursor-pointer">
                                {condition === "heart-disease" && "Heart Disease"}
                                {condition === "diabetes" && "Diabetes"}
                                {condition === "hypertension" && "Hypertension"}
                                {condition === "asthma" && "Asthma"}
                                {condition === "arthritis" && "Arthritis"}
                                {condition === "thyroid" && "Thyroid Disorder"}
                                {condition === "mental-health" && "Mental Health Disorder"}
                                {condition === "none" && "None of the above"}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {shouldShowError("existingConditions") && (
                          <p className="text-sm text-destructive mt-1">{errors.existingConditions?.[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <Label
                          htmlFor="vaccinationStatus"
                          className={shouldShowError("vaccinationStatus") ? "text-destructive" : ""}
                        >
                          Vaccination Status
                        </Label>
                        <Select
                          value={formData.vaccinationStatus}
                          onValueChange={(value) => handleChange("vaccinationStatus", value)}
                        >
                          <SelectTrigger
                            className={`${shouldShowError("vaccinationStatus") ? "border-destructive" : ""} 
                                       ${isFieldValid("vaccinationStatus") ? "border-green-500 dark:border-green-400" : ""}`}
                          >
                            <SelectValue placeholder="Select vaccination status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fully-vaccinated">Fully vaccinated (including boosters)</SelectItem>
                            <SelectItem value="partially-vaccinated">Partially vaccinated</SelectItem>
                            <SelectItem value="not-vaccinated">Not vaccinated</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("vaccinationStatus") && (
                          <p className="text-sm text-destructive mt-1">{errors.vaccinationStatus?.[0]}</p>
                        )}
                      </motion.div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/30 border-t border-border p-6 mt-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="border-border hover:bg-muted transition-all duration-300"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                  </motion.div>
                  {currentStep < 3 ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 hover:from-primary/90 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 hover:from-primary/90 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            Get Prediction <CheckCircle className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
