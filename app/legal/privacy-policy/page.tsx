import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-gray-600 mb-6">Last Updated: May 1, 2023</p>

          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            At HealthPredict, we take your privacy seriously. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our website and services. Please read this policy
            carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
          <p className="text-gray-600 mb-4">
            We may collect personal information that you voluntarily provide to us when you register on the website,
            express interest in obtaining information about us or our products and services, or otherwise contact us.
            The personal information we collect may include:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>Name, email address, and contact details</li>
            <li>Date of birth and gender</li>
            <li>Health information you choose to provide</li>
            <li>Account credentials</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
          <p className="text-gray-600 mb-4">
            When you access our website, we may automatically collect certain information about your device, including:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>IP address and browser type</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on the site</li>
            <li>Referring website addresses</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We may use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>Providing, maintaining, and improving our services</li>
            <li>Processing your health data to generate personalized health insights</li>
            <li>Responding to your inquiries and customer service requests</li>
            <li>Sending you updates, newsletters, and marketing communications</li>
            <li>Analyzing usage patterns to enhance user experience</li>
            <li>Protecting against unauthorized access and legal claims</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate technical and organizational measures to protect your personal information from
            unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the
            Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
          <p className="text-gray-600 mb-4">We may share your information in the following situations:</p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>
              <strong>With Service Providers:</strong> We may share your information with third-party vendors who
              provide services on our behalf.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information when you have given us permission to do
              so.
            </li>
            <li>
              <strong>For Legal Reasons:</strong> We may disclose your information if required by law or in response to
              valid legal requests.
            </li>
            <li>
              <strong>Business Transfers:</strong> We may share your information in connection with a merger,
              acquisition, or sale of assets.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>The right to access and receive a copy of your personal information</li>
            <li>The right to rectify or update your personal information</li>
            <li>The right to delete your personal information</li>
            <li>The right to restrict or object to our processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-600">
            Email: privacy@healthpredict.com
            <br />
            Address: 123 Health Avenue, San Francisco, CA 94103, United States
          </p>
        </div>
      </main>
    </div>
  )
}
