import { type NextRequest, NextResponse } from "next/server"

// Enhanced prediction API with more accurate health risk calculations
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the input data
    if (!data.age || !data.gender || !data.weight || !data.height) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate BMI
    const heightInM = Number.parseFloat(data.height) / 100
    const bmi = Number.parseFloat(data.weight) / (heightInM * heightInM)

    // Enhanced risk calculation functions based on medical literature
    const predictions = {
      cardiovascular: calculateEnhancedCardiovascularRisk(data, bmi),
      metabolic: calculateEnhancedMetabolicRisk(data, bmi),
      sleep: calculateEnhancedSleepRisk(data),
      mental: calculateEnhancedMentalRisk(data),
      immune: calculateEnhancedImmuneRisk(data),
      chronic: calculateEnhancedChronicRisk(data, bmi),
    }

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Error processing prediction:", error)
    return NextResponse.json({ error: "Failed to process prediction" }, { status: 500 })
  }
}

function calculateEnhancedCardiovascularRisk(data: any, bmi: number) {
  let risk = 0
  const factors = []

  // Age factor (Framingham-based)
  const age = Number.parseInt(data.age)
  if (age >= 65) {
    risk += 25
    factors.push({
      name: "Advanced Age",
      impact: "High negative impact",
      suggestion: "Regular cardiovascular monitoring and preventive care are essential at your age",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Age is the strongest predictor of cardiovascular disease. After 65, risk increases significantly due to arterial stiffening and accumulated damage.",
    })
  } else if (age >= 55) {
    risk += 15
    factors.push({
      name: "Age-Related Risk",
      impact: "Medium negative impact",
      suggestion: "Begin more frequent cardiovascular health monitoring",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Cardiovascular risk begins to increase significantly after age 55, making prevention strategies more important.",
    })
  } else if (age >= 45) {
    risk += 8
  }

  // Gender and age interaction
  if (data.gender === "male" && age >= 45) {
    risk += 8
    factors.push({
      name: "Male Gender Risk",
      impact: "Medium negative impact",
      suggestion: "Men have higher cardiovascular risk at younger ages - focus on prevention",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Men develop cardiovascular disease 7-10 years earlier than women on average, making early prevention crucial.",
    })
  } else if (data.gender === "female" && age >= 55) {
    risk += 6
    factors.push({
      name: "Post-Menopausal Risk",
      impact: "Medium negative impact",
      suggestion: "Post-menopausal women have increased cardiovascular risk - discuss hormone therapy with your doctor",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "After menopause, women's cardiovascular risk increases due to hormonal changes affecting cholesterol and blood pressure.",
    })
  }

  // BMI factor
  if (bmi >= 35) {
    risk += 15
    factors.push({
      name: "Severe Obesity",
      impact: "High negative impact",
      suggestion: "Urgent weight management needed - consider medical supervision for weight loss",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Severe obesity (BMI ≥35) significantly increases cardiovascular risk through multiple mechanisms including hypertension, diabetes, and inflammation.",
    })
  } else if (bmi >= 30) {
    risk += 10
    factors.push({
      name: "Obesity",
      impact: "Medium negative impact",
      suggestion: "Aim for 5-10% weight reduction through diet and exercise",
      timeframe: "medium-term",
      difficulty: "challenging",
      evidence: "strong",
      details: "Even modest weight loss of 5-10% can significantly reduce cardiovascular risk factors.",
    })
  } else if (bmi >= 25) {
    risk += 5
  }

  // Blood pressure (major risk factor)
  const bpRisk = {
    normal: 0,
    elevated: 5,
    stage1: 12,
    stage2: 20,
    low: 0,
    unknown: 5,
  }
  const bpScore = bpRisk[data.bloodPressure as keyof typeof bpRisk] || 0
  risk += bpScore

  if (bpScore >= 12) {
    factors.push({
      name: "High Blood Pressure",
      impact: "High negative impact",
      suggestion: "Immediate medical attention needed for blood pressure management",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "High blood pressure is a major modifiable risk factor. Treatment can reduce cardiovascular events by 20-25%.",
    })
  } else if (bpScore >= 5) {
    factors.push({
      name: "Elevated Blood Pressure",
      impact: "Medium negative impact",
      suggestion: "Lifestyle modifications to prevent progression to hypertension",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Elevated blood pressure often progresses to hypertension. Early intervention can prevent this progression.",
    })
  }

  // Cholesterol
  const cholRisk = {
    normal: 0,
    borderline: 8,
    high: 15,
    "very-high": 20,
    unknown: 5,
  }
  const cholScore = cholRisk[data.cholesterolLevels as keyof typeof cholRisk] || 0
  risk += cholScore

  if (cholScore >= 15) {
    factors.push({
      name: "High Cholesterol",
      impact: "High negative impact",
      suggestion: "Consider statin therapy and intensive dietary changes",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "High cholesterol contributes to atherosclerosis. Statin therapy can reduce cardiovascular events by 25-35%.",
    })
  }

  // Smoking (major modifiable risk factor)
  const smokingRisk = {
    never: 0,
    former: 5,
    occasional: 12,
    regular: 20,
  }
  const smokingScore = smokingRisk[data.smokingStatus as keyof typeof smokingRisk] || 0
  risk += smokingScore

  if (smokingScore >= 12) {
    factors.push({
      name: "Smoking Cessation",
      impact: "High negative impact",
      suggestion: "Quit smoking immediately - consider nicotine replacement therapy",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details: "Smoking increases cardiovascular risk by 2-4 times. Quitting reduces risk by 50% within one year.",
    })
  }

  // Diabetes/Blood sugar
  if (
    data.bloodSugarLevel === "126+" ||
    data.bloodSugarLevel === "200+" ||
    (data.existingConditions && data.existingConditions.includes("diabetes"))
  ) {
    risk += 18
    factors.push({
      name: "Diabetes Management",
      impact: "High negative impact",
      suggestion: "Strict diabetes management with HbA1c target <7% for most patients",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Diabetes increases cardiovascular risk by 2-4 times. Good glycemic control can reduce cardiovascular complications by 42%.",
    })
  } else if (data.bloodSugarLevel === "101-125" || data.bloodSugarLevel === "140-199") {
    risk += 8
    factors.push({
      name: "Prediabetes Management",
      impact: "Medium negative impact",
      suggestion: "Lifestyle intervention to prevent progression to diabetes",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Prediabetes significantly increases cardiovascular risk. Lifestyle interventions can reduce diabetes risk by 58%.",
    })
  }

  // Family history
  if (data.familyHistory && data.familyHistory.includes("heart-disease")) {
    risk += 10
    factors.push({
      name: "Family History of Heart Disease",
      impact: "Medium negative impact",
      suggestion: "Earlier and more frequent cardiovascular screening recommended",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Family history of premature heart disease doubles your risk. Screening should begin 10 years earlier than the age of affected family member.",
    })
  }

  // Exercise (protective factor)
  const exerciseFreq = data.exerciseFrequency
  if (exerciseFreq === "daily" || exerciseFreq === "4-6-times-week") {
    risk -= 8
    factors.push({
      name: "Regular Exercise",
      impact: "High positive impact",
      suggestion: "Continue your excellent exercise routine",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Regular exercise reduces cardiovascular risk by 30-35%. Your current routine provides significant protection.",
    })
  } else if (exerciseFreq === "2-3-times-week") {
    risk -= 5
  } else if (exerciseFreq === "rarely" || exerciseFreq === "never") {
    risk += 8
    factors.push({
      name: "Physical Inactivity",
      impact: "High negative impact",
      suggestion: "Start with 150 minutes of moderate aerobic activity weekly",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Physical inactivity is a major risk factor. Even modest increases in activity provide significant cardiovascular benefits.",
    })
  }

  // Stress
  if (Number.parseInt(data.stressLevel) >= 8) {
    risk += 6
    factors.push({
      name: "Chronic Stress",
      impact: "Medium negative impact",
      suggestion: "Stress management techniques and consider professional counseling",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "moderate",
      details:
        "Chronic stress contributes to cardiovascular disease through multiple pathways including inflammation and unhealthy behaviors.",
    })
  }

  // Ensure we have enough factors
  if (factors.length < 5) {
    factors.push({
      name: "Heart-Healthy Diet",
      impact: "Medium positive impact",
      suggestion: "Follow a Mediterranean-style diet rich in fruits, vegetables, and healthy fats",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "A heart-healthy diet can reduce cardiovascular risk by 20-30%. Focus on whole foods and limit processed foods.",
    })
  }

  return {
    risk: Math.max(5, Math.min(85, risk)),
    factors: factors.slice(0, 5),
  }
}

