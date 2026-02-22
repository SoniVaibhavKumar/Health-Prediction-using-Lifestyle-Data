"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AnxietyTrendChartProps {
  data: {
    date: string
    anxietyLevel: number
    stressLevel: number
  }[]
}

export default function AnxietyTrendChart({ data }: AnxietyTrendChartProps) {
  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
      <CardHeader>
        <CardTitle className="text-gray-900">Anxiety & Stress Trends</CardTitle>
        <CardDescription className="text-gray-600">Tracking your anxiety and stress levels over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            anxietyLevel: {
              label: "Anxiety Level",
              color: "hsl(var(--chart-1))",
            },
            stressLevel: {
              label: "Stress Level",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="anxietyLevel"
                stroke="var(--color-anxietyLevel)"
                name="Anxiety Level"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="stressLevel"
                stroke="var(--color-stressLevel)"
                name="Stress Level"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
