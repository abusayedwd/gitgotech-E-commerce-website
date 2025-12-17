// app/verify-email/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  // Simulate getting email from URL or localStorage (you would replace this with actual logic)
  useEffect(() => {
    // In a real app, you might get the email from URL params or session storage
    const storedEmail = localStorage.getItem('verificationEmail') || 'yourmail@gmail.com';
    setEmail(storedEmail);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate OTP is complete
      if (otp.some(digit => digit === '')) {
        throw new Error('Please enter all 5 digits of the OTP');
      }
      
      const otpCode = otp.join('');
     
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      // Redirect after success (adjust as needed)
      setTimeout(() => {
        router.push('/auth/update-password'); // or wherever you want to redirect
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Main Card */}
        <div className=" rounded-2xl p-8 shadow-2xl border border-blue-500/30 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Verify your email</h1>
            
            <p className="text-gray-400 text-center mb-6">
              We've sent an email with an activation code to your
            </p>
            
            <p className="text-center mb-8">
              <span className="text-gray-300">Email </span>
              <span className="text-purple-400 font-medium">{email}</span>
            </p>
            
            {/* OTP Input */}
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-xl font-semibold bg-gray-800 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    pattern="[0-9]"
                    inputMode="numeric"
                  />
                ))}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || success}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isLoading || success
                    ? 'bg-purple-600 cursor-not-allowed opacity-70'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V6a6 6 0 616 6h2a8 8 0 11-16 0z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : success ? (
                  'Verified! Redirecting...'
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                Email verified successfully! Redirecting to update password...
              </div>
            )}
          </div>
        </div>
        
        {/* Optional: Resend link */}
        <div className="mt-4 text-center">
          <button 
            onClick={() => {
              // Handle resend logic
              alert('Resend verification email functionality would go here');
            }}
            className="text-sm text-gray-400 hover:text-gray-300 underline"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </div>
  );
}