function calculateEnhancedMetabolicRisk(data: any, bmi: number) {
  let risk = 0
  const factors = []

  // Central obesity (BMI as proxy for waist circumference)
  if (bmi >= 35) {
    risk += 20
    factors.push({
      name: "Severe Obesity",
      impact: "High negative impact",
      suggestion: "Medical weight management program recommended",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Severe obesity significantly increases insulin resistance and metabolic syndrome risk. Medical supervision may be needed for safe weight loss.",
    })
  } else if (bmi >= 30) {
    risk += 15
    factors.push({
      name: "Obesity",
      impact: "High negative impact",
      suggestion: "Target 5-10% weight loss through caloric deficit and exercise",
      timeframe: "medium-term",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Obesity is strongly linked to insulin resistance and metabolic syndrome. Even modest weight loss improves metabolic health.",
    })
  } else if (bmi >= 25) {
    risk += 8
  }

  // Blood sugar (primary metabolic marker)
  if (data.bloodSugarLevel === "126+" || data.bloodSugarLevel === "200+") {
    risk += 25
    factors.push({
      name: "Diabetes",
      impact: "High negative impact",
      suggestion: "Comprehensive diabetes management with medication and lifestyle changes",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Diabetes is a major metabolic disorder requiring comprehensive management including medication, diet, and exercise.",
    })
  } else if (data.bloodSugarLevel === "101-125" || data.bloodSugarLevel === "140-199") {
    risk += 15
    factors.push({
      name: "Prediabetes",
      impact: "High negative impact",
      suggestion: "Intensive lifestyle intervention to prevent diabetes progression",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Prediabetes indicates significant insulin resistance. Lifestyle interventions can prevent or delay diabetes by up to 58%.",
    })
  }

  // Blood pressure (metabolic component)
  if (data.bloodPressure === "stage2") {
    risk += 18
  } else if (data.bloodPressure === "stage1") {
    risk += 12
  } else if (data.bloodPressure === "elevated") {
    risk += 5
  }

  // Cholesterol (metabolic marker)
  if (data.cholesterolLevels === "high" || data.cholesterolLevels === "very-high") {
    risk += 12
    factors.push({
      name: "Dyslipidemia",
      impact: "Medium negative impact",
      suggestion: "Lipid management through diet and possibly medication",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details: "Abnormal cholesterol levels are part of metabolic syndrome and increase cardiovascular risk.",
    })
  } else if (data.cholesterolLevels === "borderline") {
    risk += 6
  }

  // Age factor
  const age = Number.parseInt(data.age)
  if (age >= 60) {
    risk += 10
  } else if (age >= 45) {
    risk += 5
  }

  // Family history
  if (data.familyHistory && data.familyHistory.includes("diabetes")) {
    risk += 12
    factors.push({
      name: "Genetic Predisposition",
      impact: "Medium negative impact",
      suggestion: "Regular metabolic screening and aggressive prevention strategies",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details: "Family history of diabetes significantly increases your risk. Early intervention is crucial.",
    })
  }

  // Exercise (major protective factor)
  const exerciseFreq = data.exerciseFrequency
  if (exerciseFreq === "daily" || exerciseFreq === "4-6-times-week") {
    risk -= 10
    factors.push({
      name: "Regular Exercise",
      impact: "High positive impact",
      suggestion: "Continue your excellent exercise routine, include both cardio and strength training",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Regular exercise is one of the most effective ways to improve insulin sensitivity and metabolic health.",
    })
  } else if (exerciseFreq === "rarely" || exerciseFreq === "never") {
    risk += 15
    factors.push({
      name: "Physical Inactivity",
      impact: "High negative impact",
      suggestion: "Start with 150 minutes of moderate exercise weekly plus 2 days of strength training",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Physical inactivity is a major risk factor for metabolic syndrome. Both aerobic and resistance exercise improve insulin sensitivity.",
    })
  }

  // Diet quality (approximated)
  if (data.dietType === "mediterranean" || data.dietType === "vegetarian") {
    risk -= 8
    factors.push({
      name: "Healthy Diet Pattern",
      impact: "Medium positive impact",
      suggestion: "Continue your healthy diet pattern",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your diet pattern supports metabolic health through improved insulin sensitivity and reduced inflammation.",
    })
  } else {
    factors.push({
      name: "Metabolic Diet Optimization",
      impact: "Medium negative impact",
      suggestion: "Adopt a low-glycemic diet rich in fiber and healthy fats",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details: "A Mediterranean-style diet can improve insulin sensitivity and reduce metabolic syndrome risk by 30%.",
    })
  }

  // Sleep (affects metabolism)
  const sleepHours = Number.parseFloat(data.sleepHours)
  if (sleepHours < 6) {
    risk += 10
    factors.push({
      name: "Sleep Deprivation",
      impact: "Medium negative impact",
      suggestion: "Prioritize 7-9 hours of quality sleep for metabolic health",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Insufficient sleep disrupts hormones that regulate hunger and glucose metabolism, increasing diabetes risk.",
    })
  }

  return {
    risk: Math.max(5, Math.min(80, risk)),
    factors: factors.slice(0, 5),
  }
}

