"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export function PremiumIndiaHealthFactors() {
  const indiaSpecificFactors = [
    {
      category: "Environmental",
      factors: [
        {
          name: "Air Pollution",
          impact: "High",
          description:
            "Major cities in India often have high levels of air pollution, which can impact respiratory and cardiovascular health.",
        },
        {
          name: "Water Quality",
          impact: "Medium",
          description:
            "Access to clean drinking water varies across regions, affecting digestive health and disease risk.",
        },
        {
          name: "Climate Variation",
          impact: "Medium",
          description: "Extreme temperatures and monsoon seasons can influence health patterns and disease prevalence.",
        },
      ],
    },
    {
      category: "Dietary",
      factors: [
        {
          name: "Regional Diets",
          impact: "Variable",
          description: "Diverse regional cuisines across India have different nutritional profiles and health impacts.",
        },
        {
          name: "Vegetarianism",
          impact: "Positive",
          description:
            "High prevalence of vegetarianism may offer protection against certain diseases while requiring attention to specific nutrients.",
        },
        {
          name: "Spice Consumption",
          impact: "Positive",
          description: "Many Indian spices like turmeric, cumin, and coriander have documented health benefits.",
        },
      ],
    },
    {
      category: "Disease Prevalence",
      factors: [
        {
          name: "Diabetes",
          impact: "High",
          description:
            "India has one of the highest diabetes burdens globally, with genetic and lifestyle factors contributing.",
        },
        {
          name: "Tuberculosis",
          impact: "Medium",
          description:
            "TB remains a significant public health challenge in India, requiring awareness and early detection.",
        },
        {
          name: "Tropical Diseases",
          impact: "Variable",
          description: "Diseases like malaria, dengue, and chikungunya are endemic in many regions.",
        },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500">
      <div className="h-1.5 bg-gradient-to-r from-amber-500 via-green-500 to-blue-600"></div>
      <CardHeader className="bg-white border-b border-gray-100 pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-green-600">
            India-Specific Health Factors
          </span>
        </CardTitle>
        <CardDescription>Key health considerations relevant to the Indian population</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
          {indiaSpecificFactors.map((category, index) => (
            <motion.div key={category.category} className="space-y-3" variants={itemVariants}>
              <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-primary-500 pl-3">
                {category.category}
              </h3>
              <div className="grid gap-3">
                {category.factors.map((factor) => (
                  <motion.div
                    key={factor.name}
                    className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-800">{factor.name}</h4>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          factor.impact === "High"
                            ? "bg-amber-100 text-amber-800"
                            : factor.impact === "Medium"
                              ? "bg-blue-100 text-blue-800"
                              : factor.impact === "Positive"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {factor.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}
