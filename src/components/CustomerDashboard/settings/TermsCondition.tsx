"use client";

import React from 'react';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function TermsConditionsPage() {
    const router = useRouter();
  const termsContent = [
    {
      title: "1. Acceptance of Terms",
      text: "By accessing and using this platform, you accept and agree to be bound by the terms and provisions of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services."
    },
    {
      title: "2. Description of Service",
      text: "We currently provide users with access to a rich collection of resources, including various communications tools, forums, shopping services, personalized content and branded programming through our network of properties which may be accessed through any various medium or device now known or hereafter developed."
    },
    {
      title: "3. Account Registration",
      text: "To use certain features of the Site, you will be required to register an account. You agree to:"
    },
    {
      title: "",
      text: "Provide accurate, current, and complete information during the registration/onboarding."
    },
    {
      title: "",
      text: "Maintain and update registration information to keep it current and accurate."
    },
    {
      title: "",
      text: "Keep the confidentiality of any username/s or email associated with your account."
    },
    {
      title: "",
      text: "Not to transfer your account to any other person or entity without prior approval."
    },
    {
      title: "",
      text: "Use of the Site"
    },
    {
      title: "",
      text: "You agree to use the Site in a manner that is consistent with all applicable laws and regulations. You agree not to:"
    },
    {
      title: "",
      text: "Interfere or violate the integrity or performance."
    },
    {
      title: "",
      text: "Impersonate others or conduct that could otherwise threaten or harass others with libellously."
    },
    {
      title: "",
      text: "Upload or share users proprietary to Open Hands through the APP."
    },
    {
      title: "",
      text: "Attempt to obtain unauthorized access to or otherwise manipulate the App's code or functionality."
    },
    {
      title: "4. Privacy and Data Security",
      text: "By using the app, you consent to our Privacy Policy, which explains how we collect, use, and disclose your data. See Please review our Privacy Policy for information on our practices."
    },
    {
      title: "5. Subscriptions and Payments",
      text: "If you opt to purchase a subscription service provided by the App through paid service features, you agree to pay the prices stated during the registration process. You acknowledge that recurring charges will occur unless you actively cancel your subscription. All matters relating to price, payment, refunds and/or account billing are between you and the App provider."
    },
    {
      title: "6. User Content",
      text: "Users may be permitted to post, submit or share (via \"posts\" feedback or reviews and other materials. Information not limited to the App, you grant the Platform a non-exclusive, transferable, sub-licensable, royalty-free worldwide license to use any User Content you provide in order to use and/or distribute your content as part of the service. When you share any content, whether on Public Mode or Private Mode we do not assume any responsibility for and make no warranties with respect to user content. If you believe your work has been copied in a way that infringes copyright or violates your proprietary rights or others, please act on our website via email contact."
    },
    {
      title: "",
      text: "We may suspend or terminate your account, if you are in any way, without notice, for any reason at all times, the App reserve the right to terminate your access to."
    },
    {
      title: "",
      text: "Consistent marketing on Internal."
    },
    {
      title: "",
      text: "Discreet offensive or disillusion."
    },
    {
      title: "",
      text: "Unanticipated way behaviours or spam leads."
    },
    {
      title: "7. Limitation of Liability",
      text: "To the fullest extent permitted by law with us (a) to give to otherwise and his will not liable for consequential, incidental, special, indirect or punitive damages or any loss even whether or direct, arising out of or related to your use of the application."
    },
    {
      title: "8. Changes to the Terms",
      text: "At any time without notice we can reserve to modify of this app more at any time, and you have to the interests, including their obligation to review them app version that you accept by continuing the App and when any of them might or."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
         <div className="container mt-24 mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Terms & Condition</h1>
        </div>

        {/* Content Card */}
        <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/20 mt-12 border-2 border-blue-500/50 rounded-3xl p-6 md:p-6 backdrop-blur-sm">
          <div className="space-y-6 text-sm text-gray-400 leading-relaxed  overflow-y-auto pr-2 custom-scrollbar">
            {termsContent.map((section, index) => (
              <div key={index}>
                {section.title && (
                  <h3 className="text-white font-semibold mb-2">{section.title}</h3>
                )}
                <p className="text-gray-400">{section.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accept Button (Optional) */}
        {/* <div className="mt-6">
          <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
            I Accept Terms & Conditions
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