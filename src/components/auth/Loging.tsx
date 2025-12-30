"use client";

import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()

  // const handleSubmit = () => {
  //   // Handle login logic here
  //   console.log('Login:', { email, password });
  //    const users = { email, password }
  //     const user= localStorage.setItem('user', JSON.stringify(users))
  // };

// const handleSubmit = () => {
//   let role = 'customer';

//   if (email === 'vendor@gmail.com') {
//     role = 'vendor';
//   } else if (email === 'user@gmail.com') {
//     role = 'customer';
//   } else {
//     alert('Invalid test user');
//     return;
//   }

//   const user = {
//     email,
//     role,
//     isLoggedIn: true,
//   };

//   localStorage.setItem('user', JSON.stringify(user));
  
//   router.push("/")

// };


const handleSubmit = () => {
  let role = 'customer';

  if (email === 'vendor@gmail.com') {
    role = 'vendor';
  } else if (email === 'user@gmail.com') {
    role = 'customer';
  } else {
    alert('Invalid test user');
    return;
  }

  const user = {
    email,
    role,
    isLoggedIn: true,
  };

  localStorage.setItem('user', JSON.stringify(user));

  if (role === 'vendor') {
    router.push('/vendor-dashboard');
  } else {
    router.push('/');
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black flex items-center justify-center p-4">
      {/* Animated gradient orbs in background */}
      

      {/* Login Card */}
      <div className="relative w-full max-w-lg">
        {/* Cyan border glow effect */}
        
        
        <div className="relative bg-gradient-to-t from-[#241F30] to-[#161617] border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-[#856096] rounded-2xl p-8 ">
          {/* Logo and brand badges */}
          <div className="flex items-start justify-between mb-2">
            <div className="relative w-32 h-32">
              <Image
                src="/images/llogo.png"
                alt="TeeKnit Logo"
                fill
                className="object-contain "
              />
            </div>
               
            
            {/* Gradient badges */}
             
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h1 className="text-[36px] font-cormorant font-bold text-white mb-2">
              Welcome back to <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">SleeKnit</span>
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
              className="w-full bg-[#6100FF] cursor-pointer font-poppins  text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-purple-500/30"
            >
              Sign In
            </button>

            {/* Create Account Link */}
            <div className="text-center pt-2">
              <span className="text-gray-400 text-sm">New Here?</span>
              <Link 
                href="/auth/sign-up" 
                className="text-sm text-white hover:text-purple-300 font-medium transition-colors"
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