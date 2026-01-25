"use client"
import React, { useState } from 'react';
import { Upload, MapPin, User, Mail, Phone, Package, CheckCircle, AlertCircle } from 'lucide-react';

const DeliveryRequestFrom = () => {
  const [formData, setFormData] = useState({
    productImage: null,
    category: "Clothes",
    numberOfItems: "2",
    totalWeight: "1.5 kg",
    pickupLocation: "4940 Pari",
    fullName: "Dianne Russell",
    deliveryLocation: "4940 Pari",
    country: "United States",
    state: "Washington DC",
    zipCode: "20033",
    email: "dianne.russell@gmail.com",
    phone: "(603) 555-0123"
  });

  const [selectedWeightUnit, setSelectedWeightUnit] = useState("Grams (g)");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate form (simple validation)
    const isValid = formData.productImage && 
                   formData.fullName && 
                   formData.email && 
                   formData.phone && 
                   formData.deliveryLocation;
    setIsFormValid(isValid);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        productImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      alert("Delivery request submitted successfully!");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const weightUnits = ["Milligram (mg)", "Grams (g)", "Kilogram (kg)", "Pound (lb)", "Ounce (oz)"];

  return (
    <div className="min-h-screen mt-24 container mx-auto bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">New Request</h1>
          <p className="text-gray-400 mt-1">Request a delivery to send products to your friends.</p>
        </div>
        
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className=" rounded-lg p-4 border border-purple-500">
            <div className='bg-gradient-to-r from-[#2ACCED] px-4 mb-2 to-[#B630F4] py-2'>

            <h2 className="text-xl font-semibold py-2">
              Product Information
            </h2>
            </div>
            
            <div className="space-y-4">
              {/* Product Image Upload */}
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 bg-gray-800 rounded-md overflow-hidden">
                  {formData.productImage ? (
                    <img 
                      src={formData.productImage} 
                      alt="Product" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {formData.productImage && (
                    <button 
                      className="absolute top-1 right-1 bg-red-600 rounded-full p-1"
                      onClick={() => setFormData(prev => ({ ...prev, productImage: null }))}
                    >
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0L0 8l8 8 8-8z"/>
                      </svg>
                    </button>
                  )}
                </div>
                
                <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input 
                  type="text" 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              {/* Number of Items */}
              <div>
                <label className="block text-sm font-medium mb-1">Number of Items</label>
                <input 
                  type="text" 
                  name="numberOfItems"
                  value={formData.numberOfItems}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              {/* Total Weight */}
              <div>
                <label className="block text-sm font-medium mb-1">Total Weight</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    name="totalWeight"
                    value={formData.totalWeight}
                    onChange={handleInputChange}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <select 
                    value={selectedWeightUnit}
                    onChange={(e) => setSelectedWeightUnit(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {weightUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium mb-1">Pick-up location</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <MapPin className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className=" rounded-lg p-4 border border-purple-500">
            <div className='bg-gradient-to-r from-[#2ACCED] px-4 mb-2 to-[#B630F4] py-2'>

            <h2 className="text-xl font-semibold py-2">
              Delivery Address
            </h2>
            </div>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              {/* Set Location */}
              <div>
                <label className="block text-sm font-medium mb-1">Set location</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <MapPin className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {/* Country, State, Zip Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Country / Region</label>
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">States</label>
                  <select 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Washington DC">Washington DC</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Zip Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Phone className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-500">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Delivery Charge</span>
                <span>$20.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Tax</span>
                <span>$20.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-700">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">$40.00</span>
              </div>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${
                isFormValid 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              Place Delivery Request
            </button>
            
            <button className="w-full mt-3 py-2 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-800 transition-colors">
              Tip your driver
            </button>
          </div>

          {/* Weight Unit Selector */}
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-500">
            <h3 className="text-lg font-semibold mb-3">Weight Units</h3>
            <div className="space-y-2">
              {weightUnits.map(unit => (
                <button
                  key={unit}
                  onClick={() => setSelectedWeightUnit(unit)}
                  className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    selectedWeightUnit === unit
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequestFrom;
