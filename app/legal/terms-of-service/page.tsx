import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-gray-600 mb-6">Last Updated: May 1, 2023</p>

          <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing or using the HealthPredict website and services, you agree to be bound by these Terms of
            Service. If you do not agree to these Terms, you may not access or use our services.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
          <p className="text-gray-600 mb-6">
            HealthPredict provides AI-powered health risk assessments and personalized recommendations based on
            user-provided information. Our services are intended for informational purposes only and are not a
            substitute for professional medical advice, diagnosis, or treatment.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
          <p className="text-gray-600 mb-4">
            To access certain features of our services, you may be required to create an account. You are responsible
            for maintaining the confidentiality of your account credentials and for all activities that occur under your
            account. You agree to:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>Provide accurate and complete information when creating your account</li>
            <li>Update your information as necessary to keep it current</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Not share your account credentials with any third party</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">4. User Responsibilities</h2>
          <p className="text-gray-600 mb-4">When using our services, you agree to:</p>
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>Provide accurate and truthful information</li>
            <li>Use our services only for lawful purposes</li>
            <li>Not attempt to gain unauthorized access to any part of our services</li>
            <li>Not interfere with the proper functioning of our services</li>
            <li>Not use our services in any way that could harm, disable, or impair our services</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            All content, features, and functionality of our services, including but not limited to text, graphics,
            logos, icons, images, audio clips, and software, are owned by HealthPredict or its licensors and are
            protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold mb-4">6. Disclaimer of Warranties</h2>
          <p className="text-gray-600 mb-6">
            Our services are provided "as is" and "as available" without any warranties of any kind, either express or
            implied. We do not guarantee that our services will be uninterrupted, secure, or error-free. The health
            information provided through our services is for informational purposes only and should not be considered
            medical advice.
          </p>

          <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            To the maximum extent permitted by law, HealthPredict and its affiliates, officers, employees, agents,
            partners, and licensors shall not be liable for any direct, indirect, incidental, special, consequential, or
            punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
            losses, resulting from your access to or use of or inability to access or use the services.
          </p>

          <h2 className="text-2xl font-bold mb-4">8. Indemnification</h2>
          <p className="text-gray-600 mb-6">
            You agree to defend, indemnify, and hold harmless HealthPredict and its licensors, affiliates, officers,
            agents, employees, and partners from and against any claims, liabilities, damages, losses, and expenses,
            including without limitation reasonable attorney's fees, arising out of or in any way connected with your
            access to or use of our services or your violation of these Terms.
          </p>

          <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
          <p className="text-gray-600 mb-6">
            We may terminate or suspend your account and access to our services immediately, without prior notice or
            liability, for any reason, including without limitation if you breach these Terms. Upon termination, your
            right to use our services will immediately cease.
          </p>

          <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
            provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change
            will be determined at our sole discretion.
          </p>

          <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
          <p className="text-gray-600 mb-6">
            These Terms shall be governed by and construed in accordance with the laws of the State of California,
            without regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating
            to these Terms shall be brought exclusively in the federal or state courts located in San Francisco,
            California.
          </p>

          <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: legal@healthpredict.com
            <br />
            Address: 123 Health Avenue, San Francisco, CA 94103, United States
          </p>
        </div>
      </main>
    </div>
  )
}
