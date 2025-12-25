"use client";

import { useState } from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 const router = useRouter();
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Reset errors
    setErrors('');
    
    // Validate email
    if (!email.trim()) {
      setErrors('Please enter your email address');
      setIsLoading(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors('Please enter a valid email address');
      setIsLoading(false);
      return;
    }


    router.push('/auth/verify-email');
    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setEmail('');
    setIsSubmitted(false);
    setErrors('');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 py-8">
      {/* Animated gradient orbs */}
      {/* <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-10 right-24 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div> */}

      {/* Forgot Password Card */}
      <div className="relative w-full max-w-lg">
        {/* Cyan border glow */}
       
        
        <div className="relative bg-gradient-to-t from-[#241F30] to-[#161617] border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-[#8645a5] rounded-2xl p-8">
          {/* Logo placeholder */}
               <div className="flex items-start justify-between mb-6">
                <Image
                     src="/images/logo.png"
                     alt="TeeKnit Logo"  
                     width={64}
                     height={64}
                     className="object-contain"
                   />    
      
               </div>
     Cormorant Garamond

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-cormorant font-bold font-cormorant-garamond text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-400 text-sm">
              Forgot your password? <br /> Enter your email to receive a secure reset link.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Gmail"
                    className={`w-full bg-gray-800/50 border rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'
                    }`}
                  />
                </div>
                {errors && (
                  <div className="flex items-center gap-2 mt-1 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    {errors}
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#6100FF] cursor-pointer text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30 ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Continue'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-gray-400 text-sm">
                  We've sent a password reset link to <span className="text-purple-400">{email}</span>. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Reset Another Email
                </button>
                
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-transparent border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {/* Back to Login Link */}
          {!isSubmitted && (
            <div className="text-center pt-4">
              <span className="text-gray-400 text-sm">Remembered your password? </span>
              <span 
                onClick={() => window.location.href = '/auth/login'}
                className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
              >
                Sign in
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
