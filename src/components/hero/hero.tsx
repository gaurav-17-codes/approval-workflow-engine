"use client";

import { motion } from "framer-motion";
import GlowButton from "../common/glowbutton";
import BackgroundEffects from "./backgroundeffects";
import{ useEffect, useState } from "react";

export default function Hero() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-6 overflow-hidden">
       <BackgroundEffects  />
      <div
  className="fixed w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-60"
  style={{
    left: `${position.x - 10}px`,
    top: `${position.y - 10}px`,
    transform: 'translate(-50%, -50%)',
    background: 'radial-gradient(circle, #3b82f6, #8b5cf6, #ec4899)',
  }}
/>

     

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl"
      >
        <p className="text-xs tracking-widest text-purple-400 mb-4">
          ENTERPRISE OPTIMIZATION
        </p>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          The Digital <br />
          <span className="text-gradient">Operating System</span>
        </h1>

        <p className="mt-3 text-gray-400 text-sm md:text-base">
          for Modern Enterprises
        </p>

        <p className="mt-4 text-gray-500 text-sm max-w-xl mx-auto">
          Automate institutional workflows with a precision-engineered AI layer.
         
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <GlowButton>Get Started</GlowButton>
          <GlowButton variant="blue">How it works</GlowButton>
        </div>
      </motion.div>
    </section>
  );
}