function calculateEnhancedSleepRisk(data: any) {
  let risk = 0
  const factors = []

  // Sleep duration (primary factor)
  const sleepHours = Number.parseFloat(data.sleepHours)
  if (sleepHours < 5) {
    risk += 25
    factors.push({
      name: "Severe Sleep Deprivation",
      impact: "High negative impact",
      suggestion: "Immediate sleep hygiene intervention and possible medical evaluation",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Less than 5 hours of sleep significantly increases risk of cardiovascular disease, diabetes, and cognitive impairment.",
    })
  } else if (sleepHours < 6) {
    risk += 15
    factors.push({
      name: "Sleep Deprivation",
      impact: "High negative impact",
      suggestion: "Gradually increase sleep duration to 7-9 hours nightly",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details: "Chronic sleep deprivation affects immune function, metabolism, and mental health.",
    })
  } else if (sleepHours < 7) {
    risk += 8
  } else if (sleepHours > 9) {
    risk += 10
    factors.push({
      name: "Excessive Sleep",
      impact: "Medium negative impact",
      suggestion: "Evaluate for underlying sleep disorders or health conditions",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "moderate",
      details: "Consistently sleeping more than 9 hours may indicate underlying health issues or poor sleep quality.",
    })
  }

  // Sleep quality
  const sleepQuality = data.sleepQuality
  if (sleepQuality === "poor" || sleepQuality === "very-poor") {
    risk += 20
    factors.push({
      name: "Poor Sleep Quality",
      impact: "High negative impact",
      suggestion: "Comprehensive sleep hygiene program and possible sleep study",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Poor sleep quality can indicate sleep disorders like sleep apnea and significantly impacts health outcomes.",
    })
  } else if (sleepQuality === "fair") {
    risk += 12
    factors.push({
      name: "Suboptimal Sleep Quality",
      impact: "Medium negative impact",
      suggestion: "Improve sleep environment and establish consistent bedtime routine",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details: "Sleep quality is as important as sleep duration for health outcomes.",
    })
  }

  // Age factor (sleep changes with age)
  const age = Number.parseInt(data.age)
  if (age >= 65) {
    risk += 8
    factors.push({
      name: "Age-Related Sleep Changes",
      impact: "Medium negative impact",
      suggestion: "Adapt sleep strategies for age-related changes",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details: "Sleep architecture changes with age, making sleep optimization strategies more important.",
    })
  }

  // BMI (sleep apnea risk)
  const bmi = Number.parseFloat(data.weight) / Math.pow(Number.parseFloat(data.height) / 100, 2)
  if (bmi >= 35) {
    risk += 15
    factors.push({
      name: "Sleep Apnea Risk",
      impact: "High negative impact",
      suggestion: "Sleep study evaluation for sleep apnea",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Severe obesity significantly increases sleep apnea risk, which can cause fragmented sleep and health complications.",
    })
  } else if (bmi >= 30) {
    risk += 10
  }

  // Stress (affects sleep)
  const stressLevel = Number.parseInt(data.stressLevel)
  if (stressLevel >= 8) {
    risk += 12
    factors.push({
      name: "Stress-Related Sleep Issues",
      impact: "Medium negative impact",
      suggestion: "Stress management and relaxation techniques before bedtime",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details: "High stress levels interfere with sleep initiation and maintenance through elevated cortisol levels.",
    })
  } else if (stressLevel >= 6) {
    risk += 6
  }

  // Screen time (if available)
  if (data.screenTime === "more-than-9" || data.screenTime === "7-9") {
    risk += 8
    factors.push({
      name: "Excessive Screen Time",
      impact: "Medium negative impact",
      suggestion: "Implement digital curfew 1-2 hours before bedtime",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details: "Blue light exposure from screens suppresses melatonin production and delays sleep onset.",
    })
  }

  // Exercise (can improve sleep)
  if (data.exerciseFrequency === "daily" || data.exerciseFrequency === "4-6-times-week") {
    risk -= 8
    factors.push({
      name: "Regular Exercise",
      impact: "Medium positive impact",
      suggestion: "Continue regular exercise but avoid intense workouts 3 hours before bedtime",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details: "Regular exercise improves sleep quality and duration, but timing matters for optimal sleep.",
    })
  }

  return {
    risk: Math.max(5, Math.min(75, risk)),
    factors: factors.slice(0, 5),
  }
}

