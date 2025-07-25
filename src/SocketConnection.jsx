import React, { useEffect, useRef, useState } from 'react';
import './styles/socket_page.css';

const CombinedWebSocketCameraComponent = ({onCartUpdate}) => {
  const socketRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [cartItems, setCartItems] = useState({});
  const [recentlyDetected, setRecentlyDetected] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const cooldown = 3000; // Cooldown period in milliseconds

  // Function to get user ID from localStorage
  const getUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.user_id || parsedData.id; // Handle different possible field names
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  };

  // Function to fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }

      const response = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/user-products/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const productsData = await response.json();
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Failed to load products: ${err.message}`);
      setProducts([]); // Set empty array as fallback
    } finally {
      setLoading(false);
    }
  };

  // Whenever cartItems changes, notify the parent
  useEffect(() => {
    if (onCartUpdate && typeof onCartUpdate === 'function') {
      onCartUpdate(cartItems);
    }
  }, [cartItems]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Initialize camera and WebSocket after products are loaded
  useEffect(() => {
    if (!loading && products.length > 0) {
      initCamera();
      startWebSocket();
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [loading, products]);

  const initCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access the camera.');
    }
  };

  const startWebSocket = () => {
    socketRef.current = new WebSocket("wss://krrishcoder07-autofill-backend.hf.space/ws");

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);

      // Start sending frames
      intervalRef.current = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          const base64 = canvasRef.current.toDataURL("image/jpeg", 0.8);
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(base64);
          }
        }
      }, 1000); // 1 FPS
    };

    socketRef.current.onmessage = (event) => {
      const detections = JSON.parse(event.data);
      const now = Date.now();

      if (!Array.isArray(detections) || detections.length === 0) return;

      setCartItems(prevCartItems => {
        const updatedItems = { ...prevCartItems };

        detections.forEach(det => {
          const itemClass = det.class_name;
          const confidenceScore = det.confidence;

          // Check if confidence score is above threshold
          if (confidenceScore > 0.6) {
            const lastDetected = recentlyDetected[itemClass] || 0;

            // Check cooldown
            if (now - lastDetected < cooldown) return;

            // Find matching product from API data
            const matchedProduct = products.find(product => 
              product.title.toLowerCase() === itemClass.toLowerCase()
            );

            

            if (matchedProduct) {
              // Only add the item if it's not already in the cart
              if (!updatedItems[itemClass]) {
                updatedItems[itemClass] = {
                  title: itemClass,
                  product_id: matchedProduct.product_id,
                  image: matchedProduct.image || "",
                  price: parseFloat(matchedProduct.price) || 0,
                  confidence: confidenceScore,
                  quantity: 1 // Start with quantity 1
                };

                // Update detection timestamp
                setRecentlyDetected(prev => ({ ...prev, [itemClass]: now }));
              }
            }
          }
        });

        return updatedItems;
      });
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError('WebSocket connection failed');
      setIsConnected(false);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  };

  const increaseQuantity = (itemKey) => {
    setCartItems(prev => ({
      ...prev,
      [itemKey]: { ...prev[itemKey], quantity: prev[itemKey].quantity + 1 }
    }));
  };

  const decreaseQuantity = (itemKey) => {
    setCartItems(prev => {
      const updated = { ...prev };
      updated[itemKey].quantity -= 1;
      if (updated[itemKey].quantity <= 0) {
        delete updated[itemKey];
      }
      return updated;
    });
  };

  const totalPrice = Object.values(cartItems).reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Show loading state
  if (loading) {
    return (
      <div className="container p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  // Show error state if products couldn't be loaded
  if (error && products.length === 0) {
    return (
      <div className="container p-4">
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={fetchProducts}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <h2 className="text-xl font-bold mb-4">Streaming Camera Frames to FastAPI</h2>
      
      <div className="mb-4 flex items-center space-x-4">
        <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
        
        <div className="text-sm text-gray-600">
          Products loaded: {products.length}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          {error}
        </div>
      )}

      <video 
        ref={videoRef}
        autoPlay 
        muted 
        playsInline 
        width="320" 
        height="240"
        className="border border-gray-300 rounded"
      />
      
      <canvas 
        ref={canvasRef}
        width="320" 
        height="240" 
        style={{ display: 'none' }}
      />

      <h2 id="cart-heading" className="mt-6">Cart Items</h2>
      <ul className="cart-list space-y-4">
        {Object.entries(cartItems).map(([key, item], index) => (
          <li key={index} className="cart-item flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
            <img src={item.image} alt={item.title} className="item-image w-16 h-16 rounded object-cover" />
            <div className="item-info flex-grow">
              <span className="item-name text-lg font-semibold">{item.title}</span>
              <span className="item-price text-gray-700 block">Price: ${item.price.toFixed(2)}</span>
              <span className="item-confidence text-sm text-blue-600 block">Max Confidence: {item.confidence.toFixed(2)}</span>
            </div>
            <div className="quantity-controls flex items-center space-x-2">
              <button
                onClick={() => decreaseQuantity(key)}
                className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(key)}
                className="bg-green-400 text-white px-2 py-1 rounded hover:bg-green-500"
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <section className="total-price-container mt-6 bg-gray-100 p-4 rounded-md shadow-sm">
        <span className="total-price-label font-semibold text-lg">Total Price:</span>
        <span className="total-price-value text-lg ml-2">${totalPrice.toFixed(2)}</span>
      </section>
    </div>
  );
};

export default CombinedWebSocketCameraComponent;





// import React, { useEffect, useRef, useState } from 'react';
// import './styles/socket_page.css';
// import products from './data/pricingData.json';

// const CombinedWebSocketCameraComponent = ({onCartUpdate}) => {
//   const socketRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const intervalRef = useRef(null);
//   const [cartItems, setCartItems] = useState({});
//   const [recentlyDetected, setRecentlyDetected] = useState({});
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState(null);
//   const cooldown = 3000; // Cooldown period in milliseconds





//   // Whenever cartItems changes, notify the parent
//   useEffect(() => {
//     if (onCartUpdate && typeof onCartUpdate === 'function') {
//       onCartUpdate(cartItems);
//     }
//   }, [cartItems]); // runs when cartItems is updated



//   useEffect(() => {
//     initCamera();
//     startWebSocket();

//     // Cleanup on unmount
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//       if (videoRef.current && videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach(track => track.stop());
//       }
//     };
//   }, []);

//   const initCamera = async () => {
//     try {

//       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         console.error("getUserMedia is not supported in this browser.");
//         return;
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current.play();
//         };
//       }
//     } catch (err) {
//       console.error('Camera error:', err);
//       setError('Could not access the camera.');
//     }
//   };

//   const startWebSocket = () => {
//     socketRef.current = new WebSocket("wss://krrishcoder07-autofill-backend.hf.space/ws");

//     socketRef.current.onopen = () => {
//       console.log("WebSocket connected");
//       setIsConnected(true);
//       setError(null);

//       // Start sending frames
//       intervalRef.current = setInterval(() => {
//         if (videoRef.current && canvasRef.current) {
//           const ctx = canvasRef.current.getContext('2d');
//           ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
//           const base64 = canvasRef.current.toDataURL("image/jpeg", 0.8);
//           if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//             socketRef.current.send(base64);
//           }
//         }
//       }, 1000); // 5 FPS
//     };

//     socketRef.current.onmessage = (event) => {
//       const detections = JSON.parse(event.data);
//       const now = Date.now();

//       if (!Array.isArray(detections) || detections.length === 0) return;

//       setCartItems(prevCartItems => {
//         const updatedItems = { ...prevCartItems };

//         detections.forEach(det => {
//           const itemClass = det.class_name;
//           const confidenceScore = det.confidence;

//           // Check if confidence score is above threshold
//           if (confidenceScore > 0.6) {
//             const lastDetected = recentlyDetected[itemClass] || 0;

//             // Check cooldown
//             if (now - lastDetected < cooldown) return;

//             const matchedProduct = products.find(product => product.title === itemClass);

//             if (matchedProduct) {
//               // Only add the item if it's not already in the cart
//               if (!updatedItems[itemClass]) {
//                 updatedItems[itemClass] = {
//                   title: itemClass,
//                   product_id : matchedProduct.product_id ,
//                   image : matchedProduct.image || "",
//                   price: matchedProduct.price,
//                   confidence: confidenceScore,
//                   quantity: 1 // Start with quantity 1
//                 };

//                 // Update detection timestamp
//                 setRecentlyDetected(prev => ({ ...prev, [itemClass]: now }));
//               }
//             }
//           }
//         });

//         return updatedItems;
//       });
//     };

//     socketRef.current.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       setError('WebSocket connection failed');
//       setIsConnected(false);
//     };

//     socketRef.current.onclose = () => {
//       console.log("WebSocket closed");
//       setIsConnected(false);
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   };

//   const increaseQuantity = (itemKey) => {
//     setCartItems(prev => ({
//       ...prev,
//       [itemKey]: { ...prev[itemKey], quantity: prev[itemKey].quantity + 1 }
//     }));
//   };

//   const decreaseQuantity = (itemKey) => {
//     setCartItems(prev => {
//       const updated = { ...prev };
//       updated[itemKey].quantity -= 1;
//       if (updated[itemKey].quantity <= 0) {
//         delete updated[itemKey];
//       }
//       return updated;
//     });
//   };

//   const totalPrice = Object.values(cartItems).reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <div className="container p-4">
//       <h2 className="text-xl font-bold mb-4">Streaming Camera Frames to FastAPI</h2>
      
//       <div className="mb-4">
//         <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${
//           isConnected 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-red-100 text-red-800'
//         }`}>
//           {isConnected ? 'Connected' : 'Disconnected'}
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       <video 
//         ref={videoRef}
//         autoPlay 
//         muted 
//         playsInline 
//         width="320" 
//         height="240"
//         className="border border-gray-300 rounded"
//       />
      
