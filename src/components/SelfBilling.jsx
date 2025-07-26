
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link
import WebSocketComponent from '../SocketConnection'; // Ensure this path is correct
import { CloudCog } from 'lucide-react';

export default function SelfBilling() {
  const [showCart, setShowCart] = useState(false);
  const [data, setData] = useState({ response: "Click on Start Detection to start the model and build a socket" });
  const [detectionStarted, setDetectionStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [cartItems, setCartItems] = useState([]); // New state to hold items from WebSocketComponent
  const [isSavingBill, setIsSavingBill] = useState(false); // New state for bill saving loading
  const navigate = useNavigate();
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Check login status on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Run once on mount

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
      setData({ response: "Failed to start detection." });
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
    // Stop the YOLO detection
    await handleStop();

    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.user_id) {
      console.error("User not logged in or user_id not found. Cannot save bill.");
      // Optionally, navigate to login or show an error message
      navigate('/login');
      return;
    }

    // Calculate total amount from cartItems
    console.log("cart items : ", cartItems)
    // const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

  
    const totalAmount = Object.values(cartItems).reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    

    // const billPayload = {
    //   total_amount: totalAmount,
    //   items: cartItems.map(item => ({
    //     product_id: item.product_id,
    //     quantity: item.quantity,
    //     price: item.price,
    //     total: item.total
    //   }))
    // };

    console.log("total amount : ", totalAmount);

    const billPayload = {
      bill_id: crypto.randomUUID(),  // or any unique ID generation logic
      user_id: userData.user_id,
      shop_name: "My Shop", // Replace with actual shop name
      created_at: new Date().toISOString(),
      total_amount: totalAmount,
      items: Object.values(cartItems).map(item => ({
        product_id: item.product_id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        total: item.price*item.quantity
      }))
      
    };

    console.log(billPayload)




    setIsSavingBill(true); // Start loading state for bill saving

    try {
      // IMPORTANT: Replace 'https://autobill-3rd-server-for-crud-opertions.onrender.com'
      // with the base URL of your FastAPI backend if it's different.
      const billSaveResponse = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/user-bills/${userData.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billPayload),
      });

      if (!billSaveResponse.ok) {
        let errorMsg = 'Failed to save bill.';
        try {
          const errorData = await billSaveResponse.json();
          errorMsg = errorData.detail || errorMsg;
        } catch (e) {
          console.error("Error parsing bill save error response:", e);
        }
        throw new Error(errorMsg);
      }

      const responseData = await billSaveResponse.json();
      console.log("Bill saved successfully:", responseData);
      // You might want to pass bill_id to payment page or store it
      navigate('/payment');

    } catch (error) {
      console.error("Error saving bill:", error);
      // Handle error saving bill (e.g., show a message to the user)
      // Still navigate to payment, or decide based on your app's flow
      navigate('/payment'); // Still navigate even if bill save fails, or show error and stay
    } finally {
      setIsSavingBill(false); // End loading state for bill saving
    }
  };

  // Callback function to receive cart updates from WebSocketComponent
  const handleCartUpdate = (updatedCart) => {
    console.log("cart items in update : ", cartItems)
    setCartItems(updatedCart);
  };


  // Handle tab close / refresh
  useEffect(() => {
    const stopOnUnload = () => {
      if (detectionStarted) {
        // Use sendBeacon for reliable requests on page unload
        navigator.sendBeacon("https://krrishcoder07-autofill-backend.hf.space/stop", JSON.stringify({ reason: 'page_unload' }));
      }
    };

    window.addEventListener('beforeunload', stopOnUnload);
    window.addEventListener('pagehide', stopOnUnload); // for Safari and other browsers

    return () => {
      window.removeEventListener('beforeunload', stopOnUnload);
      window.removeEventListener('pagehide', stopOnUnload);
    };
  }, [detectionStarted]);

  // Handle React Router navigation (including back button)
  useEffect(() => {
    // Only stop detection if the path changes AND detection was previously started
    if (detectionStarted && location.pathname !== prevPath) {
      handleStop(); // Stop detection if route changed
    }
    setPrevPath(location.pathname);
  }, [location, detectionStarted, prevPath]); // Added detectionStarted and prevPath to dependencies

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"> {/* Main container for centering */}
      {/* Changed items-start to items-stretch to make children fill available height */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch"> {/* New flex container for the cards */}
        {isLoggedIn && !showCart && (
          <Link 
          to="/dashboard" 
          className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg flex flex-col justify-center items-center hover:bg-blue-100 transition-colors duration-300"
      >
      
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center cursor-pointer">Dashboard</h2> {/* Added text-center */}
            
              <p>Go to Dashboard</p>
           
          
           </Link>
        )}

        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg hover:bg-blue-100 transition-colors duration-300 cursor-pointer"> {/* YOLO detection card */}
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
              {/* Pass the handleCartUpdate callback to WebSocketComponent */}
              <WebSocketComponent onCartUpdate={handleCartUpdate} />
              <button
                onClick={handlePayment}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                disabled={isSavingBill} // Disable button while saving
              >
                {isSavingBill ? 'Generating Bill...' : 'Stop Prediction and Pay Now'} {/* Change button text */}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}









// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link
// import WebSocketComponent from '../SocketConnection';

// export default function SelfBilling() {
//   const [showCart, setShowCart] = useState(false);
//   const [data, setData] = useState({ response: "Click on Start Detection to start the model and build a socket" });
//   const [detectionStarted, setDetectionStarted] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [prevPath, setPrevPath] = useState(location.pathname);

//   // Check login status on component mount
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []); // Run once on mount

//   const handleStart = async () => {
//     try {
//       const response = await fetch("https://krrishcoder07-autofill-backend.hf.space/start");
//       const data = await response.json();
//       console.log("Response:", data);
//       setData({ response: data.status || "Detection started successfully!" });
//       setShowCart(true);
//       setDetectionStarted(true);
//     } catch (error) {
//       console.error("Error calling /start:", error);
//       setData({ response: "Failed to start detection." });
//     }
//   };

//   const handleStop = async () => {
//     try {
//       const response = await fetch("https://krrishcoder07-autofill-backend.hf.space/stop", {
//         method: 'POST',  
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ reason: 'user_payment' })  // optional payload
//       });
//       const data = await response.json();
//       console.log("Detection stopped:", data);
//     } catch (error) {
//       console.error("Error calling /stop:", error);
//     }
//   };

//   const handlePayment = async () => {

    

//     await handleStop();
//     navigate('/payment');
//   };

//   // Handle tab close / refresh
//   useEffect(() => {
//     const stopOnUnload = () => {
//       if (detectionStarted) {
//         // Use sendBeacon for reliable requests on page unload
//         navigator.sendBeacon("https://krrishcoder07-autobill-backend.hf.space/stop", JSON.stringify({ reason: 'page_unload' }));
//       }
//     };

//     window.addEventListener('beforeunload', stopOnUnload);
//     window.addEventListener('pagehide', stopOnUnload); // for Safari and other browsers

//     return () => {
//       window.removeEventListener('beforeunload', stopOnUnload);
//       window.removeEventListener('pagehide', stopOnUnload);
//     };
//   }, [detectionStarted]);

//   // Handle React Router navigation (including back button)
//   useEffect(() => {
//     // Only stop detection if the path changes AND detection was previously started
//     if (detectionStarted && location.pathname !== prevPath) {
//       handleStop(); // Stop detection if route changed
//     }
//     setPrevPath(location.pathname);
//   }, [location, detectionStarted, prevPath]); // Added detectionStarted and prevPath to dependencies

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"> {/* Main container for centering */}
//       {/* Changed items-start to items-stretch to make children fill available height */}
//       <div className="flex flex-col md:flex-row gap-4 items-stretch"> {/* New flex container for the cards */}
//         {isLoggedIn && !showCart && (
//           <Link 
//           to="/dashboard" 
//           className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg flex flex-col justify-center items-center hover:bg-blue-100 transition-colors duration-300"
//       >
      
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center cursor-pointer">Dashboard</h2> {/* Added text-center */}
            
//               <p>Go to Dashboard</p>
           
          
//            </Link>
//         )}

//         <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg hover:bg-blue-100 transition-colors duration-300 cursor-pointer"> {/* YOLO detection card */}
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">YOLO Detection</h2>

//           <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md mb-4">
//             <p className="font-semibold">Status: {data.response}</p>
//           </div>

//           {!detectionStarted && (
//             <button
//               onClick={handleStart}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4"
//             >
//               Start Detection
//             </button>
//           )}

//           {showCart && (
//             <>
//               <p className="text-gray-600 mb-4">Camera stream is active. Please ensure your camera is enabled.</p>
//               <p className="text-green-600 mb-4">Detection Started!</p>
//               <WebSocketComponent />
//               <button
//                 onClick={handlePayment}
//                 className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//               >
//                 Stop Prediction and Pay Now
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
