"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Frequently Asked Questions</h1>

        <div className="bg-white rounded-xl shadow-md p-8">
          <FAQItem
            question="How accurate are the health predictions?"
            answer="HealthPredict uses advanced AI algorithms trained on extensive health data to provide predictions with approximately 98% accuracy. However, our predictions are meant to be informative rather than diagnostic. Always consult with healthcare professionals for medical advice."
          />

          <FAQItem
            question="Is my health data secure and private?"
            answer="Yes, we take data privacy very seriously. All your health information is encrypted and stored securely. We never share your personal data with third parties without your explicit consent. You can read more in our Privacy Policy."
          />

          <FAQItem
            question="How often should I get a new health assessment?"
            answer="We recommend updating your health assessment every 3-6 months, or whenever you make significant lifestyle changes. Regular assessments help you track your progress and adjust your health strategies accordingly."
          />

          <FAQItem
            question="Can I use HealthPredict alongside my regular healthcare?"
            answer="HealthPredict is designed to complement, not replace, traditional healthcare. Many users share their HealthPredict reports with their doctors to facilitate more informed discussions about their health."
          />

          <FAQItem
            question="Is HealthPredict suitable for people with existing health conditions?"
            answer="Yes, HealthPredict can be valuable for people with existing health conditions. The platform takes your current health status into account and provides recommendations that consider your specific situation. However, always follow your healthcare provider's advice regarding your conditions."
          />

          <FAQItem
            question="How does HealthPredict analyze my data?"
            answer="HealthPredict uses machine learning algorithms to analyze your health data and identify patterns that may indicate potential health risks. Our models are trained on large datasets and are continuously updated to ensure accuracy."
          />

          <FAQItem
            question="Can I download my health assessment results?"
            answer="Yes, you can download your health assessment results as a PDF report. This makes it easy to share with healthcare providers or keep for your personal records."
          />
        </div>
      </main>
    </div>
  )
}

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-4">
      <button className="flex w-full justify-between items-center text-left" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <ChevronDown className={`h-5 w-5 text-primary-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="mt-2 text-gray-600">{answer}</div>}
    </div>
  )
}
