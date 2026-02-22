import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HealthArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Health Articles</h1>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Understanding Cardiovascular Health</h2>
          <p className="text-gray-600 mb-4">
            Cardiovascular health is essential for overall wellbeing. This article explores the key factors that
            contribute to heart health and provides practical tips for maintaining a healthy cardiovascular system.
          </p>
          <p className="text-gray-600 mb-4">
            Regular exercise, a balanced diet rich in fruits and vegetables, maintaining a healthy weight, and avoiding
            tobacco are all crucial for heart health. Additionally, managing stress and getting regular check-ups can
            help prevent heart disease.
          </p>
          <div className="mt-4">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #HeartHealth
            </span>
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #Prevention
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">The Importance of Sleep Quality</h2>
          <p className="text-gray-600 mb-4">
            Sleep is a fundamental biological process that affects every aspect of our health. This article discusses
            the importance of sleep quality and provides strategies for improving your sleep habits.
          </p>
          <p className="text-gray-600 mb-4">
            Poor sleep has been linked to increased risk of heart disease, diabetes, obesity, and mental health issues.
            Establishing a regular sleep schedule, creating a restful environment, and limiting screen time before bed
            can significantly improve sleep quality.
          </p>
          <div className="mt-4">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #SleepHealth
            </span>
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #Wellness
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
