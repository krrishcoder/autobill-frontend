import React, { useEffect, useRef, useState } from 'react';
import './styles/socket_page.css';
import products from './data/pricingData.json';

const CombinedWebSocketCameraComponent = () => {
  const socketRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [cartItems, setCartItems] = useState({});
  const [recentlyDetected, setRecentlyDetected] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const cooldown = 3000; // Cooldown period in milliseconds

  useEffect(() => {
    initCamera();
    startWebSocket();

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
  }, []);

  const initCamera = async () => {
    try {
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
      }, 1000); // 5 FPS
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

            const matchedProduct = products.find(product => product.title === itemClass);
            if (matchedProduct) {
              // Only add the item if it's not already in the cart
              if (!updatedItems[itemClass]) {
                updatedItems[itemClass] = {
                  title: itemClass,
                  image: matchedProduct.image || "",
                  price: matchedProduct.price,
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

  return (
    <div className="container p-4">
      <h2 className="text-xl font-bold mb-4">Streaming Camera Frames to FastAPI</h2>
      
      <div className="mb-4">
        <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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
