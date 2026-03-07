"use client";
import { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDeleteShowroomMutation, useGetShowroomDetailsQuery } from '@/redux/features/vendor/showroomSlice/showroomSlice';
import url from './../../redux/api/baseUrl.js';
import toast from 'react-hot-toast';

// Read time directly from ISO string (no timezone conversion)
const formatTime = (iso: string) => {
  const timeStr = iso?.slice(11, 16) ?? '00:00'; // "09:00"
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

const isClosed = (iso: string) => iso?.slice(11, 19) === '00:00:00';

export default function ViewShowroomPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: showroomDetails } = useGetShowroomDetailsQuery(id, { skip: !id });
  const [deleteShowroom, { isLoading: deleting }] = useDeleteShowroomMutation();

  const details = showroomDetails?.data;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get('id') || '');
  }, []);

  const handleDelete = async () => {
    try {
      const res = await deleteShowroom(id).unwrap();
      console.log(res);
      if(res?.status === 200){ 
        toast.success(res?.message || 'Showroom deleted');
        router.push('/v-profile');
      }
    } catch (error: any) {
      const msg = error?.data?.message || 'Failed to delete showroom';
      toast.error(typeof msg === 'string' ? msg : 'Failed to delete showroom');
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mt-16 md:mt-24 mb-2.5 md:mb-8">
        <div className="container mx-auto mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>
            <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Showroom Details</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/v-profile/update-showroom?id=${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Business Logo</h2>
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-2 border-purple-500/30">
              <img
                src={`${url}/${details?.logo}`}
                alt="Business Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-300 mb-6">Showroom's Information</h2>
          <div className="space-y-4">
            <InfoRow label="Showroom Name" value={details?.showroom_name ?? '—'} />
            <InfoRow label="Category" value={details?.showroom_category?.join(', ') ?? '—'} />
            <InfoRow label="Address" value={details?.showroom_address ?? '—'} />
            <InfoRow label="Referral Code" value={details?.referralCode ?? '—'} />
            <InfoRow label="Status" value={details?.isApprove ? 'Approved' : 'Pending Approval'} />
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-300 mb-6">Showroom Hours</h2>
          <div className="space-y-3">
            {(details?.showroom_schedule ?? []).map((slot: any) => {
              const closed = isClosed(slot.open);
              return (
                <div
                  key={slot._id}
                  className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0"
                >
                  <span className="text-white font-medium">{slot.day}</span>
                  <span className={`text-sm ${closed ? 'text-red-400' : 'text-gray-400'}`}>
                    {closed ? 'Closed' : `${formatTime(slot.open)} - ${formatTime(slot.close)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#2C223C] to-[#18161C] border border-purple-500/30 rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2 font-cormorant">Delete Showroom</h2>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-medium">{details?.showroom_name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-800/50 last:border-0">
      <span className="text-white font-medium">{label}</span>
      <span className="text-gray-400 text-sm">{value}</span>
    </div>
  );
}
