"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/approvals");
      router.refresh();
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Call NextAuth Credentials provider
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // If successful, push them to the secure approvals list
      router.push("/approvals");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      {/* Show loading while checking session status */}
      {status === "loading" && (
        <div className="w-full max-w-md p-8 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="text-center">
            <p className="text-gray-400">Checking authentication...</p>
          </div>
        </div>
      )}

      {/* Show login form only if not authenticated and not loading */}
      {status === "unauthenticated" && (
        <div className="w-full max-w-md p-8 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to the Approval Engine</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="eg: teacher@school.com"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="eg: password123"
              className="w-full pr-28 px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-[65%] -translate-y-1/2 p-2 text-gray-400 bg-transparent hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M1 1l22 22" />
                  <path d="M17.94 17.94A10.49 10.49 0 0 1 12 19.5c-5.25 0-9.8-3.36-11.42-8.1a1 1 0 0 1 0-.8A10.49 10.49 0 0 1 6.06 6.06" />
                  <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
                  <path d="M15 12a3 3 0 0 0-3-3" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
      )}
    </main>
  );
}