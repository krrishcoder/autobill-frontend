import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
 // Import PrivateRoute


import AutoBillingLandingPage from "./components/AutoBillingLandingPage";
import PricingSection from "./components/PricingSection";
import SelfBilling from "./components/SelfBilling";
import PaymentPage from './components/PaymentPage';
import Registration from "./Registration"; // Assuming this is your Registration component
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";







const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    // You can render a loading spinner here while checking auth status
    return <div className="flex justify-center items-center min-h-screen">Loading authentication...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// export default PrivateRoute;






// A wrapper component to handle redirects for login/register pages
const AuthRedirect = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    // You can render a loading spinner or placeholder here while checking auth status
    return <div className="flex justify-center items-center min-h-screen">Loading authentication...</div>;
  }

  // If user is logged in, redirect them to the dashboard from login/register pages
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider> {/* Wrap your entire application with AuthProvider */}
        <Routes>
          {/* Public routes that don't require login and don't redirect if logged in */}
          <Route path="/" element={<AutoBillingLandingPage />} />
          <Route path="/pricing" element={<PricingSection />} />

          {/* Authentication routes - redirect if already logged in */}
          <Route 
            path="/login" 
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthRedirect>
                <Registration />
              </AuthRedirect>
            } 
          />
          
          {/* Protected routes - require login */}
          <Route 
            path="/self-billing" 
            element={
              <PrivateRoute>
                <SelfBilling />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Fallback for unmatched routes (optional, redirects to home or 404) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;























// import React from 'react'

// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import AutoBillingLandingPage from "./components/AutoBillingLandingPage";
// import PricingSection from "./components/PricingSection";
// import SelfBilling from "./components/SelfBilling";
// import PaymentPage from './components/PaymentPage';
// import Registration from "./Registration"
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";

// const App = () => {
//   return (
//       <Router>
//       <Routes>
//         <Route path="/" element={<AutoBillingLandingPage />} />
//         <Route path="/pricing" element={<PricingSection />} />
//         <Route path="/self-billing" element={<SelfBilling />} />
//         <Route path="/payment" element={<PaymentPage />} />
//         <Route path="/register" element={<Registration />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
      
//       </Routes>
    
//     </Router>
//   )
// }

// export default App