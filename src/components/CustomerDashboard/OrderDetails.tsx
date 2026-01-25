"use client"
import React, { useState } from 'react';
import { Star, User, Shield, MessageCircle } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/customComponent/BackButton';

const OrderDetails = () => {
    const router = useRouter()
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const product = {
    name: "Jacket",
    price: 28.00,
    originalPrice: 32.00,
    discount: "10% OFF",
    size: "M",
    quantity: 1,
    rating: 4.5,
    reviews: 20,
    image: "/images/jacket.png",
    description: "Lorem ipsum dolor sit amet consectetur. Lacus et venenatis gravida vivamus mauris."
  };
  const isDecline = true;



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setImageFiles([...imageFiles, ...filesArray]);
      
      const newImages: string[] = [];
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === filesArray.length) {
              setUploadedImages([...uploadedImages, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

   const handleSubmit = () => {
    console.log('===== REPORT SUBMISSION =====');
    console.log('Image Files:', imageFiles);
    console.log('Reason:', reason);
    console.log('Total Images:', imageFiles.length);
    
    // Log each file details
    imageFiles.forEach((file, index) => {
      console.log(`Image ${index + 1}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified)
      });
    });
    console.log('============================');
    
    alert('Report submitted! Check console for details.');
    setShowModal(false);
    setUploadedImages([]);
    setImageFiles([]);
    setReason('');
  };


  const reviews = [
    { id: 1, name: "William Alex", avatar: "https://placehold.co/40x40/6C757D/FFFFFF?text=WA", comment: "Lorem ipsum dolor sit amet consectetur. Lacus et venenatis gravida vivamus mauris." },
    { id: 2, name: "Sarah Johnson", avatar: "https://placehold.co/40x40/6C757D/FFFFFF?text=SJ", comment: "Excellent quality and fit! Very happy with my purchase." },
    { id: 3, name: "Mike Chen", avatar: "https://placehold.co/40x40/6C757D/FFFFFF?text=MC", comment: "Great jacket for the price. Shipping was fast too!" }
  ];

  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star 
      key={i} 
      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
    />
  ));

  return (
    <div className="min-h-screen mt-20 container mx-auto bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8"> 
        <BackButton title='View Details' className='text-[24px]' /> 
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full object-contain rounded-lg shadow-lg"
          />
          <button className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
            Mix Design
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className='flex justify-between'>
            <div><h2 className="text-3xl font-bold">{product.name}</h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center space-x-1">
                {stars}
              </div>
              <span className="ml-2 text-sm text-gray-400">{product.reviews} Reviews</span>
            </div>
            </div>
            <div>
                  <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
          <Link href={"/customer-dashboard/return-request"}>
     <div 
             className="bg-[#6100FF] px-4 py-2 rounded-lg text-sm font-medium">Return</div>
           </Link>
           
            <div className="bg-[#0070254D] text-[#00DD00] px-4 py-1 rounded-lg text-sm font-medium">Completed</div>
          </div>
          
          {/* <button className="bg-purple-600 rounded-full p-2">
            <MessageCircle className="w-6 h-6" />
          </button> */}
        </div>
            </div>
            
            
            {/* Reviewer Avatars */}
            
          </div>

          {/* Reviews Section */}
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-500">
            <div className="flex items-start space-x-3">
              <img 
                src={reviews[0].avatar} 
                alt={reviews[0].name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{reviews[0].name}</h3>
                <p className="text-sm text-gray-400 mt-1">{reviews[0].comment}</p>
              </div>
            </div>
          </div>

          {/* Price & Discount */}
          <div className="space-y-3">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-full w-fit text-sm font-medium">
              {product.discount}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xl line-through text-gray-400">${product.originalPrice}</span>
              <span className="text-2xl font-bold text-purple-400">${product.price}</span>
            </div>
            <div className="text-sm text-gray-400">
              Size: {product.size}
            </div>
            <div className="text-sm text-gray-400">
              Qty: {product.quantity}
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-500">
            <div className="text-center text-lg font-medium">
              Total Price: ${product.price * product.quantity}
            </div>
          </div>

          {/* Buy Again Button */}
        
            {
                isDecline ? (
                    <div className='flex gap-2.5'>
            <button  
              onClick={() => setShowReportModal(true)}
            className="w-full bg-[#6100FF] cursor-pointer text-white py-3 rounded-lg font-medium transition-colors">
             Report
          </button>
                 <button 
        onClick={() => setShowModal(true)}
        className="w-full max-w-md border text-[#6100FF] cursor-pointer border-gray-500 py-3 rounded-lg font-medium transition-colors hover:bg-[#6100FF]/10"
      >
        View Reason
      </button>
           </div>
                ): (
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
            Buy Again
          </button>

                )
            }

            {/* report modal show */}
        {showReportModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-md bg-black border border-gray-800 rounded-2xl p-6">
            {/* Close Button */}
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-center mb-2 text-white">Report</h2>
            <p className="text-gray-400 text-sm text-center mb-6">Your report will go to admin</p>

            {/* Upload Images Section */}
            <div className="mb-6">
              <label className="block text-sm text-white mb-3">Upload Images</label>
              <div className="flex gap-3">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                    <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                <label className="w-20 h-20 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors bg-gray-900/50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-purple-400 text-xs mt-1">Upload</span>
                </label>
              </div>
            </div>

            {/* Reason Textarea */}
            <div className="mb-6">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Write your reason"
                className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 min-h-[120px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* view reson modalll?????????????      */}
 {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-lg bg-black border-2 border-[#6100FF] rounded-2xl p-8">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-3xl font-serif text-center mb-8 text-white">Reason</h2>

            {/* Content */}
            <p className="text-gray-300 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Enim non sit varius in volutpat amet nisl. Faucibus lacus elit faucibus tempus scelerisque. Sagittis at orci rutrum lorem arcu at massa. Ac sed accumsan ipsum ornare blandit. Facilisi lacus lorem sodales diam.
              Lorem ipsum dolor sit amet consectetur. Enim non sit varius in volutpat amet nisl. Faucibus lacus elit faucibus tempus scelerisque. Sagittis at orci rutrum lorem arcu at massa. Ac sed accumsan ipsum ornare blandit. Facilisi lacus lorem sodales diam.
            </p>
          </div>
        </div>
      )}

        </div>
      
      </div>
    </div>
  );
};

export default OrderDetails;