function calculateEnhancedMentalRisk(data: any) {
  let risk = 0
  const factors = []

  // Stress level (primary factor)
  const stressLevel = Number.parseInt(data.stressLevel)
  if (stressLevel >= 9) {
    risk += 25
    factors.push({
      name: "Severe Stress",
      impact: "High negative impact",
      suggestion: "Immediate professional mental health support recommended",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Severe chronic stress significantly increases risk of anxiety, depression, and physical health problems.",
    })
  } else if (stressLevel >= 7) {
    risk += 15
    factors.push({
      name: "High Stress",
      impact: "High negative impact",
      suggestion: "Stress management techniques and consider counseling",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details: "High stress levels require active management to prevent mental health deterioration.",
    })
  } else if (stressLevel >= 5) {
    risk += 8
  }

  // Anxiety level (if available)
  if (data.anxietyLevel) {
    const anxietyLevel = Number.parseInt(data.anxietyLevel)
    if (anxietyLevel >= 8) {
      risk += 20
      factors.push({
        name: "High Anxiety",
        impact: "High negative impact",
        suggestion: "Professional anxiety treatment and coping strategies",
        timeframe: "immediate",
        difficulty: "moderate",
        evidence: "strong",
        details:
          "High anxiety levels significantly impact quality of life and can lead to other mental health conditions.",
      })
    } else if (anxietyLevel >= 6) {
      risk += 12
    }
  }

  // Sleep quality (affects mental health)
  const sleepQuality = data.sleepQuality
  if (sleepQuality === "poor" || sleepQuality === "very-poor") {
    risk += 15
    factors.push({
      name: "Sleep-Mental Health Connection",
      impact: "High negative impact",
      suggestion: "Address sleep issues as they significantly impact mental health",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Poor sleep quality is both a symptom and cause of mental health issues, creating a cycle that needs intervention.",
    })
  } else if (sleepQuality === "fair") {
    risk += 8
  }

  // Sleep duration
  const sleepHours = Number.parseFloat(data.sleepHours)
  if (sleepHours < 6) {
    risk += 12
  } else if (sleepHours > 9) {
    risk += 8
  }

  // Age factors (different risk periods)
  const age = Number.parseInt(data.age)
  if (age >= 18 && age <= 25) {
    risk += 8
    factors.push({
      name: "Young Adult Mental Health",
      impact: "Medium negative impact",
      suggestion: "Focus on stress management and healthy coping strategies during this high-risk period",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Young adults face unique stressors and have higher rates of mental health issues. Early intervention is crucial.",
    })
  } else if (age >= 45 && age <= 65) {
    risk += 5
  }

  // Gender factor
  if (data.gender === "female") {
    risk += 5
    factors.push({
      name: "Gender-Specific Risk",
      impact: "Low negative impact",
      suggestion: "Be aware of higher prevalence of anxiety and depression in women",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Women have twice the rate of depression and anxiety disorders. Hormonal factors and social stressors contribute to this difference.",
    })
  }

  // Family history
  if (data.familyHistory && data.familyHistory.includes("mental-health")) {
    risk += 15
    factors.push({
      name: "Genetic Predisposition",
      impact: "Medium negative impact",
      suggestion: "Regular mental health check-ins and early intervention strategies",
      timeframe: "short-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Family history of mental health conditions increases your risk. Early recognition and treatment are important.",
    })
  }

  // Existing mental health conditions
  if (data.existingConditions && data.existingConditions.includes("mental-health")) {
    risk += 20
    factors.push({
      name: "Existing Mental Health Condition",
      impact: "High negative impact",
      suggestion: "Continue treatment and maintain regular follow-up with mental health professionals",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details: "Existing mental health conditions require ongoing management and monitoring for optimal outcomes.",
    })
  }

  // Exercise (protective factor)
  const exerciseFreq = data.exerciseFrequency
  if (exerciseFreq === "daily" || exerciseFreq === "4-6-times-week") {
    risk -= 10
    factors.push({
      name: "Regular Exercise",
      impact: "High positive impact",
      suggestion: "Continue your excellent exercise routine for mental health benefits",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Regular exercise is as effective as medication for mild to moderate depression and significantly reduces anxiety.",
    })
  } else if (exerciseFreq === "rarely" || exerciseFreq === "never") {
    risk += 10
    factors.push({
      name: "Physical Inactivity",
      impact: "Medium negative impact",
      suggestion: "Start with 30 minutes of moderate exercise most days of the week",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Physical activity has powerful antidepressant and anxiolytic effects through multiple biological mechanisms.",
    })
  }

  // Substance use
  if (data.smokingStatus === "regular" || data.smokingStatus === "occasional") {
    risk += 8
    factors.push({
      name: "Smoking and Mental Health",
      impact: "Medium negative impact",
      suggestion: "Smoking cessation with mental health support",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Smoking is associated with higher rates of mental health issues and can interfere with treatment effectiveness.",
    })
  }

  if (data.alcoholConsumption === "daily" || data.alcoholConsumption === "weekly") {
    risk += 8
    factors.push({
      name: "Alcohol and Mental Health",
      impact: "Medium negative impact",
      suggestion: "Monitor alcohol use as it can worsen mental health symptoms",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Regular alcohol use can worsen depression and anxiety and interfere with sleep and medication effectiveness.",
    })
  }

  // Social connections (protective factor)
  factors.push({
    name: "Social Connection",
    impact: "Medium positive impact",
    suggestion: "Maintain and strengthen social relationships for mental health protection",
    timeframe: "long-term",
    difficulty: "easy",
    evidence: "strong",
    details:
      "Strong social connections are one of the most important protective factors for mental health and overall wellbeing.",
  })

  return {
    risk: Math.max(5, Math.min(80, risk)),
    factors: factors.slice(0, 5),
  }
}

