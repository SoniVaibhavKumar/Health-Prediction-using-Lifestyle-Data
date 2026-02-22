import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Heart, Brain, Moon, Shield } from "lucide-react"

export default function HealthGuidesPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Health Guides</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-rose-50 flex items-center">
              <Heart className="h-8 w-8 text-rose-600 mr-3" />
              <h2 className="text-2xl font-bold">Cardiovascular Health Guide</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                This comprehensive guide provides information on maintaining optimal heart health, including:
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                <li>Understanding cardiovascular risk factors</li>
                <li>Heart-healthy diet recommendations</li>
                <li>Exercise guidelines for heart health</li>
                <li>Stress management techniques</li>
                <li>When to consult a healthcare professional</li>
              </ul>
              <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Download Guide (PDF)
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-purple-50 flex items-center">
              <Brain className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold">Mental Wellbeing Guide</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                This guide focuses on strategies to maintain and improve mental health, covering:
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                <li>Recognizing signs of stress and anxiety</li>
                <li>Mindfulness and meditation practices</li>
                <li>Building emotional resilience</li>
                <li>Creating healthy work-life balance</li>
                <li>Resources for mental health support</li>
              </ul>
              <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Download Guide (PDF)
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-indigo-50 flex items-center">
              <Moon className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold">Sleep Optimization Guide</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                This guide provides practical advice for improving sleep quality, including:
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                <li>Creating an optimal sleep environment</li>
                <li>Establishing healthy sleep routines</li>
                <li>Managing sleep disruptors</li>
                <li>Nutrition and exercise for better sleep</li>
                <li>When to seek professional help for sleep issues</li>
              </ul>
              <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Download Guide (PDF)
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-green-50 flex items-center">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold">Immune System Support Guide</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">This guide explores ways to strengthen your immune system, covering:</p>
              <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                <li>Nutritional strategies for immune support</li>
                <li>The role of exercise in immune function</li>
                <li>Sleep and stress management for immunity</li>
                <li>Seasonal immune considerations</li>
                <li>Supplements and their evidence base</li>
              </ul>
              <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Download Guide (PDF)
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
