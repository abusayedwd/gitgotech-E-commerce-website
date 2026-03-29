"use client"
import React, { useState, useEffect } from 'react';
import { Star, User, Shield, MessageCircle, Calendar } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/customComponent/BackButton';
import { useGetCustomerMainOrdersQuery } from '@/redux/features/order/orderSlice';
import url from '@/redux/api/baseUrl';
import { IMAGE_BASE_URL } from '@/lib/imageBaseUrl';

const OrderDetails = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id")
    
    const [showModal, setShowModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reason, setReason] = useState('');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    // Fetch order details
    const { data: orderData, isLoading } = useGetCustomerMainOrdersQuery();
    
    // Find the specific order
    const order = orderData?.data?.find((o: any) => o.id === orderId || o._id === orderId);
    
    const product = {
        name: order?.name || 'Product',
        price: order?.price?.amount || 0,
        originalPrice: order?.price?.amount ? order.price.amount * 1.1 : 0,
        discount: order?.price?.coupon || '10% OFF',
        size: order?.size?.[0]?.size || 'M',
        quantity: 1,
        rating: 4.5,
        reviews: 20,
        image: order?.product_images?.[0] ? `${IMAGE_BASE_URL}/${order.product_images[0]}` : '/images/jacket.png',
        description: "Lorem ipsum dolor sit amet consectetur. Lacus et venenatis gravida vivamus mauris.",
        status: order?.status || 'Processing'
    };
    
    const isDecline = product.status === 'Rejected' || product.status === 'Return Declined';
    const isCompleted = product.status === 'Delivered';

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
        setShowReportModal(false);
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

    if (isLoading) {
        return (
            <div className="min-h-screen mt-20 container mx-auto bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6 flex items-center justify-center">
                <div className="text-purple-400 text-xl">Loading order details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-20 container mx-auto bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
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
                        <div>
                            <h2 className="text-3xl font-bold">{product.name}</h2>
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
                                    {/* Show Return button only for Delivered status */}
                                    {isCompleted && (
                                        <Link href={`/customer-dashboard/return-request?id=${orderId}`}>
                                            <div className="bg-[#6100FF] px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-[#6100FF]/80">
                                                Return
                                            </div>
                                        </Link>
                                    )}
                                    <div className={`px-4 py-1 rounded-lg text-sm font-medium ${
                                        product.status === 'Delivered' ? 'bg-[#0070254D] text-[#00DD00]' :
                                        product.status === 'Rejected' ? 'bg-red-500/20 text-red-500' :
                                        product.status === 'Processing' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {product.status}
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            <span className="text-xl line-through text-gray-400">${product.originalPrice.toFixed(2)}</span>
                            <span className="text-2xl font-bold text-purple-400">${product.price.toFixed(2)}</span>
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
                            Total Price: ${(product.price * product.quantity).toFixed(2)}
                        </div>
                    </div>

                    {/* Buy Again / Report Buttons */}
                    {isDecline ? (
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
                    ) : (
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                            Buy Again
                        </button>
                    )}

                    {/* Report Modal */}
                    {showReportModal && (
                        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                            <div className="relative w-full max-w-md bg-black border border-gray-800 rounded-2xl p-6">
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h2 className="text-2xl font-semibold text-center mb-2 text-white">Report</h2>
                                <p className="text-gray-400 text-sm text-center mb-6">Your report will go to admin</p>

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

                                <div className="mb-6">
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Write your reason"
                                        className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 min-h-[120px] resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}

                    {/* View Reason Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                            <div className="relative w-full max-w-lg bg-black border-2 border-[#6100FF] rounded-2xl p-8">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h2 className="text-3xl font-serif text-center mb-8 text-white">Reason</h2>

                                <p className="text-gray-300 text-sm leading-relaxed">
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
