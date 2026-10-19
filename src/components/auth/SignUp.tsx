"use client";

import { useState, FormEvent, useEffect } from 'react';
import { User, Lock, Mail, Eye, EyeOff, UserCircle, Phone, Upload, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRegisterUserMutation } from '@/redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usePrivacyTermsModal } from '@/context/PrivacyTermsModalContext';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('customer');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState(" ")
  const [pathName, setPathName] = useState("");
  const router = useRouter()
  const { openTerms, openPrivacy } = usePrivacyTermsModal();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Vendor-only KYC uploads — required by the backend when role = vendor.
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
  const [nidBackFile, setNidBackFile] = useState<File | null>(null);

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    image: '',
    nidFront: '',
    nidBack: '',
    terms: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      image: '',
      nidFront: '',
      nidBack: '',
      terms: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Vendor KYC uploads — required only for vendor sign-up
    if (userType === 'vendor') {
      if (!imageFile) {
        newErrors.image = 'Profile image is required';
        isValid = false;
      }
      if (!nidFrontFile) {
        newErrors.nidFront = 'NID front image is required';
        isValid = false;
      }
      if (!nidBackFile) {
        newErrors.nidBack = 'NID back image is required';
        isValid = false;
      }
    }

    // Terms validation
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and privacy policy';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathName(window.location.pathname);
    }
  }, []);

  const [signUpUser] = useRegisterUserMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('username', formData.username);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('password', formData.password);
    submitData.append('role', userType);
    if (userType === 'vendor') {
      if (imageFile) submitData.append('image', imageFile);
      if (nidFrontFile) submitData.append('nidFront', nidFrontFile);
      if (nidBackFile) submitData.append('nidBack', nidBackFile);
    }

    try {
      const res = await signUpUser(submitData).unwrap();
      // console.log(res)
      if (res?.status === 200 || res?.success) {
        const token = res?.token || res?.data?.token || '';
        toast.success(typeof res?.message === 'string' ? res?.message : 'Sign up successful! Please verify your email')
        localStorage.setItem("token", token)
        router.push(`/auth/verify-email?path=${pathName}&email=${formData.email}&token=${token}`)
      }
    } catch (error: any) {
      // console.log(error);
      const errorMessage = typeof error?.data?.message === 'string'
        ? error?.data?.message
        : 'An error occurreddddd';
      setError(errorMessage);
      toast.error(errorMessage);
    };
  };

  interface FormDataType {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }

  interface ErrorsType {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    terms: string;
  }

  const handleInputChange = (field: keyof FormDataType, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ErrorsType]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTermsChange = (checked: boolean): void => {
    setAgreeTerms(checked);
    if (errors.terms && checked) {
      setErrors(prev => ({ ...prev, terms: '' }));
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-black light:bg-white flex items-center justify-center p-4 py-8">
      {/* Sign Up Card */}
      <div className="relative w-full max-w-lg">
        {/* Cyan border glow */}
        <div className="absolute inset-0  bg-[#151579] rounded-3xl blur-sm"></div>

        <div className="relative bg-gradient-to-t from-[#241F30] to-[#161617] light:from-white light:to-purple-50 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-[#856096] light:border-purple-200 rounded-2xl p-8">
          {/* Logo placeholder */}
          <div className="flex items-start justify-between">
            <Image
              src="/images/logoo.png"
              alt="TeeKnit Logo"
              width={100}
              height={100}
              className="object-contain h-36 w-36"
            />
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[36px] font-cormorant font-bold text-white light:text-gray-900 mb-1">
              Create an account
            </h1>
            <p className="text-gray-400 light:text-gray-500 font-poppins text-sm">Create your account and get started</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-white light:text-gray-800 text-sm font-medium mb-3">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserType('customer')}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  userType === 'customer'
                    ? 'bg-[#1A1523] light:bg-purple-100 text-white light:text-gray-900  border border-[#B630F4]'
                    : 'bg-[#3c3c50] light:bg-gray-100 text-gray-400 light:text-gray-500 border hover:border-gray-600'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setUserType('vendor')}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  userType === 'vendor'
                    ? 'bg-[#1A1523] light:bg-purple-100 text-white light:text-gray-900  border border-[#B630F4]'
                    : 'bg-[#3c3c50] light:bg-gray-100 text-gray-400 light:text-gray-500 border hover:border-gray-600'
                }`}
              >
                Vendor
              </button>
            </div>
            {userType === 'vendor' && (
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg light:bg-yellow-50 light:border-yellow-300">
                <p className="text-yellow-400 text-xs light:text-yellow-700">
                  Note: Vendor accounts require admin approval. You'll receive an email once your application is reviewed.
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter Your Name"
                  className={`w-full bg-gray-800/50 light:bg-white border rounded-xl pl-12 pr-4 py-3 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-700 light:border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">User name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter a Unique User Name"
                  className={`w-full bg-gray-800/50 light:bg-white border rounded-xl pl-12 pr-4 py-3 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-700 light:border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1 ml-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter Your Email"
                  className={`w-full bg-gray-800/50 light:bg-white border rounded-xl pl-12 pr-4 py-3 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-700 light:border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter Your Phone Number"
                  className={`w-full bg-gray-800/50 light:bg-white border rounded-xl pl-12 pr-4 py-3 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-700 light:border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.phone}</p>}
            </div>

            {/* Vendor KYC uploads */}
            {userType === 'vendor' && (
              <div className="space-y-4">
                {/* Profile Image */}
                <div>
                  <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">Profile Image</label>
                  <label
                    className={`flex items-center gap-3 w-full bg-gray-800/50 light:bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                      errors.image
                        ? 'border-red-500'
                        : 'border-gray-700 light:border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    <Upload className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 light:text-gray-600 truncate">
                      {imageFile ? imageFile.name : 'Upload your profile image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        setImageFile(e.target.files?.[0] || null);
                        if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
                      }}
                    />
                  </label>
                  {errors.image && <p className="text-red-400 text-xs mt-1 ml-1">{errors.image}</p>}
                </div>

                {/* NID Front */}
                <div>
                  <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">NID Front Side</label>
                  <label
                    className={`flex items-center gap-3 w-full bg-gray-800/50 light:bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                      errors.nidFront
                        ? 'border-red-500'
                        : 'border-gray-700 light:border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 light:text-gray-600 truncate">
                      {nidFrontFile ? nidFrontFile.name : 'Upload NID front image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        setNidFrontFile(e.target.files?.[0] || null);
                        if (errors.nidFront) setErrors((prev) => ({ ...prev, nidFront: '' }));
                      }}
                    />
                  </label>
                  {errors.nidFront && <p className="text-red-400 text-xs mt-1 ml-1">{errors.nidFront}</p>}
                </div>

                {/* NID Back */}
                <div>
                  <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">NID Back Side</label>
                  <label
                    className={`flex items-center gap-3 w-full bg-gray-800/50 light:bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                      errors.nidBack
                        ? 'border-red-500'
                        : 'border-gray-700 light:border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 light:text-gray-600 truncate">
                      {nidBackFile ? nidBackFile.name : 'Upload NID back image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        setNidBackFile(e.target.files?.[0] || null);
                        if (errors.nidBack) setErrors((prev) => ({ ...prev, nidBack: '' }));
                      }}
                    />
                  </label>
                  {errors.nidBack && <p className="text-red-400 text-xs mt-1 ml-1">{errors.nidBack}</p>}
                </div>
              </div>
            )}

            {/* Create Password */}
            <div>
              <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="• • • • • • • • •"
                  className={`w-full bg-gray-800/50 light:bg-white border rounded-xl pl-12 pr-12 py-3 text-white light:text-gray-900 placeholder-gray-400 light:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-700 light:border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white light:text-gray-800 text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="• • • • • • • • •"
                  className={`w-full bg-gray-800/50 light:bg-white border rounded-xl pl-12 pr-12 py-3 text-white light:text-gray-900 placeholder-gray-400 light:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-700 light:border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => handleTermsChange(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800/50 text-purple-600 focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-400 light:text-gray-500">
                I agree to SleeKnit's{' '}
                <span
                  onClick={openTerms}
                  className="text-purple-400 hover:text-purple-300 cursor-pointer underline"
                >
                  Terms of Use
                </span>
                {' '}and{' '}
                <span
                  onClick={openPrivacy}
                  className="text-purple-400 hover:text-purple-300 cursor-pointer underline"
                >
                  Privacy Policy
                </span>
              </label>
            </div>
            {errors.terms && <p className="text-red-400 text-xs mt-1 ml-5">{errors.terms}</p>}

            {/* Sign Up Button */}
             <p className='text-red-500'>{error}</p>
            <button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700  text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30 mt-2"
            >
              Sign Up
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-2">
              <span className="text-gray-400 light:text-gray-500 text-sm">Already have an account? </span>
              <Link
                href="/auth/login"
                className="text-sm text-[#6100FF] hover:text-purple-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
