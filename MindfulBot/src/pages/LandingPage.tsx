import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Menu, X, MessageCircle, Heart, Headphones, Bell } from "lucide-react";
import { LoginButton } from "../components/LoginButton";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Features section data
  const features = [
    {
      icon: <MessageCircle className="h-10 w-10 text-mindful-purple" />,
      title: "24/7 Supportive Conversations",
      description: "Get help anytime, anywhere with our AI companion that's always available to listen and respond."
    },
    {
      icon: <Heart className="h-10 w-10 text-mindful-purple" />,
      title: "Personalized Support",
      description: "Our AI learns your needs and adapts over time, providing customized strategies and resources."
    },
    {
      icon: <Headphones className="h-10 w-10 text-mindful-purple" />,
      title: "Various Support Modes",
      description: "Choose from therapist, coach, or friend modes depending on the type of support you need."
    },
    {
      icon: <Bell className="h-10 w-10 text-mindful-purple" />,
      title: "Helpful Reminders",
      description: "Set personalized reminders for self-care activities, medication, and important appointments."
    }
  ];

  // How it works section data
  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your account with just an email and password. No lengthy forms or complicated setup.",
    },
    {
      number: 2,
      title: "Share Your Needs",
      description: "Tell us about your challenges, goals, and preferences so we can personalize your experience.",
    },
    {
      number: 3,
      title: "Connect With Your Companion",
      description: "Start chatting with your AI companion whenever you need support, guidance, or just someone to talk to.",
    },
    {
      number: 4,
      title: "Grow Together",
      description: "Your companion learns and adapts to provide better support as you continue your wellness journey.",
    }
  ];

  // Testimonials section data
  const testimonials = [
    {
      quote: "This app has been a lifeline during my difficult days. Having someone to talk to anytime makes me feel less alone.",
      name: "Jamie C.",
      title: "Living with depression"
    },
    {
      quote: "As someone with mobility challenges, finding accessible mental health support was hard until I found Mindful Companion.",
      name: "Alex P.",
      title: "Wheelchair user"
    },
    {
      quote: "The reminders and daily check-ins help me stay on track with my mental health routine. It's like having a supportive friend.",
      name: "Morgan T.",
      title: "Anxiety management"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col starry-background">
      {/* Navigation Bar */}
      <nav className="py-4 px-6 md:px-12 w-full z-20 fixed top-0 bg-starry-deeper/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-starry-blue to-starry-highlight" />
            <span className="text-xl font-bold text-starry-text">Mindful Companion</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-starry-text/80 hover:text-starry-text transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-starry-text/80 hover:text-starry-text transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-starry-text/80 hover:text-starry-text transition-colors">
              Testimonials
            </a>
            {user ? (
              <Button
                size="sm"
                className="bg-starry-blue hover:bg-starry-highlight text-white"
                onClick={() => navigate("/chat")}
              >
                Go to Chat
              </Button>
            ) : (
              <LoginButton />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-starry-text focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-starry-deeper/95 backdrop-blur-lg border-b border-white/10 shadow-lg p-4">
            <div className="flex flex-col space-y-4 px-4">
              <a 
                href="#features" 
                className="text-starry-text/80 hover:text-starry-text transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-starry-text/80 hover:text-starry-text transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#testimonials" 
                className="text-starry-text/80 hover:text-starry-text transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <div className="pt-2">
                {user ? (
                  <Button
                    size="sm"
                    className="w-full bg-starry-blue hover:bg-starry-highlight text-white"
                    onClick={() => navigate("/chat")}
                  >
                    Go to Chat
                  </Button>
                ) : (
                  <LoginButton />
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:leading-tight">
                  <span className="gradient-text">Mindful Companion</span>
                </h1>
                <p className="text-xl md:text-2xl font-medium mb-6 text-starry-text">
                  Your AI-powered support system.
                </p>
                <p className="text-starry-muted max-w-lg mx-auto md:mx-0 mb-8">
                  Talk to a therapist, coach, or friend — all in one place. Personalized and secure support for your mental health journey.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    size="lg"
                    onClick={() => navigate("/chat")}
                    className="bg-starry-blue hover:bg-starry-highlight text-white"
                  >
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/20 text-starry-text hover:bg-white/10">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-6 -right-6 w-64 h-64 bg-starry-blue rounded-full opacity-10 blur-3xl animate-pulse-gentle"></div>
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-starry-highlight rounded-full opacity-10 blur-3xl animate-pulse-gentle delay-300"></div>
                  <div className="relative z-10 glass-panel p-6 rounded-3xl shadow-lg animate-float">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-starry-blue/20 rounded-full flex items-center justify-center">
                        <span className="text-starry-highlight font-bold">MC</span>
                      </div>
                      <div className="bg-starry-blue/20 rounded-2xl p-3">
                        <p className="text-sm text-starry-text">
                          How are you feeling today? I'm here to listen and support you.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 mb-4 justify-end">
                      <div className="chat-bubble-user">
                        <p className="text-sm">
                          I've been feeling a bit overwhelmed with work lately.
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-starry-highlight/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-starry-text">You</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-starry-blue/20 rounded-full flex items-center justify-center">
                        <span className="text-starry-highlight font-bold">MC</span>
                      </div>
                      <div className="bg-starry-blue/20 rounded-2xl p-3">
                        <p className="text-sm text-starry-text">
                          I understand that feeling. Let's break down what's causing this overwhelm and find some strategies that might help...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-starry-deeper/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">Features That Support You</span>
              </h2>
              <p className="text-starry-muted max-w-2xl mx-auto">
                Mindful Companion provides accessible mental health support through features designed specifically for your needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="glass-panel p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                  <div className="mb-4 flex justify-center">
                    <div className="text-starry-highlight">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center text-starry-text">{feature.title}</h3>
                  <p className="text-starry-muted text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">How It Works</span>
              </h2>
              <p className="text-starry-muted max-w-2xl mx-auto">
                Getting started with Mindful Companion is simple and straightforward, designed with accessibility in mind.
              </p>
            </div>
            
            <div className="relative">
              {/* Connection Line (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-starry-blue to-starry-highlight transform -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-starry-blue to-starry-highlight flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-center text-starry-text">{step.title}</h3>
                    <p className="text-starry-muted text-center">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button size="lg" className="bg-starry-blue hover:bg-starry-highlight text-white">
                Get Started Now
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-starry-deeper/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">User Experiences</span>
              </h2>
              <p className="text-starry-muted max-w-2xl mx-auto">
                Read how Mindful Companion has helped others on their mental health journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg overflow-hidden glass-panel">
                  <CardContent className="p-6">
                    <div className="mb-4 text-starry-highlight">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                      </svg>
                    </div>
                    <p className="text-starry-text mb-6 italic">{testimonial.quote}</p>
                    <div>
                      <p className="font-bold text-starry-text">{testimonial.name}</p>
                      <p className="text-sm text-starry-muted">{testimonial.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="relative glass-panel rounded-3xl p-8 md:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-starry-highlight rounded-full opacity-10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-starry-blue rounded-full opacity-10 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-starry-text">
                  Start Your Mental Health Journey Today
                </h2>
                <p className="text-starry-muted mb-8 max-w-2xl mx-auto">
                  Join thousands of people who are finding support, comfort, and growth with Mindful Companion. Your first week is completely free.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-starry-darker border-starry-blue/30 focus-visible:ring-starry-highlight text-starry-text"
                  />
                  <Button className="bg-starry-blue hover:bg-starry-highlight whitespace-nowrap text-white">
                    Get Started Free
                  </Button>
                </div>
                
                <p className="mt-4 text-sm text-starry-muted">
                  No credit card required. 7-day free trial.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-starry-deeper pt-16 pb-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-starry-blue to-starry-highlight" />
                <span className="text-xl font-bold text-starry-text">Mindful Companion</span>
              </div>
              <p className="text-starry-muted mb-4">
                Your AI-powered mental health support system available 24/7.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-starry-text">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">About Us</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Careers</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Press</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-starry-text">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Community</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Mental Health Tips</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Support</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Accessibility</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-starry-text">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-starry-muted hover:text-starry-highlight transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-starry-muted mb-4 md:mb-0">
                © {new Date().getFullYear()} Mindful Companion. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-xs text-starry-muted hover:text-starry-highlight transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-xs text-starry-muted hover:text-starry-highlight transition-colors">
                  Terms
                </a>
                <a href="#" className="text-xs text-starry-muted hover:text-starry-highlight transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;