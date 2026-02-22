import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Careers at HealthPredict</h1>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-6">
            At HealthPredict, we're on a mission to revolutionize preventive healthcare through AI-driven insights.
            We're looking for passionate, talented individuals who share our vision and want to make a real impact on
            people's health and wellbeing.
          </p>

          <h3 className="text-xl font-semibold mb-3">Why Work With Us</h3>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>Meaningful work that directly impacts people's health and quality of life</li>
            <li>Collaborative, innovative environment that values diverse perspectives</li>
            <li>Competitive compensation and comprehensive benefits package</li>
            <li>Flexible work arrangements and work-life balance</li>
            <li>Opportunities for professional growth and development</li>
            <li>Regular team events and activities to foster connection and community</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Our Values</h3>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>
              <strong>Innovation:</strong> We embrace new ideas and technologies to solve complex health challenges
            </li>
            <li>
              <strong>Integrity:</strong> We uphold the highest ethical standards in all aspects of our work
            </li>
            <li>
              <strong>Empathy:</strong> We put people at the center of everything we do
            </li>
            <li>
              <strong>Excellence:</strong> We strive for exceptional quality and continuous improvement
            </li>
            <li>
              <strong>Collaboration:</strong> We believe in the power of teamwork and diverse perspectives
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Current Openings</h2>

          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-xl font-bold mb-2">Senior Machine Learning Engineer</h3>
            <p className="text-gray-600 mb-4">
              We're looking for an experienced Machine Learning Engineer to join our AI team. In this role, you'll
              develop and optimize our health prediction models, working closely with our data scientists and healthcare
              experts.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">Full-time</span>
              <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">Remote</span>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Apply Now
            </button>
          </div>

          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-xl font-bold mb-2">UX/UI Designer</h3>
            <p className="text-gray-600 mb-4">
              We're seeking a talented UX/UI Designer to create intuitive, engaging user experiences for our health
              platform. You'll work on designing interfaces that make complex health information accessible and
              actionable.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">Full-time</span>
              <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">Hybrid</span>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Apply Now
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Health Content Writer</h3>
            <p className="text-gray-600 mb-4">
              We're looking for a Health Content Writer to create accurate, engaging content for our platform and
              educational resources. You'll translate complex health information into clear, actionable guidance for our
              users.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">Part-time</span>
              <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">Remote</span>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
