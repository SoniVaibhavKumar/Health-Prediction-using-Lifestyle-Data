import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Activity } from "lucide-react"

export default function AboutUsPage() {
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
        <div className="flex items-center mb-8">
          <Activity className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold">About HealthPredict</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At HealthPredict, our mission is to empower individuals to take control of their health through
            personalized, AI-driven insights and recommendations. We believe that preventive healthcare is the key to a
            healthier future, and we're committed to making it accessible to everyone.
          </p>

          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            HealthPredict was founded in 2020 by a team of healthcare professionals, data scientists, and technology
            experts who shared a vision of revolutionizing preventive healthcare. Frustrated by the reactive nature of
            traditional healthcare systems, our founders set out to create a platform that could identify potential
            health risks before they become serious problems.
          </p>
          <p className="text-gray-600 mb-6">
            Starting with a focus on cardiovascular health, we quickly expanded our capabilities to include mental
            wellbeing, sleep quality, metabolic health, and more. Today, HealthPredict serves thousands of users
            worldwide, helping them make informed decisions about their health and lifestyle.
          </p>

          <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
          <p className="text-gray-600 mb-4">
            We combine cutting-edge artificial intelligence with evidence-based medical knowledge to provide accurate
            health risk assessments and personalized recommendations. Our platform analyzes various aspects of your
            lifestyle, habits, and health metrics to create a comprehensive picture of your current health status and
            potential risks.
          </p>
          <p className="text-gray-600">
            What sets us apart is our commitment to actionable insights. We don't just tell you what might be wrong – we
            provide practical, step-by-step recommendations to help you improve your health outcomes. And we're
            constantly updating our models and recommendations based on the latest research and user feedback.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">Dr. Sarah Johnson</h3>
              <p className="text-gray-600">Co-Founder & Chief Medical Officer</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">Michael Chen</h3>
              <p className="text-gray-600">Co-Founder & Chief Technology Officer</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">Emily Rodriguez</h3>
              <p className="text-gray-600">Chief Data Scientist</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
