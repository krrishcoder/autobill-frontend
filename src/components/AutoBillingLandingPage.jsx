import { Link } from 'react-router-dom';
import React from 'react';
import '../styles/land_page.css';

const AutoBillingLandingPage = () => {
  return (
    <>
      <header>
        <div className="container" role="navigation" aria-label="Primary Navigation">
          <nav>
            <a href="/" className="logo" tabIndex={0}>AutoBill</a>
            <div className="nav-links">
              <a href="#features" tabIndex={0}>Features</a>
              <Link to="/pricing">Pricing</Link>
              <Link to="/register" className="register-button" tabIndex={0}>Register</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" aria-label="Main introduction">
          <h1>Automate Your Billing & Invoices Effortlessly</h1>
          <p>Save time, reduce errors, and get paid faster with our intelligent auto billing platform designed for businesses of all sizes.</p>
          {/* <div className="hero-buttons">
            <Link to="/self-billing" className="cta-button" tabIndex={0}>Start Your Self Billing</Link>
            <Link to="/register" className="cta-button-secondary bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:from-slate-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 text-sm border border-slate-700" tabIndex={0}>
              <span className="text-lg">📊</span>
              <span className="button-text">
                <span className="button-main block text-sm font-semibold">Get Your Personal Dashboard</span>
                <span className="button-sub block text-xs opacity-90">Tailored pricing & analytics for your shop</span>
              </span>
            </Link>
          </div> */}

          <div className="hero-buttons flex flex-col items-start gap-4 mt-6">
  <Link to="/self-billing" className="cta-button" tabIndex={0}>
    Start Your Self Billing
  </Link>
  
  <Link
    to="/register"
    className="cta-button-secondary bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:from-slate-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 text-sm border border-slate-700"
    tabIndex={0}
  >
    <span className="text-lg">📊</span>
    <span className="button-text">
      <span className="button-main block text-sm font-semibold">Get Your Personal Dashboard</span>
      <span className="button-sub block text-xs opacity-90">Tailored pricing & analytics for your shop</span>
    </span>
  </Link>
</div>

        </section>

        {/* Features Section */}
        <section id="features" className="features" aria-label="Features">
          <article className="feature-card" tabIndex={0} aria-describedby="feature2-desc">
            <div className="feature-icon" aria-hidden="true">⚡</div>
            <h3 className="feature-title">Instant Payment Processing</h3>
            <p className="feature-description" id="feature2-desc">
              Seamless integration with payment gateways to process payments quickly and securely.
            </p>
          </article>

          <article className="feature-card" tabIndex={0} aria-describedby="feature3-desc">
            <div className="feature-icon" aria-hidden="true">📊</div>
            <h3 className="feature-title">Real-Time Analytics</h3>
            <p className="feature-description" id="feature3-desc">
              Powerful dashboards showing invoice statuses, cash flow, and billing efficiency metrics.
            </p>
          </article>

          <article className="feature-card" tabIndex={0} aria-describedby="feature4-desc">
            <div className="feature-icon" aria-hidden="true">🔒</div>
            <h3 className="feature-title">Secure & Compliant</h3>
            <p className="feature-description" id="feature4-desc">
              Enterprise-grade security and compliance to protect your billing data and customer privacy.
            </p>
          </article>
        </section>

        {/* Registration CTA Section */}
        <section className="registration-cta bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-6 relative overflow-hidden" aria-label="Registration call to action">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-indigo-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400 rounded-full"></div>
          </div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                🚀 Limited Time Offer
              </span>
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Transform Your Shop with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Smart Billing</span>
              </h2>
            </div>
            
            <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of shop owners who've revolutionized their billing process. 
              Get a personalized dashboard with custom pricing, real-time analytics, and AI-powered insights.
            </p>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-lg mb-2">Custom Pricing</h3>
                <p className="text-gray-600 text-sm">Pricing plans tailored to your shop size and needs</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-lg mb-2">Personal Dashboard</h3>
                <p className="text-gray-600 text-sm">Analytics and insights specific to your business</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Priority Support</h3>
                <p className="text-gray-600 text-sm">Get help when you need it with dedicated support</p>
              </div>
            </div>
            
            {/* Main CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3">
                <span className="text-xl">🏪</span>
                <span>
                  <span className="block text-lg">Create Your Shop Account</span>
                  <span className="block text-sm opacity-90">Setup takes less than 2 minutes</span>
                </span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  No credit card required
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  14-day free trial
                </span>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Trusted by 500+ shops across India</p>
              <div className="flex justify-center items-center gap-8 opacity-60">
                <div className="text-2xl">⭐⭐⭐⭐⭐</div>
                <div className="text-sm">4.9/5 rating</div>
                <div className="text-sm">|</div>
                <div className="text-sm">99.9% uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works bg-gray-100 py-10 px-6" aria-label="How it works">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Object Detection</h3>
                <p>We use advanced image recognition (YOLOv11) to detect items in real-time via a camera feed.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Live WebSocket Sync</h3>
                <p>The detected items are instantly sent to our React frontend via WebSocket for live billing updates.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Auto Invoice Generation</h3>
                <p>Each recognized item is added to your virtual cart and a digital invoice is generated with one click.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Made It Section */}
        <section className="how-we-made-it py-10 px-6" aria-label="How we made it">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">How We Made It</h2>
            <p className="text-lg leading-relaxed">
              AutoBill is built using a modern tech stack:
              <br /><br />
              <strong>Frontend:</strong> React + Tailwind CSS for dynamic and responsive UI<br />
              <strong>Backend:</strong> FastAPI (Python) for efficient WebSocket and REST support<br />
              <strong>AI/ML:</strong> YOLOv11 model for real-time object detection<br />

              <br></br>
                    We also support using your <strong>mobile phone camera</strong> over a local network for object detection using apps like <strong>IP Webcam (Lruin)</strong>. 
                    This allows a low-cost, plug-and-play vision setup with no additional hardware required.
            
            </p>
          </div>
        </section>

        <section className="future-plans bg-gray-100 py-10 px-6" aria-label="Future updates">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">What's Next?</h2>
            <p className="text-lg leading-relaxed">
              We are working on automating even more:
              <br /><br />
               <strong>Automated Labeling:</strong> Streamline the process of classifying and tagging training data using active learning.<br />
               <strong>Auto Image Capture:</strong> Integrating hardware (e.g., Raspberry Pi, camera modules) to automate photo capture without manual intervention.
              <br /><br />
              These updates will make AutoBill a truly self-operating, intelligent billing solution.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-600">
         Made with <span style={{ color: 'red' }}>♥</span> in DUCS. All rights reserved.
      </footer>
    </>
  );
};

export default AutoBillingLandingPage;