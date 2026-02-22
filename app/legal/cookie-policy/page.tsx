import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CookiePolicyPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookie Policy</h1>

        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-gray-600 mb-6">Last Updated: May 1, 2023</p>

          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            This Cookie Policy explains how HealthPredict uses cookies and similar technologies to recognize you when
            you visit our website. It explains what these technologies are and why we use them, as well as your rights
            to control our use of them.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. What Are Cookies?</h2>
          <p className="text-gray-600 mb-6">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well
            as to provide reporting information. Cookies set by the website owner (in this case, HealthPredict) are
            called "first-party cookies." Cookies set by parties other than the website owner are called "third-party
            cookies." Third-party cookies enable third-party features or functionality to be provided on or through the
            website.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
          <h3 className="text-xl font-semibold mb-3">3.1 Essential Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies are necessary for the website to function and cannot be switched off in our systems. They are
            usually only set in response to actions made by you which amount to a request for services, such as setting
            your privacy preferences, logging in, or filling in forms.
          </p>

          <h3 className="text-xl font-semibold mb-3">3.2 Performance Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies allow us to count visits and traffic sources so we can measure and improve the performance of
            our site. They help us to know which pages are the most and least popular and see how visitors move around
            the site.
          </p>

          <h3 className="text-xl font-semibold mb-3">3.3 Functional Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies enable the website to provide enhanced functionality and personalization. They may be set by
            us or by third-party providers whose services we have added to our pages.
          </p>

          <h3 className="text-xl font-semibold mb-3">3.4 Targeting Cookies</h3>
          <p className="text-gray-600 mb-6">
            These cookies may be set through our site by our advertising partners. They may be used by those companies
            to build a profile of your interests and show you relevant advertisements on other sites.
          </p>

          <h2 className="text-2xl font-bold mb-4">4. How to Control Cookies</h2>
          <p className="text-gray-600 mb-4">
            You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies,
            you may still use our website, but your access to some functionality and areas of our website may be
            restricted. As the means by which you can refuse cookies through your web browser controls vary from browser
            to browser, you should visit your browser's help menu for more information.
          </p>

          <p className="text-gray-600 mb-6">
            In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like
            to find out more information, please visit http://www.aboutads.info/choices/ or
            http://www.youronlinechoices.com.
          </p>

          <h2 className="text-2xl font-bold mb-4">5. Updates to This Cookie Policy</h2>
          <p className="text-gray-600 mb-6">
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies
            we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy
            regularly to stay informed about our use of cookies and related technologies.
          </p>

          <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about our use of cookies or other technologies, please contact us at:
            <br />
            Email: privacy@healthpredict.com
            <br />
            Address: 123 Health Avenue, San Francisco, CA 94103, United States
          </p>
        </div>
      </main>
    </div>
  )
}
