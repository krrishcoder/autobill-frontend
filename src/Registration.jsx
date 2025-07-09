import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Crown, Zap, Building, MessageCircle, Loader } from 'lucide-react';

const SubscriptionRegistration = () => {
  const [formData, setFormData] = useState({
    shopId: '',
    name: '',
    shopName: '',
    gmail: '',
    password: '',
    selectedPlan: '',
    telegramUserId: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://autobill-3rd-server-for-crud-opertions.onrender.com/plans');
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        
        // Transform API data to match component structure
        const transformedPlans = data.map((plan, index) => ({
          id: plan.id || plan._id || `plan-${index}`,
          name: plan.name || plan.planName || 'Plan',
          price: plan.price || plan.amount || '₹0',
          duration: plan.duration || plan.validity || '1 month',
          icon: getIconForPlan(plan.name || plan.planName),
          features: plan.features || [],
          color: getColorForPlan(index),
          popular: plan.popular || index === 1 // Make middle plan popular by default
        }));
        
        setSubscriptionPlans(transformedPlans);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching plans:', err);
        
        // Fallback to default plans if API fails
        setSubscriptionPlans(getDefaultPlans());
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const getIconForPlan = (planName) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('starter') || name.includes('basic')) {
      return <Zap className="w-6 h-6 text-white" />;
    } else if (name.includes('professional') || name.includes('pro')) {
      return <Building className="w-6 h-6 text-white" />;
    } else if (name.includes('enterprise') || name.includes('premium')) {
      return <Crown className="w-6 h-6 text-white" />;
    }
    return <Zap className="w-6 h-6 text-white" />;
  };

  const getColorForPlan = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-amber-500 to-orange-500'
    ];
    return colors[index % colors.length];
  };

  const getDefaultPlans = () => [
    {
      id: 'starter',
      name: 'Starter',
      price: '₹999',
      duration: '1 month',
      icon: <Zap className="w-6 h-6 text-white" />,
      features: [
        'Up to 100 items detection/day',
        'Basic analytics dashboard',
        'Email support',
        'Mobile camera integration',
        'Basic invoice generation'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '₹2499',
      duration: '3 months',
      icon: <Building className="w-6 h-6 text-white" />,
      features: [
        'Up to 500 items detection/day',
        'Advanced analytics & insights',
        'Priority support',
        'Custom item training',
        'API access',
        'Multi-camera support',
        'Advanced reporting'
      ],
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹4999',
      duration: '6 months',
      icon: <Crown className="w-6 h-6 text-white" />,
      features: [
        'Unlimited item detection',
        'Real-time analytics',
        'Dedicated support manager',
        'Custom AI model training',
        'White-label solution',
        'Advanced integrations',
        'Custom hardware setup',
        'On-site training'
      ],
      color: 'from-amber-500 to-orange-500',
      popular: false
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanSelection = (planId) => {
    setFormData(prev => ({
      ...prev,
      selectedPlan: planId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else {
      // Handle final submission
      console.log('Form submitted:', formData);
      setCurrentStep(4);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return formData.name && formData.shopName && formData.gmail && formData.password;
    } else if (currentStep === 2) {
      return formData.selectedPlan;
    } else if (currentStep === 3) {
      return formData.telegramUserId;
    }
    return false;
  };

  const TelegramBotSection = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500 p-2 rounded-lg">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Join Our Telegram Bot</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Get instant notifications, support, and updates directly on Telegram. 
        Join our bot to receive real-time billing alerts and quick assistance.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <a 
          href="https://t.me/KrrishBillBot" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Join Telegram Bot
        </a>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Bot ID:</span> @KrrishBillBot
        </div>
      </div>
    </div>
  );

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Welcome to AutoBill! Your account has been created successfully. 
            Please check your email for verification instructions.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Account Details:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Shop ID:</span> {formData.shopId || 'AUTO-' + Date.now()}</p>
              <p><span className="font-medium">Plan:</span> {subscriptionPlans.find(p => p.id === formData.selectedPlan)?.name}</p>
              <p><span className="font-medium">Payment Status:</span> <span className="text-orange-600">Pending</span></p>
              <p><span className="font-medium">Verification Status:</span> <span className="text-orange-600">Pending</span></p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-500">
              {currentStep === 1 ? 'Account Details' : currentStep === 2 ? 'Choose Plan' : 'Complete Setup'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Join AutoBill</h1>
            <p className="opacity-90">
              {currentStep === 1 ? 'Create your account to get started' : 
               currentStep === 2 ? 'Choose the perfect plan for your shop' : 
               'Complete your setup and join our community'}
            </p>
          </div>

          <div className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your shop name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="gmail"
                    value={formData.gmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Plan</h2>
                  <p className="text-gray-600">Select the plan that best fits your shop's needs</p>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex items-center gap-3">
                      <Loader className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="text-gray-600">Loading plans...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-red-700 font-medium mb-2">Error loading plans</p>
                      <p className="text-red-600 text-sm">{error}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => handlePlanSelection(plan.id)}
                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          formData.selectedPlan === plan.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                              Most Popular
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color}`}>
                            {plan.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{plan.name}</h3>
                            <p className="text-sm text-gray-500">{plan.duration}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                          <span className="text-gray-500">/{plan.duration}</span>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {formData.selectedPlan === plan.id && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Setup</h2>
                  <p className="text-gray-600">Join our Telegram community for support and updates</p>
                </div>

                <TelegramBotSection />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram User ID *
                  </label>
                  <input
                    type="text"
                    name="telegramUserId"
                    value={formData.telegramUserId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your Telegram User ID (e.g., @username or user ID)"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can find your Telegram User ID by messaging our bot after joining
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Order Summary:</h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="font-medium">
                        {subscriptionPlans.find(p => p.id === formData.selectedPlan)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{subscriptionPlans.find(p => p.id === formData.selectedPlan)?.duration}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>{subscriptionPlans.find(p => p.id === formData.selectedPlan)?.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!validateStep()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
              >
                {currentStep === 3 ? 'Complete Registration' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRegistration;