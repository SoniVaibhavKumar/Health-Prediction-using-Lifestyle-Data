"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AnxietyTriggersChartProps {
  data: {
    trigger: string
    count: number
  }[]
}

export default function AnxietyTriggersChart({ data }: AnxietyTriggersChartProps) {
  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <CardHeader>
        <CardTitle className="text-gray-900">Anxiety Triggers Analysis</CardTitle>
        <CardDescription className="text-gray-600">Common factors that contribute to your anxiety</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trigger" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="count" name="Frequency" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
