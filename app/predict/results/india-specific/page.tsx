"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PremiumIndiaHealthFactors } from "@/components/premium-india-health-factors"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function IndiaSpecificResultsPage() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data")
  const userData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null

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
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href={`/predict/results?data=${encodeURIComponent(JSON.stringify(userData))}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Link>
      </motion.div>

      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-green-600 to-blue-600">
            India-Specific Health Insights
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Personalized health analysis considering factors relevant to the Indian population
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <PremiumIndiaHealthFactors />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500">
            <div className="h-1.5 bg-gradient-to-r from-green-500 to-blue-600"></div>
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Based on your profile and India-specific health factors</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Dietary Considerations</h3>
                  <p className="text-amber-700">
                    Based on your profile and regional dietary patterns, consider incorporating more whole grains,
                    legumes, and seasonal fruits in your diet. If you follow a vegetarian diet, ensure adequate intake
                    of vitamin B12, iron, and protein.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Environmental Adaptations</h3>
                  <p className="text-green-700">
                    Consider air purification solutions if you live in an urban area with high pollution. Stay hydrated
                    and take precautions during extreme weather conditions, especially during summer months and monsoon
                    season.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Preventive Screening</h3>
                  <p className="text-blue-700">
                    Regular screening for diabetes and hypertension is recommended, especially if you have a family
                    history. Consider annual check-ups that include tests for anemia, vitamin D deficiency, and thyroid
                    function, which are common concerns in the Indian population.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
