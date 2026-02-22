import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PartnersPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Our Partners</h1>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Healthcare Partners</h2>
          <p className="text-gray-600 mb-6">
            We collaborate with leading healthcare providers, research institutions, and medical professionals to ensure
            our health predictions and recommendations are based on the latest medical knowledge and best practices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg mb-2">MedTech Research Institute</h3>
              <p className="text-gray-600 text-sm">Research Partner</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg mb-2">Global Health Network</h3>
              <p className="text-gray-600 text-sm">Healthcare Provider</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg mb-2">Wellness Medical Center</h3>
              <p className="text-gray-600 text-sm">Clinical Partner</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Technology Partners</h2>
          <p className="text-gray-600 mb-6">
            We work with innovative technology companies to enhance our platform's capabilities and provide a seamless,
            secure user experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg mb-2">DataSafe Solutions</h3>
              <p className="text-gray-600 text-sm">Data Security Partner</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg mb-2">AI Innovations</h3>
              <p className="text-gray-600 text-sm">Machine Learning Partner</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg mb-2">CloudTech Services</h3>
              <p className="text-gray-600 text-sm">Infrastructure Partner</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Become a Partner</h2>
          <p className="text-gray-600 mb-4">
            We're always looking for new partnerships that can help us improve our services and reach more people. If
            you're interested in partnering with HealthPredict, we'd love to hear from you.
          </p>

          <h3 className="text-xl font-semibold mb-3">Partnership Opportunities</h3>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>
              <strong>Research Collaborations:</strong> Join us in advancing health prediction technology
            </li>
            <li>
              <strong>Healthcare Integration:</strong> Integrate our platform with your healthcare services
            </li>
            <li>
              <strong>Technology Integration:</strong> Enhance our platform with your innovative technology
            </li>
            <li>
              <strong>Content Partnerships:</strong> Collaborate on health education content
            </li>
            <li>
              <strong>Distribution Partnerships:</strong> Help us reach new users and markets
            </li>
          </ul>

          <Link href="/company/contact">
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Contact Us About Partnerships
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}
