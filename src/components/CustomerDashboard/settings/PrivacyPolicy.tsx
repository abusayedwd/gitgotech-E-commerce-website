"use client";
import React from 'react';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
    const router = useRouter();
  const policyContent = [
    {
      title: "1. Information We Collect",
      text: "We collect information that you provide directly to us, including when you create an account, make a purchase, communicate with us, or otherwise use our services. This may include your name, email address, phone number, payment information, and any other information you choose to provide."
    },
    {
      title: "Personal Information",
      text: "When you register for an account, we collect personal information such as your name, email address, phone number, and billing information. This information is necessary to provide you with our services and to communicate with you about your account."
    },
    {
      title: "Usage Data",
      text: "We automatically collect certain information about your device and how you interact with our services. This includes your IP address, browser type, operating system, referring URLs, device information, pages viewed, and the dates/times of your visits."
    },
    {
      title: "2. How We Use Your Information",
      text: "We use the information we collect for various purposes, including:"
    },
    {
      title: "",
      text: "• To provide, maintain, and improve our services"
    },
    {
      title: "",
      text: "• To process transactions and send you related information"
    },
    {
      title: "",
      text: "• To send you technical notices, updates, security alerts, and support messages"
    },
    {
      title: "",
      text: "• To respond to your comments, questions, and customer service requests"
    },
    {
      title: "",
      text: "• To communicate with you about products, services, offers, and events"
    },
    {
      title: "",
      text: "• To monitor and analyze trends, usage, and activities in connection with our services"
    },
    {
      title: "",
      text: "• To detect, prevent, and address technical issues and fraudulent activity"
    },
    {
      title: "3. Information Sharing and Disclosure",
      text: "We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes. We may share your information in the following circumstances:"
    },
    {
      title: "With Your Consent",
      text: "We may share your information with third parties when we have your consent to do so."
    },
    {
      title: "Service Providers",
      text: "We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service."
    },
    {
      title: "Legal Requirements",
      text: "We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency)."
    },
    {
      title: "4. Data Security",
      text: "We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or electronic storage system is 100% secure, so we cannot guarantee absolute security."
    },
    {
      title: "5. Your Rights and Choices",
      text: "You have certain rights regarding your personal information, including:"
    },
    {
      title: "",
      text: "• Access: You can request access to the personal information we hold about you"
    },
    {
      title: "",
      text: "• Correction: You can request that we correct any inaccurate personal information"
    },
    {
      title: "",
      text: "• Deletion: You can request that we delete your personal information"
    },
    {
      title: "",
      text: "• Opt-out: You can opt-out of receiving promotional communications from us"
    },
    {
      title: "6. Cookies and Tracking Technologies",
      text: "We use cookies and similar tracking technologies to collect information about your browsing activities. Cookies are small data files stored on your device. You can control cookies through your browser settings and other tools."
    },
    {
      title: "7. Children's Privacy",
      text: "Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete such information."
    },
    {
      title: "8. International Data Transfers",
      text: "Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take measures to ensure that your information receives an adequate level of protection."
    },
    {
      title: "9. Changes to This Privacy Policy",
      text: "We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy."
    },
    {
      title: "10. Contact Us",
      text: "If you have any questions about this Privacy Policy or our privacy practices, please contact us at: support@example.com or through our contact form on the website."
    }
  ];

  return (
    <div className="min-h-screen mt-12 bg-gradient-to-r from-gray-950 via-purple-900/20 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
               <div className="container mx-auto mt-20 flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Privacy Policy</h1>
        </div>

        {/* Last Updated */}
        <div className="mb-6">
          <p className="text-sm text-gray-400">Last Updated: December 20, 2025</p>
        </div>

        {/* Content Card */}
        <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/20 border-2 border-blue-500/50 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
          <div className="mb-6">
            <p className="text-sm text-gray-400 leading-relaxed">
              This Privacy Policy describes how we collect, use, and share your personal information when you use our services. By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-400 leading-relaxed   overflow-y-auto pr-2 custom-scrollbar">
            {policyContent.map((section, index) => (
              <div key={index}>
                {section.title && (
                  <h3 className="text-white font-semibold mb-2">{section.title}</h3>
                )}
                <p className="text-gray-400">{section.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
            I Accept Privacy Policy
          </button>
          <button className="w-full py-4 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
            Download PDF
          </button>
        </div> */}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
}