//       <canvas 
//         ref={canvasRef}
//         width="320" 
//         height="240" 
//         style={{ display: 'none' }}
//       />

//       <h2 id="cart-heading" className="mt-6">Cart Items</h2>
//       <ul className="cart-list space-y-4">
//         {Object.entries(cartItems).map(([key, item], index) => (
//           <li key={index} className="cart-item flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
//             <img src={item.image} alt={item.title} className="item-image w-16 h-16 rounded object-cover" />
//             <div className="item-info flex-grow">
//               <span className="item-name text-lg font-semibold">{item.title}</span>
//               <span className="item-price text-gray-700 block">Price: ${item.price.toFixed(2)}</span>
//               <span className="item-confidence text-sm text-blue-600 block">Max Confidence: {item.confidence.toFixed(2)}</span>
//             </div>
//             <div className="quantity-controls flex items-center space-x-2">
//               <button
//                 onClick={() => decreaseQuantity(key)}
//                 className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500"
//               >
//                 −
//               </button>
//               <span>{item.quantity}</span>
//               <button
//                 onClick={() => increaseQuantity(key)}
//                 className="bg-green-400 text-white px-2 py-1 rounded hover:bg-green-500"
//               >
//                 +
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <section className="total-price-container mt-6 bg-gray-100 p-4 rounded-md shadow-sm">
//         <span className="total-price-label font-semibold text-lg">Total Price:</span>
//         <span className="total-price-value text-lg ml-2">${totalPrice.toFixed(2)}</span>
//       </section>
//     </div>
//   );
// };

// export default CombinedWebSocketCameraComponent;
