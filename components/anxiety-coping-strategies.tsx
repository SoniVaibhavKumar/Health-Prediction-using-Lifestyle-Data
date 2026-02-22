"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface CopingStrategy {
  name: string
  effectiveness: number
  description: string
  icon: React.ReactNode
}

interface AnxietyCopingStrategiesProps {
  strategies: CopingStrategy[]
}

export default function AnxietyCopingStrategies({ strategies }: AnxietyCopingStrategiesProps) {
  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <CardHeader>
        <CardTitle className="text-gray-900">Recommended Coping Strategies</CardTitle>
        <CardDescription className="text-gray-600">
          Personalized techniques to help manage anxiety based on your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {strategies.map((strategy, index) => (
            <motion.div
              key={strategy.name}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start">
                <div className="mt-0.5 p-2 bg-indigo-100 rounded-full">{strategy.icon}</div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-medium text-gray-900">{strategy.name}</h5>
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                      {strategy.effectiveness}% Effective
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{strategy.description}</p>
                  <Progress value={strategy.effectiveness} className="h-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
