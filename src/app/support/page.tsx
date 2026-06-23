"use client";
import React from "react";

export default function ContactSupport() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Support</h1>
        <p className="text-white/60 mb-8">
          Have a question or need help with the KALNET Approval Workflow Engine? Fill out the form below and our team will get back to you.
        </p>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">Message</label>
            <textarea 
              id="message" 
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              placeholder="How can we help?"
            ></textarea>
          </div>
          <button 
            type="button" 
            className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => alert("Thanks for your message! Our support team will get back to you soon.")}
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}