function calculateEnhancedImmuneRisk(data: any) {
  let risk = 0
  const factors = []

  // Age factor (immune senescence)
  const age = Number.parseInt(data.age)
  if (age >= 75) {
    risk += 20
    factors.push({
      name: "Immune Aging",
      impact: "High negative impact",
      suggestion: "Enhanced preventive care and vaccination schedule for older adults",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Immune function naturally declines with age, making prevention strategies and vaccinations more important.",
    })
  } else if (age >= 65) {
    risk += 12
  } else if (age >= 50) {
    risk += 6
  }

  // Chronic conditions affecting immunity
  if (data.existingConditions) {
    const immuneAffectingConditions = ["diabetes", "heart-disease"]
    for (const condition of immuneAffectingConditions) {
      if (data.existingConditions.includes(condition)) {
        risk += 10
        factors.push({
          name: "Chronic Disease Impact",
          impact: "Medium negative impact",
          suggestion: "Optimal management of chronic conditions to support immune function",
          timeframe: "immediate",
          difficulty: "moderate",
          evidence: "strong",
          details:
            "Chronic diseases can compromise immune function, making infection prevention and management more important.",
        })
        break
      }
    }
  }

  // Smoking (major immune suppressant)
  if (data.smokingStatus === "regular" || data.smokingStatus === "occasional") {
    risk += 15
    factors.push({
      name: "Smoking-Induced Immunosuppression",
      impact: "High negative impact",
      suggestion: "Smoking cessation to restore immune function",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Smoking significantly impairs immune function and increases susceptibility to respiratory infections and other diseases.",
    })
  }

  // Alcohol (immune suppression)
  if (data.alcoholConsumption === "daily") {
    risk += 12
    factors.push({
      name: "Alcohol-Related Immune Suppression",
      impact: "Medium negative impact",
      suggestion: "Reduce alcohol consumption to support immune function",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details: "Excessive alcohol consumption impairs immune cell function and increases infection risk.",
    })
  } else if (data.alcoholConsumption === "weekly") {
    risk += 6
  }

  // Sleep (crucial for immune function)
  const sleepHours = Number.parseFloat(data.sleepHours)
  if (sleepHours < 6) {
    risk += 12
    factors.push({
      name: "Sleep and Immunity",
      impact: "High negative impact",
      suggestion: "Prioritize 7-9 hours of quality sleep for optimal immune function",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Sleep is when the body produces infection-fighting cells and antibodies. Chronic sleep deprivation significantly impairs immune response.",
    })
  } else if (data.sleepQuality === "poor") {
    risk += 8
  }

  // Stress (immunosuppressive)
  const stressLevel = Number.parseInt(data.stressLevel)
  if (stressLevel >= 8) {
    risk += 10
    factors.push({
      name: "Chronic Stress",
      impact: "Medium negative impact",
      suggestion: "Stress management to support immune function",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Chronic stress elevates cortisol levels, which suppresses immune function and increases susceptibility to infections.",
    })
  } else if (stressLevel >= 6) {
    risk += 5
  }

  // Exercise (immune boosting)
  const exerciseFreq = data.exerciseFrequency
  if (exerciseFreq === "daily" || exerciseFreq === "4-6-times-week") {
    risk -= 10
    factors.push({
      name: "Regular Exercise",
      impact: "High positive impact",
      suggestion: "Continue moderate exercise routine for immune benefits",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Regular moderate exercise enhances immune function and reduces infection risk. Avoid overtraining which can suppress immunity.",
    })
  } else if (exerciseFreq === "rarely" || exerciseFreq === "never") {
    risk += 8
    factors.push({
      name: "Physical Inactivity",
      impact: "Medium negative impact",
      suggestion: "Start moderate exercise routine to boost immune function",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details: "Regular moderate exercise enhances immune cell circulation and function, reducing infection risk.",
    })
  }

  // Nutrition (immune support)
  if (data.dietType === "mediterranean" || data.dietType === "vegetarian") {
    risk -= 8
    factors.push({
      name: "Immune-Supporting Diet",
      impact: "Medium positive impact",
      suggestion: "Continue your nutrient-rich diet for immune support",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Your diet provides important nutrients for immune function including vitamins, minerals, and antioxidants.",
    })
  } else {
    factors.push({
      name: "Immune-Supporting Nutrition",
      impact: "Medium negative impact",
      suggestion: "Eat a variety of colorful fruits and vegetables rich in immune-supporting nutrients",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details: "A diverse diet rich in vitamins C, D, zinc, and antioxidants supports optimal immune function.",
    })
  }

  // BMI (obesity affects immune function)
  const bmi = Number.parseFloat(data.weight) / Math.pow(Number.parseFloat(data.height) / 100, 2)
  if (bmi >= 35) {
    risk += 12
    factors.push({
      name: "Obesity and Immune Function",
      impact: "Medium negative impact",
      suggestion: "Weight management to improve immune function",
      timeframe: "medium-term",
      difficulty: "challenging",
      evidence: "strong",
      details: "Obesity creates chronic inflammation and impairs immune cell function, increasing infection risk.",
    })
  } else if (bmi >= 30) {
    risk += 8
  }

  return {
    risk: Math.max(5, Math.min(75, risk)),
    factors: factors.slice(0, 5),
  }
}

