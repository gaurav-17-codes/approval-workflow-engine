"use client";
import React, { useEffect, useRef } from 'react';

export default function CursorBlob() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    // Start in the center of the screen
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blobX = mouseX;
    let blobY = mouseY;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    const followCursor = () => {
      // The 0.05 multiplier creates a smooth, delayed trailing effect
      blobX += (mouseX - blobX) * 0.05;
      blobY += (mouseY - blobY) * 0.05;

      // Center the 400x400 blob perfectly on the cursor
      blob.style.transform = `translate(${blobX - 200}px, ${blobY - 200}px)`;

      animationFrameId = requestAnimationFrame(followCursor);
    };

    followCursor();

    // Cleanup to prevent memory leaks
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={blobRef} 
      className="cursor-blob" 
      style={{ 
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex:  0//-1 Sets the blob behind your interactive content
      }} 
    />
  );
}