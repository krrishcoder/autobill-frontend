import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WebSocketComponent from '../SocketConnection';

 

export default function SelfBilling() {
  const [showCart, setShowCart] = useState(false);
  const [data, setData] = useState({ response: "Click on Start Detection to start the model and build a socket" });
  const [detectionStarted, setDetectionStarted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Handle React Router navigation (including back button)
  const [prevPath, setPrevPath] = useState(location.pathname);

  const handleStart = async () => {
    try {
      const response = await fetch("https://krrishcoder07-autofill-backend.hf.space/start");
      const data = await response.json();
      console.log("Response:", data);
      setData({ response: data.status || "Detection started successfully!" });
      setShowCart(true);
      setDetectionStarted(true);
    } catch (error) {
      console.error("Error calling /start:", error);
    }
  };

 const handleStop = async () => {
  try {
    const response = await fetch("https://krrishcoder07-autofill-backend.hf.space/stop", {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason: 'user_payment' })  // optional payload
    });
    const data = await response.json();
    console.log("Detection stopped:", data);
  } catch (error) {
    console.error("Error calling /stop:", error);
  }
};


  const handlePayment = async () => {
    await handleStop();
    navigate('/payment');
  };




// Handle tab close / refresh
useEffect(() => {
  const stopOnUnload = () => {
    if (detectionStarted) {
      navigator.sendBeacon("https://krrishcoder07-autofill-backend.hf.space/stop");
    }
  };

  window.addEventListener('beforeunload', stopOnUnload);
  window.addEventListener('pagehide', stopOnUnload); // for Safari

  return () => {
    window.removeEventListener('beforeunload', stopOnUnload);
    window.removeEventListener('pagehide', stopOnUnload);
  };
}, [detectionStarted]);

 

  useEffect(() => {
    if (detectionStarted && location.pathname !== prevPath) {
      handleStop(); // Stop detection if route changed
    }
    setPrevPath(location.pathname);
  }, [location]);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">YOLO Detection</h2>

        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md mb-4">
          <p className="font-semibold">Status: {data.response}</p>
        </div>

        {!detectionStarted && (
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4"
          >
            Start Detection
          </button>
        )}

        {showCart && (
          <>
         
            <p className="text-gray-600 mb-4">Camera stream is active. Please ensure your camera is enabled.</p>
            <p className="text-green-600 mb-4">Detection Started!</p>
            <WebSocketComponent />
            <button
              onClick={handlePayment}
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Stop Prediction and Pay Now
            </button>
          </>
        )}



      </div>
    </div>
  );
}

