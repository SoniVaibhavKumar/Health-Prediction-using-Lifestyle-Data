import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GDPRCompliancePage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">GDPR Compliance</h1>

        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-gray-600 mb-6">Last Updated: May 1, 2023</p>

          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            At HealthPredict, we are committed to protecting the privacy and security of your personal data. This GDPR
            Compliance statement explains how we comply with the General Data Protection Regulation (GDPR) and outlines
            your rights under this regulation.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Data Controller</h2>
          <p className="text-gray-600 mb-6">
            HealthPredict is the data controller for personal data collected through our website and services. This
            means we determine the purposes and means of processing your personal data.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. Legal Basis for Processing</h2>
          <p className="text-gray-600 mb-4">We process your personal data on the following legal bases:</p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>
              <strong>Consent:</strong> Where you have given us explicit consent to process your data for specific
              purposes.
            </li>
            <li>
              <strong>Contract:</strong> Where processing is necessary for the performance of a contract with you.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> Where processing is necessary for our legitimate interests,
              provided those interests do not override your fundamental rights and freedoms.
            </li>
            <li>
              <strong>Legal Obligation:</strong> Where processing is necessary to comply with a legal obligation.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">4. Your Rights Under GDPR</h2>
          <p className="text-gray-600 mb-4">Under the GDPR, you have the following rights:</p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>
              <strong>Right to Access:</strong> You have the right to request a copy of the personal data we hold about
              you.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You have the right to request that we correct any inaccurate or
              incomplete personal data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You have the right to request that we delete your personal data in
              certain circumstances.
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the
              processing of your personal data in certain circumstances.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You have the right to request that we transfer your personal
              data to another organization or directly to you.
            </li>
            <li>
              <strong>Right to Object:</strong> You have the right to object to the processing of your personal data in
              certain circumstances.
            </li>
            <li>
              <strong>Rights Related to Automated Decision Making:</strong> You have the right not to be subject to a
              decision based solely on automated processing that produces legal effects concerning you or significantly
              affects you.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">5. How to Exercise Your Rights</h2>
          <p className="text-gray-600 mb-6">
            To exercise any of these rights, please contact us at privacy@healthpredict.com. We will respond to your
            request within one month. Please note that we may need to verify your identity before processing your
            request.
          </p>

          <h2 className="text-2xl font-bold mb-4">6. Data Protection Measures</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate technical and organizational measures to ensure a level of security appropriate to
            the risk, including encryption of personal data, regular testing and evaluation of the effectiveness of our
            security measures, and procedures to ensure the ongoing confidentiality, integrity, availability, and
            resilience of our processing systems.
          </p>

          <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
          <p className="text-gray-600 mb-6">
            If we transfer your personal data outside the European Economic Area (EEA), we ensure that appropriate
            safeguards are in place to protect your data, such as Standard Contractual Clauses approved by the European
            Commission.
          </p>

          <h2 className="text-2xl font-bold mb-4">8. Data Breach Notification</h2>
          <p className="text-gray-600 mb-6">
            In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we
            will notify the relevant supervisory authority without undue delay and, where feasible, within 72 hours
            after becoming aware of the breach. If the breach is likely to result in a high risk to your rights and
            freedoms, we will also notify you directly.
          </p>

          <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about our GDPR compliance or how we handle your personal data, please contact us
            at:
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
