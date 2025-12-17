"use client";

import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Handle login logic here
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated gradient orbs in background */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-10 right-24 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Login Card */}
      <div className="relative w-full max-w-lg">
        {/* Cyan border glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-3xl blur-sm"></div>
        
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-cyan-500/30 p-8 shadow-2xl">
          {/* Logo and brand badges */}
          <div className="flex items-start justify-between mb-8">
            <div className="relative w-20 h-20">
              <Image
                src="/images/logo.png"
                alt="TeeKnit Logo"
                fill
                className="object-contain"
              />
            </div>
            
            {/* Gradient badges */}
             
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back to <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">TeeKnit</span>
            </h1>
            <p className="text-gray-400 text-sm">You've been missed!</p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address or user name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your email or user name"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="• • • • • • • • •"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30"
            >
              Sign In
            </button>

            {/* Create Account Link */}
            <div className="text-center pt-2">
              <span className="text-gray-400 text-sm">New Here? </span>
              <Link 
                href="/auth/sign-up" 
                className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}