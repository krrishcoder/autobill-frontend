import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentPage() {
  const navigate = useNavigate();
  const randomPayload = `pay-now-${Date.now()}`; // unique string
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(randomPayload)}&size=200x200`;

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Scan to Pay</h2>
        <img src={qrUrl} alt="Generated QR Code" className="w-64 h-64 mx-auto mb-4" />
        <p className="text-red-600">Random QR — don't pay</p>
        <p className="text-gray-600">Use any QR code scanner or payment app to simulate payment.</p>
        <p className="text-xs mt-2 text-gray-400">Payload: <code>{randomPayload}</code></p>
        
        <button
          onClick={goHome}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
         Go Home
        </button>
      </div>
    </div>
  );
}