function calculateEnhancedChronicRisk(data: any, bmi: number) {
  let risk = 0
  const factors = []

  // Age (primary factor for chronic disease)
  const age = Number.parseInt(data.age)
  if (age >= 70) {
    risk += 25
    factors.push({
      name: "Advanced Age",
      impact: "High negative impact",
      suggestion: "Comprehensive preventive care and regular health monitoring",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Age is the strongest risk factor for chronic diseases. Regular screening and preventive care become increasingly important.",
    })
  } else if (age >= 60) {
    risk += 18
  } else if (age >= 50) {
    risk += 12
  } else if (age >= 40) {
    risk += 6
  }

  // Family history (genetic predisposition)
  if (data.familyHistory && data.familyHistory.length > 0 && !data.familyHistory.includes("none")) {
    const highRiskConditions = ["heart-disease", "diabetes", "cancer"]
    const familyRiskCount = highRiskConditions.filter((condition) => data.familyHistory.includes(condition)).length

    risk += familyRiskCount * 8
    if (familyRiskCount > 0) {
      factors.push({
        name: "Genetic Predisposition",
        impact: "High negative impact",
        suggestion: "Enhanced screening and prevention strategies based on family history",
        timeframe: "short-term",
        difficulty: "easy",
        evidence: "strong",
        details:
          "Strong family history significantly increases chronic disease risk. Early and frequent screening can enable prevention or early treatment.",
      })
    }
  }

  // Existing conditions
  if (data.existingConditions && data.existingConditions.length > 0) {
    const conditionCount = data.existingConditions.filter((c) => c !== "none").length
    risk += conditionCount * 10
    if (conditionCount > 0) {
      factors.push({
        name: "Existing Health Conditions",
        impact: "High negative impact",
        suggestion: "Optimal management of existing conditions to prevent complications",
        timeframe: "immediate",
        difficulty: "moderate",
        evidence: "strong",
        details:
          "Existing chronic conditions increase risk for additional conditions and complications. Comprehensive management is essential.",
      })
    }
  }

  // Smoking (major modifiable risk factor)
  if (data.smokingStatus === "regular" || data.smokingStatus === "occasional") {
    risk += 15
    factors.push({
      name: "Smoking",
      impact: "High negative impact",
      suggestion: "Immediate smoking cessation with professional support",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Smoking is linked to numerous chronic diseases including cancer, heart disease, COPD, and diabetes complications.",
    })
  } else if (data.smokingStatus === "former") {
    risk += 5
  }

  // Alcohol consumption
  if (data.alcoholConsumption === "daily") {
    risk += 10
    factors.push({
      name: "Excessive Alcohol Use",
      impact: "Medium negative impact",
      suggestion: "Reduce alcohol consumption to recommended limits",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Excessive alcohol consumption increases risk for liver disease, certain cancers, and cardiovascular disease.",
    })
  } else if (data.alcoholConsumption === "weekly") {
    risk += 5
  }

  // Physical activity (major protective factor)
  const exerciseFreq = data.exerciseFrequency
  if (exerciseFreq === "rarely" || exerciseFreq === "never") {
    risk += 15
    factors.push({
      name: "Physical Inactivity",
      impact: "High negative impact",
      suggestion: "Start with 150 minutes of moderate activity weekly",
      timeframe: "immediate",
      difficulty: "moderate",
      evidence: "strong",
      details:
        "Physical inactivity is a major risk factor for chronic diseases. Regular activity can reduce risk by 30-50%.",
    })
  } else if (exerciseFreq === "daily" || exerciseFreq === "4-6-times-week") {
    risk -= 12
    factors.push({
      name: "Regular Physical Activity",
      impact: "High positive impact",
      suggestion: "Continue your excellent exercise routine",
      timeframe: "long-term",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Regular physical activity is one of the most effective ways to prevent chronic diseases and maintain health.",
    })
  }

  // BMI and weight status
  if (bmi >= 35) {
    risk += 15
    factors.push({
      name: "Severe Obesity",
      impact: "High negative impact",
      suggestion: "Comprehensive weight management program with medical supervision",
      timeframe: "immediate",
      difficulty: "challenging",
      evidence: "strong",
      details:
        "Severe obesity significantly increases risk for multiple chronic diseases including diabetes, heart disease, and certain cancers.",
    })
  } else if (bmi >= 30) {
    risk += 10
  } else if (bmi < 18.5) {
    risk += 8
  }

  // Metabolic markers
  if (data.bloodPressure === "stage1" || data.bloodPressure === "stage2") {
    risk += 10
  }
  if (data.cholesterolLevels === "high" || data.cholesterolLevels === "very-high") {
    risk += 8
  }
  if (
    data.bloodSugarLevel === "101-125" ||
    data.bloodSugarLevel === "126+" ||
    data.bloodSugarLevel === "140-199" ||
    data.bloodSugarLevel === "200+"
  ) {
    risk += 12
  }

  // Sleep and stress (affect multiple systems)
  const sleepHours = Number.parseFloat(data.sleepHours)
  if (sleepHours < 6 || data.sleepQuality === "poor") {
    risk += 8
  }

  const stressLevel = Number.parseInt(data.stressLevel)
  if (stressLevel >= 8) {
    risk += 8
    factors.push({
      name: "Chronic Stress",
      impact: "Medium negative impact",
      suggestion: "Stress management for chronic disease prevention",
      timeframe: "short-term",
      difficulty: "moderate",
      evidence: "moderate",
      details: "Chronic stress contributes to inflammation and unhealthy behaviors that increase chronic disease risk.",
    })
  }

  // Preventive care
  if (data.lastCheckup === "more-than-5-years" || data.lastCheckup === "never") {
    risk += 8
    factors.push({
      name: "Lack of Preventive Care",
      impact: "Medium negative impact",
      suggestion: "Schedule comprehensive health screening and establish regular care",
      timeframe: "immediate",
      difficulty: "easy",
      evidence: "strong",
      details:
        "Regular preventive care enables early detection and treatment of chronic diseases when they're most manageable.",
    })
  }

  return {
    risk: Math.max(5, Math.min(85, risk)),
    factors: factors.slice(0, 5),
  }
}
