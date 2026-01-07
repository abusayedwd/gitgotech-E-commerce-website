"use client"

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function SelectSize() {
    const router = useRouter()
  const [users, setUsers] = useState([
    { id: 1, name: "Alex James", avatar: "/api/placeholder/48/48", size: "Size" },
    { id: 2, name: "Alex James", avatar: "/api/placeholder/48/48", size: "Size" },
    { id: 3, name: "Alex James", avatar: "/api/placeholder/48/48", size: "Size" },
    { id: 4, name: "Alex James", avatar: "/api/placeholder/48/48", size: "Size" },
    { id: 5, name: "Alex James", avatar: "/api/placeholder/48/48", size: "Size" },
    { id: 6, name: "Alex James", avatar: "/api/placeholder/48/48", size: "Size" }
  ]);

  type User = {
    id: number;
    name: string;
    avatar: string;
    size: string;
  };

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "S/28", "M/30", "L/32", "XL/34"];

  const handleSizeSelect = (userId: number, size: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, size } : user
    ));
    setOpenDropdown(null);
  };

  const toggleDropdown = (userId: number) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const handleUpdate = () => {
    console.log('Updated sizes:', users);
    // Handle update logic here
  };

  return (
    <div className="min-h-screen mt-1 bg-gradient-to-r from-black via-[#0f0924] to-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="container pb-4 mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Select Size</h1>
        </div>

        {/* User Cards */}
        <div className="space-y-4 mb-6">
          {users.map((user) => (
            <div 
              key={user.id}
              className="bg-[#2F2543] border border-[#67676D] rounded-xl p-4 flex items-center justify-between hover:border-purple-500 transition-all duration-200"
            >
              {/* User Info */}
              <div className="flex items-center gap-4">
                <img 
                  src={"/images/person.png"} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                />
                <span className="text-white font-medium">{user.name}</span>
              </div>

              {/* Size Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(user.id)}
                  className={`flex items-center gap-8 px-6 py-3 rounded-lg transition-all duration-200 min-w-[120px] justify-between ${
                    user.size === "Size" 
                      ? 'bg-[#242428]   text-gray-400' 
                      : 'bg-[#242428]   text-purple-400'
                  } `}
                >
                  <span className="font-medium">{user.size}</span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform ${openDropdown === user.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === user.id && (
                  <div className="absolute top-full mt-2 right-0 w-40 bg-[#2a2438] border border-purple-500 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(user.id, size)}
                        className={`w-full px-4 py-2.5 text-left hover:bg-purple-600/30 transition-colors ${
                          user.size === size ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full bg-[#6100FF] cursor-pointer text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg  "
        >
          Update
        </button>
      </div>

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}