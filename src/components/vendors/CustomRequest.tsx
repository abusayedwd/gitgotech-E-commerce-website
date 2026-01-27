"use client"
import { useState, useEffect } from 'react';

export default function CustomRequest() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [price, setPrice] = useState('');
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data generation
  useEffect(() => {
    const mockRequests = Array.from({ length: 47 }, (_, i) => ({
      id: `#${12512 + i}B`,
      date: `May ${5 + Math.floor(i/10)}, ${Math.floor(4 + (i % 5))}:20 PM`,
      customer: 'Tom Anderson',
      status: 'pending'
    }));
    setRequests(mockRequests);
  }, []);

  // Filter and paginate requests
  const filteredRequests = requests.filter(request => 
    request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleAccept = (request) => {
    setSelectedRequest(request);
    setModalType('accept');
    setIsModalOpen(true);
    setPrice('');
  };

  const handleDecline = (request) => {
    setSelectedRequest(request);
    setModalType('decline');
    setIsModalOpen(true);
    setReason('');
  };

  const handleSubmitPrice = () => {
    if (!price || isNaN(price) || price <= 0) return;
    
    setRequests(prev => prev.map(req => 
      req.id === selectedRequest.id ? { ...req, status: 'accepted', price: parseFloat(price) } : req
    ));
    closeModal();
  };

  const handleSendReason = () => {
    if (!reason.trim()) return;
    
    setRequests(prev => prev.map(req => 
      req.id === selectedRequest.id ? { ...req, status: 'declined', reason } : req
    ));
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setModalType(null);
    setPrice('');
    setReason('');
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-24 min-h-screen bg-linear-to-r from-black via-[#0f0924] to-black text-white font-sans">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-500">
          Custom Requests
        </h1>

        {/* Search Bar */}
        <div className="mb-6 bg-[#1a1a2e] rounded-xl max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a2e] border border-[#4d4dff] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-[#8a8a9d]"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a8a9d]">
              
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-[#1a1a2e] border border-[#4d4dff] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#22223b]">
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">Order</th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">Date</th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">Customer</th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">View</th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => (
                  <tr 
                    key={request.id} 
                    className="border-t border-[#2d2d41] hover:bg-[#22223b] transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-[#e0e0ff]">{request.id}</td>
                    <td className="px-6 py-4 text-[#c7c7d9]">{request.date}</td>
                    <td className="px-6 py-4 text-[#c7c7d9]">{request.customer}</td>
                    <td className="px-6 py-4">
                      <button className="bg-[#4d4dff] hover:bg-[#5d5dff] text-white font-medium py-1.5 px-3.5 rounded-lg transition-colors text-sm">
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button 
                        onClick={() => handleAccept(request)}
                        className="bg-[#4d4dff] hover:bg-[#5d5dff] text-white font-medium py-1.5 px-3.5 rounded-lg transition-colors text-sm"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleDecline(request)}
                        className="bg-[#ff4d6d] hover:bg-[#ff6b8b] text-white font-medium py-1.5 px-3.5 rounded-lg transition-colors text-sm"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-[#22223b] border-t border-[#2d2d41] px-6 py-4 flex items-center justify-between">
            <div className="text-[#a8a8b8] text-sm">
              {filteredRequests.length} Results
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2d2d41] hover:bg-[#4d4dff] disabled:opacity-50 transition-colors text-white"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg transition-colors text-sm ${
                    page === currentPage
                      ? 'bg-[#4d4dff] text-white font-medium'
                      : 'bg-[#2d2d41] hover:bg-[#4d4dff] text-[#a8a8b8]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2d2d41] hover:bg-[#4d4dff] disabled:opacity-50 transition-colors text-white"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          {/* MODAL CONTAINER WITH relative POSITIONING */}
          <div 
            className="bg-[#0f0f1b] border border-[#4d4dff] rounded-xl w-full max-w-md shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            {/* CLOSE BUTTON - TOP RIGHT CORNER */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#8a8a9d] hover:text-white transition-colors z-10 text-xl font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Accept Modal */}
            {modalType === 'accept' && (
              <div className="p-8 pt-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-500">
                  Provide A Price
                </h2>
                <div className="mb-6">
                  <label className="block text-sm text-[#a8a8b8] mb-2">Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter an offered price"
                    className="w-full bg-[#1a1a2e] border border-[#4d4dff] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <button
                  onClick={handleSubmitPrice}
                  disabled={!price || isNaN(price) || price <= 0}
                  className="w-full bg-[#4d4dff] hover:bg-[#5d5dff] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Decline Modal */}
            {modalType === 'decline' && (
              <div className="p-8 pt-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-500">
                  Reason
                </h2>
                <p className="text-center text-[#a8a8b8] mb-6">
                  Give a reason why do you want to decline the order.
                </p>
                <div className="mb-6">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Write your reason"
                    rows="4"
                    className="w-full bg-[#1a1a2e] border border-[#4d4dff] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white resize-none"
                  ></textarea>
                </div>
                <button
                  onClick={handleSendReason}
                  disabled={!reason.trim()}
                  className="w-full bg-[#4d4dff] hover:bg-[#5d5dff] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}