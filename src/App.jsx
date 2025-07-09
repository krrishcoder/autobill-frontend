import React from 'react'

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AutoBillingLandingPage from "./components/AutoBillingLandingPage";
import PricingSection from "./components/PricingSection";
import SelfBilling from "./components/SelfBilling";
import PaymentPage from './components/PaymentPage';
import Registration from "./Registration"

const App = () => {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<AutoBillingLandingPage />} />
        <Route path="/pricing" element={<PricingSection />} />
        <Route path="/self-billing" element={<SelfBilling />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/register" element={<Registration />} />
      
      </Routes>
    
    </Router>
  )
}

export default App