import React, { useRef, useEffect, useState } from 'react';

const VideoStreamer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    const socket = new WebSocket('ws://auto-bill-backend.onrender.com/ws');
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg'); // Base64 encoded

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(imageData);
    }
  };

  // Capture frame every 500ms
  useEffect(() => {
    const interval = setInterval(sendFrame, 500);
    return () => clearInterval(interval);
  }, [ws]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="320" height="240" />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
    </div>
  );
};

export default VideoStreamer;
