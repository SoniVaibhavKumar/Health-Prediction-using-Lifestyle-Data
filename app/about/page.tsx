"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Brain, Moon, Users, BookOpen } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">About HealthPredict</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Our mission is to empower individuals with personalized health insights through advanced data analysis and
              machine learning.
            </p>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Our Approach</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    Data-Driven Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground/80">
                    We use advanced machine learning algorithms to analyze your lifestyle data and provide personalized
                    health predictions based on scientific research.
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Evidence-Based Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground/80">
                    All our health recommendations are based on peer-reviewed scientific literature and established
                    medical guidelines.
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Personalized Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground/80">
                    We recognize that everyone is unique. Our system provides tailored recommendations based on your
                    specific health profile.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Health Areas We Focus On</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center border border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Heart className="h-10 w-10 text-red-500 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-lg mb-2">Cardiovascular Health</CardTitle>
                  <CardDescription>
                    Assessing heart health risks and providing strategies to improve cardiovascular wellness
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center border border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Activity className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">Metabolic Health</CardTitle>
                  <CardDescription>
                    Evaluating metabolic efficiency and offering guidance for optimal energy management
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center border border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Moon className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-lg mb-2">Sleep Quality</CardTitle>
                  <CardDescription>
                    Analyzing sleep patterns and recommending improvements for restorative rest
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center border border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Brain className="h-10 w-10 text-purple-500 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg mb-2">Mental Wellbeing</CardTitle>
                  <CardDescription>
                    Identifying mental health risk factors and suggesting strategies for emotional balance
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle>Medical Experts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground/80">
                    Our team includes physicians, nutritionists, and health researchers who ensure all recommendations
                    are medically sound and up-to-date with the latest research.
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle>Data Scientists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground/80">
                    Our data science team develops and refines the machine learning models that power our health
                    prediction algorithms.
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle>Health Coaches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground/80">
                    Our certified health coaches help translate predictions into actionable lifestyle changes that are
                    sustainable and effective.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Ready to Take Control of Your Health?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Start your personalized health journey today with our comprehensive health prediction tool.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href="/predict">Get Your Health Prediction</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-card text-card-foreground py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">HealthPredict</h2>
              </div>
              <p className="text-muted-foreground">
                Using advanced machine learning to predict health outcomes based on lifestyle data.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">
                    Health Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} HealthPredict. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
