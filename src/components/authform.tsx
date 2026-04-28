"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (type === "signup") {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        userType,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      alert("Signup successful!");
      router.push("/login");
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (
        storedUser.email === email &&
        storedUser.password === password
      ) {
        alert(`Welcome ${storedUser.firstName}`);
        router.push("/");
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md 
      p-8 rounded-xl bg-white/5 backdrop-blur-lg 
      border border-white/10 text-white">

      <h2 className="text-2xl font-semibold text-center mb-2">
        {type === "login" ? "Login" : "Create Account"}
      </h2>

      {/* FULL NAME */}
      {type === "signup" && (
        <>
          <label className="text-sm text-gray-300">Full Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="First Name"
              className="p-3 w-1/2 bg-black/40 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-3 w-1/2 bg-black/40 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </>
      )}

      {/* EMAIL */}
      <label className="text-sm text-gray-300">Email Address</label>
      <input
        type="email"
        placeholder="abc@school.edu"
        className="p-3 bg-black/40 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* PASSWORD */}
      <label className="text-sm text-gray-300">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="p-3 w-full bg-black/40 border border-white/10 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className=" cursor-pointer absolute right-3 top-3 text-gray-400 hover:text-white"
        >
          {showPassword ?  <Eye size={18} />: <EyeOff size={18} /> }
        </button>
      </div>

      {/* USER TYPE */}
      {type === "signup" && (
        <>
          <label className="text-sm text-gray-300">User Type</label>

          <div className="relative">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/10 rounded 
              appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500
              text-white"
            >
              <option className="bg-[#0a0f1f] text-white" value="">
                Select role
              </option>
              <option className="bg-[#0a0f1f]" value="teacher">
                Teacher
              </option>
              <option className="bg-[#0a0f1f]" value="hod">
                HOD
              </option>
              <option className="bg-[#0a0f1f]" value="principal">
                Principal
              </option>
            </select>

            {/* Custom Arrow */}
            <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
              ▼
            </div>
          </div>
        </>
      )}

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 py-3 rounded-lg hover:bg-blue-500 transition shadow-md"
      >
        {type === "login" ? "Login" : "Sign Up"}
      </button>
    </div>
  );
}