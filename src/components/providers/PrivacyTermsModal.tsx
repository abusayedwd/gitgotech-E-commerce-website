'use client';

import { usePrivacyTermsModal } from '@/context/PrivacyTermsModalContext';
import {
  useGetPrivacyQuery,
  useGetTermsQuery,
} from '@/redux/features/settings/settingsSlice';
import { X } from 'lucide-react';

export default function PrivacyTermsModal() {
  const { activeModal, close } = usePrivacyTermsModal();

  const { data: privacyData, isLoading: isPrivacyLoading } = useGetPrivacyQuery(
    {},
    { skip: activeModal !== 'privacy' }
  );
  const { data: termsData, isLoading: isTermsLoading } = useGetTermsQuery(
    {},
    { skip: activeModal !== 'terms' }
  );

  if (!activeModal) return null;

  const isPrivacy = activeModal === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const isLoading = isPrivacy ? isPrivacyLoading : isTermsLoading;
  const content = isPrivacy ? privacyData?.data?.value : termsData?.data?.value;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4"
      onClick={close}
    >
      <div
        className="bg-gray-900 border border-purple-500/30 rounded-xl w-full max-w-2xl max-h-[80vh] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-sm text-gray-300 leading-relaxed">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-400">Loading {title.toLowerCase()}...</span>
            </div>
          ) : (
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: content || `No ${title.toLowerCase()} content available.`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
