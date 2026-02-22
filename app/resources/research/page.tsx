import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ResearchPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Research</h1>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Research Methodology</h2>
          <p className="text-gray-600 mb-6">
            At HealthPredict, we are committed to evidence-based health predictions and recommendations. Our research
            methodology combines machine learning, statistical analysis, and medical expertise to provide accurate and
            personalized health insights.
          </p>

          <h3 className="text-xl font-semibold mb-3">Data Collection</h3>
          <p className="text-gray-600 mb-4">
            We collect anonymized health data from various sources, including medical literature, health surveys, and
            clinical studies. All data is processed in compliance with privacy regulations and ethical guidelines.
          </p>

          <h3 className="text-xl font-semibold mb-3">Model Development</h3>
          <p className="text-gray-600 mb-4">
            Our team of data scientists and healthcare professionals develop and validate predictive models using
            state-of-the-art machine learning techniques. These models are continuously refined to improve accuracy and
            reliability.
          </p>

          <h3 className="text-xl font-semibold mb-3">Validation</h3>
          <p className="text-gray-600 mb-4">
            All our models undergo rigorous validation processes to ensure they meet high standards of accuracy and
            reliability. We use cross-validation techniques and independent test datasets to evaluate model performance.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Recent Research Publications</h2>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Predictive Modeling of Cardiovascular Risk Factors</h3>
            <p className="text-gray-600 mb-2">
              This study explores the use of machine learning algorithms to predict cardiovascular risk based on
              lifestyle factors and medical history.
            </p>
            <p className="text-sm text-gray-500">Published: January 2023</p>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold mb-2">The Impact of Sleep Quality on Mental Health</h3>
            <p className="text-gray-600 mb-2">
              This research investigates the relationship between sleep patterns and mental health outcomes, providing
              insights for preventive interventions.
            </p>
            <p className="text-sm text-gray-500">Published: March 2023</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Nutritional Factors in Metabolic Health</h3>
            <p className="text-gray-600 mb-2">
              This study examines how different dietary patterns affect metabolic health markers and identifies key
              nutritional factors for optimal metabolic function.
            </p>
            <p className="text-sm text-gray-500">Published: June 2023</p>
          </div>
        </div>
      </main>
    </div>
  )
}
