"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Activity,
  ArrowRight,
  Heart,
  Brain,
  Moon,
  Shield,
  Zap,
  CheckCircle,
  ChevronDown,
  BarChart,
  Award,
  FileText,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"

// FAQ Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border py-4">
      <button className="flex w-full justify-between items-center text-left" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-medium text-foreground">{question}</h3>
        <ChevronDown className={`h-5 w-5 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="mt-2 text-muted-foreground animate-fade-in">{answer}</div>}
    </div>
  )
}

// Testimonial Component
const Testimonial = ({ quote, author, role, rating }) => (
  <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-muted-foreground italic mb-4">"{quote}"</p>
    <div>
      <p className="font-medium text-foreground">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SiteHeader />

      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-r from-background to-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl animate-fade-in">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                AI-Powered Health Analysis
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 leading-tight">
                Predict Health Risks Before They Become Problems
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                HealthPredict uses advanced AI to analyze your lifestyle data and provide personalized health risk
                assessments. Get actionable insights and recommendations tailored to your unique health profile.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="hover:scale-105 transition-transform duration-300">
                  <Link href="/predict">
                    <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6">
                      Get Your Prediction <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <Link href="/about">
                    <Button
                      variant="outline"
                      className="border-primary/20 text-primary hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-300 text-lg px-8 py-6"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-foreground">Free Analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-foreground">Personalized Insights</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-foreground">Evidence-Based</span>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-in">
              <div className="relative z-10 bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
                <div className="h-2 bg-gradient-to-r from-primary to-blue-600"></div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Health Risk Assessment</h3>
                      <p className="text-sm text-muted-foreground">Personalized analysis based on your lifestyle</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-rose-600 dark:text-rose-500 mr-2" />
                        <span className="text-foreground">Cardiovascular Risk</span>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                        Moderate
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-amber-500 dark:bg-amber-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Brain className="h-5 w-5 text-violet-600 dark:text-violet-500 mr-2" />
                        <span className="text-foreground">Mental Health</span>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Low Risk
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 dark:bg-green-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-500 mr-2" />
                        <span className="text-foreground">Sleep Quality</span>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                        High Risk
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-red-500 dark:bg-red-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground italic">
                      "Based on your sleep patterns and stress levels, we recommend focusing on sleep hygiene and stress
                      management techniques."
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-70 blur-2xl"></div>
              <div className="absolute -top-6 -left-6 h-32 w-32 bg-primary/10 rounded-full opacity-70 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 animate-fade-in-up">
              <p className="text-4xl font-bold text-primary mb-2">98%</p>
              <p className="text-muted-foreground">Accuracy Rate</p>
            </div>
            <div className="p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <p className="text-4xl font-bold text-primary mb-2">10k+</p>
              <p className="text-muted-foreground">Users Helped</p>
            </div>
            <div className="p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-4xl font-bold text-primary mb-2">6</p>
              <p className="text-muted-foreground">Health Categories</p>
            </div>
            <div className="p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <p className="text-4xl font-bold text-primary mb-2">24/7</p>
              <p className="text-muted-foreground">Available Anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Comprehensive Analysis
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Complete Health Risk Assessment</h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered platform analyzes multiple aspects of your health to provide a holistic view of your
              wellbeing and personalized recommendations tailored to your unique profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="h-8 w-8 text-rose-600 dark:text-rose-500" />,
                title: "Cardiovascular Health",
                description:
                  "Assess your heart health based on lifestyle factors, family history, and medical metrics. Get personalized recommendations to improve your cardiovascular wellbeing.",
              },
              {
                icon: <Zap className="h-8 w-8 text-cyan-600 dark:text-cyan-500" />,
                title: "Metabolic Analysis",
                description:
                  "Understand how your diet, exercise, and other habits affect your metabolic health. Learn how to optimize your metabolism for better energy and weight management.",
              },
              {
                icon: <Moon className="h-8 w-8 text-violet-600 dark:text-violet-500" />,
                title: "Sleep Quality",
                description:
                  "Evaluate your sleep patterns and get recommendations for better rest and recovery. Improve your sleep quality for better overall health and cognitive function.",
              },
              {
                icon: <Brain className="h-8 w-8 text-purple-600 dark:text-purple-500" />,
                title: "Mental Wellbeing",
                description:
                  "Gain insights into your mental health and discover strategies to improve your emotional balance. Learn techniques to manage stress and enhance your psychological resilience.",
              },
              {
                icon: <Shield className="h-8 w-8 text-green-600 dark:text-green-500" />,
                title: "Immune System",
                description:
                  "Learn how your lifestyle choices impact your immune function and disease resistance. Get recommendations to strengthen your body's natural defense mechanisms.",
              },
              {
                icon: <Activity className="h-8 w-8 text-orange-600 dark:text-orange-500" />,
                title: "Chronic Disease Risk",
                description:
                  "Identify potential long-term health risks and take preventive measures early. Understand your risk factors for common chronic conditions and how to mitigate them.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-border h-full hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Link
                  href="/predict"
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">How HealthPredict Works</h2>
            <p className="text-lg text-muted-foreground">Get personalized health insights in just a few simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                icon: <FileText className="h-10 w-10 text-primary" />,
                title: "Complete Health Questionnaire",
                description:
                  "Answer questions about your daily habits, including sleep, diet, exercise, stress levels, and family history. The more information you provide, the more accurate your assessment will be.",
              },
              {
                step: "02",
                icon: <BarChart className="h-10 w-10 text-primary" />,
                title: "AI Analysis & Risk Assessment",
                description:
                  "Our advanced algorithms analyze your data to identify patterns and potential health risks. We compare your profile with medical research and health databases to generate personalized insights.",
              },
              {
                step: "03",
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "Get Personalized Recommendations",
                description:
                  "Receive a detailed health risk assessment with actionable recommendations tailored to your lifestyle. Download your report and track your progress over time as you implement changes.",
              },
            ].map((step, index) => (
              <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${0.2 * index}s` }}>
                <div className="bg-card rounded-xl shadow-lg p-8 relative z-10 h-full border border-border">
                  <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {step.step}
                  </div>
                  <div className="mb-6 mt-4 flex justify-center">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-center text-foreground">{step.title}</h3>
                  <p className="text-center text-muted-foreground">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                    <ArrowRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Thousands of people have improved their health with HealthPredict's personalized insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in-up">
              <Testimonial
                quote="HealthPredict identified my sleep issues before they became serious. The personalized recommendations helped me improve my sleep quality dramatically."
                author="Sarah Johnson"
                role="Marketing Executive"
                rating={5}
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <Testimonial
                quote="As someone with a family history of heart disease, the cardiovascular risk assessment gave me valuable insights to discuss with my doctor."
                author="Michael Chen"
                role="Software Engineer"
                rating={5}
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Testimonial
                quote="The mental health recommendations were spot on. I've implemented several of the suggested techniques and noticed a significant improvement in my stress levels."
                author="Emily Rodriguez"
                role="Teacher"
                rating={4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Common Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Find answers to common questions about HealthPredict</p>
          </div>

          <div className="max-w-3xl mx-auto">
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
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 dark:from-primary/90 dark:to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Health Journey Today</h2>
            <p className="text-xl mb-8 text-white/80">
              Get personalized health insights and recommendations in minutes. Take control of your health with
              AI-powered predictions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="hover:scale-105 transition-transform duration-300">
                <Link href="/predict">
                  <Button className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 w-full sm:w-auto">
                    Get Your Health Prediction <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="hover:scale-105 transition-transform duration-300">
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="border-white text-white bg-white/10 hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <Activity className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">HealthPredict</span>
              </div>
              <p className="text-gray-400 mb-4">Personalized health insights powered by AI</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/resources/health-articles" className="text-gray-400 hover:text-white transition-colors">
                    Health Articles
                  </Link>
                </li>
                <li>
                  <Link href="/resources/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/resources/research" className="text-gray-400 hover:text-white transition-colors">
                    Research
                  </Link>
                </li>
                <li>
                  <Link href="/resources/health-guides" className="text-gray-400 hover:text-white transition-colors">
                    Health Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/company/about-us" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/company/careers" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/company/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/company/partners" className="text-gray-400 hover:text-white transition-colors">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/legal/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/gdpr-compliance" className="text-gray-400 hover:text-white transition-colors">
                    GDPR Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} HealthPredict. All rights reserved.</p>
            <p className="mt-2">
              Disclaimer: This tool provides general health information and is not a substitute for professional medical
              advice. Always consult with healthcare professionals for medical concerns.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-fill-mode: both;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out 0.2s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}
