
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
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" aria-label="Main introduction">
          <h1>Automate Your Billing & Invoices Effortlessly</h1>
          <p>Save time, reduce errors, and get paid faster with our intelligent auto billing platform designed for businesses of all sizes.</p>
          <Link to="/self-billing" className="cta-button" tabIndex={0}>Start Your Self Billing</Link>
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
            <h2 className="text-3xl font-bold mb-6">What’s Next?</h2>
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

