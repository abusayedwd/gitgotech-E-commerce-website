import React from "react";

/* ------------------------------------------------------------------ */
/*  SleeKnit – Privacy Policy Page                                    */
/*  Next.js (App Router) · TypeScript · Tailwind CSS                  */
/*  Drop into:  app/privacy-policy/page.tsx                           */
/* ------------------------------------------------------------------ */

// ── Reusable small components ──────────────────────────────────────

function SectionNumber({ n }: { n: string }) {
  return (
    <span className="mr-2 inline-block rounded bg-[#0a2e6e] px-2 py-px align-middle text-xs font-bold text-white">
      {n}
    </span>
  );
}

type BoxVariant = "info" | "warn" | "danger" | "success";

const boxStyles: Record<BoxVariant, string> = {
  info: "bg-[#eef4ff] border-l-4 border-blue-500",
  warn: "bg-[#fff7ed] border-l-4 border-orange-500",
  danger: "bg-[#fef2f2] border-l-4 border-red-500",
  success: "bg-[#f0fdf4] border-l-4 border-green-500",
};

function Box({
  variant,
  title,
  children,
}: {
  variant: BoxVariant;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`my-4 rounded-lg px-5 py-4 ${boxStyles[variant]}`}>
      {title && <strong className="mb-1 block text-[15px]">{title}</strong>}
      <p className="m-0 text-sm text-gray-700">{children}</p>
    </div>
  );
}

function SectionHeading({
  num,
  children,
}: {
  num: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-3.5 border-l-4 border-[#0a2e6e] pl-3 text-xl font-extrabold text-[#0a2e6e]">
      <SectionNumber n={num} />
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 text-base font-bold text-[#1a1a2e]">
      {children}
    </h3>
  );
}

// ── Data ───────────────────────────────────────────────────────────

const legalBasisRows = [
  ["Account creation & service delivery", "Performance of a contract (you have agreed to our Terms of Service)"],
  ["Payment processing", "Performance of a contract; legal obligation (AML/KYC)"],
  ["OTP phone verification (Vendors & Drivers)", "Legitimate interests (fraud prevention & security); legal obligation"],
  ["Location tracking for active deliveries", "Explicit consent (obtained in-app before activation)"],
  ["KYC identity document verification (Drivers)", "Legal obligation; legitimate interests (safety & fraud prevention)"],
  ["Marketing push notifications", "Consent (opt-in via device notification permissions)"],
  ["Analytics & app improvement", "Legitimate interests (improving our services)"],
  ["Legal compliance & fraud detection", "Legal obligation; legitimate interests"],
];

const retentionRows = [
  ["Account & Profile Data", "Duration of active account + 30 days after deletion request is confirmed"],
  ["Order & Transaction Records", "7 years (for financial compliance & tax purposes)"],
  ["Payment Transaction References", "7 years (legal & regulatory obligation)"],
  ["Driver Location History", "90 days post-delivery (for dispute resolution), then deleted"],
  ["KYC Identity Documents", "Duration of active driver account + 5 years (regulatory requirement)"],
  ["Support Communications", "2 years from the date of the last interaction"],
  ["Analytics Data (Anonymised)", "26 months (Firebase default) — no personal identifiers retained"],
  ["Crash Logs", "90 days, then automatically purged"],
];

function DataTable({
  headers,
  rows,
}: {
  headers: [string, string];
  rows: string[][];
}) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#0a2e6e] text-white">
            {headers.map((h) => (
              <th key={h} className="px-3.5 py-2.5 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-[#f5f7ff]" : ""}>
              <td className="border-b border-slate-200 px-3.5 py-2.5 align-top font-semibold text-[#0a2e6e]">
                {row[0]}
              </td>
              <td className="border-b border-slate-200 px-3.5 py-2.5 align-top text-gray-700">
                {row[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-[860px] bg-white px-4 pb-20 pt-12 font-sans text-base leading-7 text-[#1a1a2e] sm:px-6">
      {/* ═══ HEADER ═══ */}
      <header className="mb-9 border-b-[3px] border-[#0a2e6e] pb-6">
        <p className="text-[28px] font-extrabold tracking-tight text-[#0a2e6e]">
          SleeKnit
        </p>
        <h1 className="mt-1.5 text-[22px] font-bold text-[#1a1a2e]">
          Privacy Policy
        </h1>
        <div className="mt-3 space-x-6 text-[13.5px] text-gray-500">
          <span>
            <strong>Effective Date:</strong> June 13, 2025
          </span>
          <span>
            <strong>Last Updated:</strong> June 13, 2025
          </span>
        </div>
      </header>

      <Box variant="info" title="Plain-Language Summary">
        This Privacy Policy explains what personal data SleeKnit collects from
        you, why we collect it, how we protect it, and the choices you have —
        including the right to delete your account and all associated data at
        any time. Reading this document in full is strongly encouraged.
      </Box>

      {/* ═══ 01 – INTRO ═══ */}
      <section className="mb-10">
        <SectionHeading num="01">Introduction &amp; Who We Are</SectionHeading>
        <p className="mb-3 text-gray-700">
          Welcome to <strong>SleeKnit</strong> (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a premium multi-vendor
          eCommerce marketplace that connects shoppers, independent vendors, and
          delivery drivers across global and African markets. SleeKnit is
          available as a mobile application on the Apple App Store and the Google
          Play Store.
        </p>
        <p className="mb-3 text-gray-700">
          We are committed to protecting your privacy and handling your personal
          data responsibly, transparently, and in compliance with applicable data
          protection laws — including, but not limited to, the{" "}
          <strong>General Data Protection Regulation (GDPR)</strong>, the{" "}
          <strong>California Consumer Privacy Act (CCPA)</strong>, the{" "}
          <strong>Nigeria Data Protection Act (NDPA)</strong>, the{" "}
          <strong>Kenya Data Protection Act</strong>, the{" "}
          <strong>Ghana Data Protection Act</strong>, the{" "}
          <strong>
            South Africa Protection of Personal Information Act (POPIA)
          </strong>
          , and the{" "}
          <strong>
            Children&apos;s Online Privacy Protection Act (COPPA)
          </strong>
          .
        </p>
        <p className="mb-3 text-gray-700">
          This Privacy Policy governs your use of the SleeKnit mobile
          application and any related websites, services, or features we operate
          (collectively, the &ldquo;Service&rdquo;). By downloading, registering,
          or using the Service, you acknowledge that you have read, understood,
          and agree to the practices described herein.
        </p>
      </section>

      {/* ═══ 02 – AGE ═══ */}
      <section className="mb-10">
        <SectionHeading num="02">
          Age Restriction &amp; Children&apos;s Privacy (COPPA)
        </SectionHeading>
        <Box variant="danger" title="⛔ This App Is Strictly for Users Aged 18 and Older">
          SleeKnit facilitates real-money commercial transactions — including
          purchases, vendor sales, and cross-border payments involving live
          financial instruments. In accordance with the{" "}
          <strong>Children&apos;s Online Privacy Protection Act (COPPA)</strong>{" "}
          and equivalent international regulations, we do <strong>not</strong>{" "}
          knowingly collect, process, or store personal data from anyone under
          the age of 18.
        </Box>
        <p className="mb-3 text-gray-700">
          By creating an account or using the Service, you represent and warrant
          that you are at least 18 years of age. If you are under 18, you must
          immediately cease using SleeKnit and must not provide us with any
          personal information.
        </p>
        <p className="mb-3 text-gray-700">
          If we discover or are notified that a user under the age of 18 has
          provided us with personal data, we will immediately deactivate the
          relevant account and permanently delete all associated personal data
          from our systems. Parents or legal guardians who believe their minor
          child has inadvertently created an account may contact us at{" "}
          <a
            href="mailto:support@sleeknit.com"
            className="text-blue-600 underline"
          >
            support@sleeknit.com
          </a>{" "}
          to request immediate removal.
        </p>
      </section>

      {/* ═══ 03 – DATA WE COLLECT ═══ */}
      <section className="mb-10">
        <SectionHeading num="03">Personal Data We Collect</SectionHeading>
        <p className="mb-3 text-gray-700">
          We collect different categories of personal data depending on your role
          within SleeKnit. We collect only the minimum data necessary to provide,
          secure, and improve the Service (<em>data minimisation principle</em>).
        </p>

        <SubHeading>3.1 Customer Data</SubHeading>
        <p className="mb-3 text-gray-700">
          When you register as a shopper or customer on SleeKnit, we collect:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Full Name:</strong> To personalise your account and delivery communications.</li>
          <li><strong className="text-[#1a1a2e]">Email Address:</strong> For account creation, login, order confirmations, and service notifications.</li>
          <li><strong className="text-[#1a1a2e]">Password (Encrypted):</strong> Stored exclusively as a securely hashed value using industry-standard algorithms (e.g., bcrypt). We never store plaintext passwords.</li>
          <li><strong className="text-[#1a1a2e]">Purchase History:</strong> A record of orders placed, items bought, and transaction statuses, used to provide order tracking, receipts, and dispute resolution.</li>
          <li><strong className="text-[#1a1a2e]">Shipping &amp; Delivery Address:</strong> Entered voluntarily by you to facilitate product delivery.</li>
          <li><strong className="text-[#1a1a2e]">Payment Method Information:</strong> We do <em>not</em> store raw credit or debit card numbers, CVV codes, or full bank account details on our servers. All payment data is tokenised and handled exclusively by our certified third-party payment processors. We retain only a transaction reference ID and the last four digits of a card (where provided by the processor) for your records.</li>
          <li><strong className="text-[#1a1a2e]">Preferred Currency &amp; Region:</strong> Stored to provide a localised shopping experience across supported currencies (NGN, KES, GHS, ZAR, USD, and others).</li>
        </ul>

        <SubHeading>3.2 Vendor Data</SubHeading>
        <p className="mb-3 text-gray-700">
          When you register as a vendor or seller on SleeKnit, we collect the
          following in addition to standard account data:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Full Name and Business / Store Name:</strong> Displayed publicly on your vendor storefront within the app.</li>
          <li><strong className="text-[#1a1a2e]">Business Details:</strong> Including your business type, registered address, tax identification number (where required by local law), and bank or mobile money account details for receiving payouts.</li>
          <li><strong className="text-[#1a1a2e]">Phone Number (Mandatory — OTP Verified):</strong> Vendor accounts are subject to mandatory phone number verification via SMS One-Time Password (OTP). This measure is required for identity assurance and fraud prevention. The phone number is retained on your account for ongoing security verification.</li>
          <li><strong className="text-[#1a1a2e]">User-Generated Content (UGC):</strong> Product images, listing descriptions, promotional media, and any other content you upload to the platform.</li>
          <li><strong className="text-[#1a1a2e]">Sales &amp; Transaction Records:</strong> Order fulfilment data, payout history, and customer interaction records where relevant to dispute resolution.</li>
        </ul>

        <SubHeading>3.3 Driver / Delivery Agent Data</SubHeading>
        <p className="mb-3 text-gray-700">
          Delivery drivers and logistics partners are subject to enhanced data
          collection requirements due to the nature of their role:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Full Name, Email Address, and Encrypted Password:</strong> Standard account credentials.</li>
          <li><strong className="text-[#1a1a2e]">Phone Number (Mandatory — OTP Verified):</strong> Required for identity verification and real-time delivery coordination.</li>
          <li><strong className="text-[#1a1a2e]">Real-Time Location Data (GPS):</strong> When you are actively logged in and on a delivery assignment, we collect your precise GPS coordinates. This data is used exclusively to enable live delivery tracking visible to customers and to optimise routing. Location tracking is <strong>disabled</strong> when you are not on an active delivery or when the app is not in use in delivery mode. You will receive an in-app notification and must provide explicit consent before location tracking is activated.</li>
          <li><strong className="text-[#1a1a2e]">Government-Issued Identity Documents:</strong> For KYC (Know Your Customer) and identity verification purposes, we may collect images of government-issued ID documents (e.g., national ID, driver&apos;s licence, or passport). These documents are processed by our KYC verification provider and are treated with the highest level of data security.</li>
          <li><strong className="text-[#1a1a2e]">Vehicle Information:</strong> Including vehicle registration details, where applicable, for logistics management purposes.</li>
        </ul>

        <SubHeading>3.4 Technical &amp; Device Data (All Users)</SubHeading>
        <p className="mb-3 text-gray-700">
          The following technical data is collected automatically when you use
          the SleeKnit app, regardless of your account role:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Device Identifiers:</strong> Including your device&apos;s unique push notification token (FCM token for Android; APNs token for iOS), used exclusively to deliver push notifications relevant to your account activity.</li>
          <li><strong className="text-[#1a1a2e]">App Usage Data:</strong> Aggregate and anonymised data about features accessed, session duration, screen views, and in-app actions. This data is collected via <strong>Firebase Analytics</strong> and is used solely to improve app performance and user experience.</li>
          <li><strong className="text-[#1a1a2e]">Crash Reports &amp; Diagnostics:</strong> Automated crash logs and performance data to help us identify and fix bugs. This data does not contain your personal identifying information.</li>
          <li><strong className="text-[#1a1a2e]">Device Type, Operating System, and App Version:</strong> Collected for compatibility and performance purposes.</li>
          <li><strong className="text-[#1a1a2e]">IP Address:</strong> Collected for security monitoring, fraud detection, and geographic region detection (e.g., to display appropriate currencies and languages).</li>
        </ul>
      </section>

      {/* ═══ 04 – HOW WE USE ═══ */}
      <section className="mb-10">
        <SectionHeading num="04">
          How We Use Your Personal Data
        </SectionHeading>
        <p className="mb-3 text-gray-700">
          We use the personal data we collect for the following legitimate
          purposes:
        </p>

        <SubHeading>4.1 Service Delivery</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Creating and managing your account and user profile.</li>
          <li>Processing orders, facilitating payments, and coordinating deliveries.</li>
          <li>Enabling real-time order tracking and delivery status updates.</li>
          <li>Connecting customers with vendors and delivery agents.</li>
          <li>Supporting multi-currency transactions across global and African markets.</li>
        </ul>

        <SubHeading>4.2 Security &amp; Fraud Prevention</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Verifying user identity via SMS OTP for vendor and driver accounts.</li>
          <li>Detecting, investigating, and preventing fraudulent, abusive, or illegal activity.</li>
          <li>Conducting KYC (Know Your Customer) checks on delivery agents and vendors as required by applicable regulations.</li>
          <li>Monitoring unusual account activity and securing user accounts.</li>
        </ul>

        <SubHeading>4.3 Communication</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Sending transactional notifications (order confirmations, shipping updates, payment receipts).</li>
          <li>Delivering push notifications via Firebase Cloud Messaging (FCM) and Apple Push Notification service (APNs) — you may opt out of marketing push notifications at any time in your device settings.</li>
          <li>Responding to customer support enquiries and resolving disputes.</li>
          <li>Sending important service announcements and policy updates.</li>
        </ul>

        <SubHeading>4.4 Analytics &amp; App Improvement</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Analysing aggregate usage patterns to improve the app&apos;s features, design, and performance.</li>
          <li>Identifying technical issues and resolving bugs.</li>
          <li>Conducting internal research and development (using anonymised and aggregated data).</li>
        </ul>

        <SubHeading>4.5 Legal &amp; Regulatory Compliance</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Complying with applicable laws, regulations, court orders, or governmental requests.</li>
          <li>Enforcing our Terms of Service and other applicable agreements.</li>
          <li>Establishing, exercising, or defending legal claims.</li>
        </ul>
      </section>

      {/* ═══ 05 – LEGAL BASIS ═══ */}
      <section className="mb-10">
        <SectionHeading num="05">Legal Basis for Processing</SectionHeading>
        <p className="mb-3 text-gray-700">
          For users in jurisdictions where a legal basis is required for
          processing personal data (including the European Economic Area, the
          United Kingdom, and African countries with equivalent legislation), we
          process your data on the following grounds:
        </p>
        <DataTable
          headers={["Processing Activity", "Legal Basis"]}
          rows={legalBasisRows}
        />
        <p className="mb-3 text-gray-700">
          Where we rely on your <strong>consent</strong> as the legal basis for
          processing, you have the right to withdraw that consent at any time
          without affecting the lawfulness of processing carried out before
          withdrawal.
        </p>
      </section>

      {/* ═══ 06 – DATA SHARING ═══ */}
      <section className="mb-10">
        <SectionHeading num="06">
          Data Sharing &amp; Third-Party Disclosure
        </SectionHeading>
        <Box variant="success" title="🔒 We Do Not Sell Your Data">
          SleeKnit does not sell, rent, lease, trade, or otherwise commercially
          disclose your personal data to data brokers, advertising networks, or
          any third party for monetary or other valuable consideration. Your data
          is not a product.
        </Box>
        <p className="mb-3 text-gray-700">
          We share your personal data only in the following limited and necessary
          circumstances:
        </p>

        <SubHeading>6.1 Payment Processing Gateways</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>To complete financial transactions, we transmit relevant payment information to our certified third-party payment processors. These may include services such as <strong>Paystack</strong>, <strong>Flutterwave</strong>, <strong>Stripe</strong>, mobile money operators, and similar regulated payment gateways operating across our supported markets.</li>
          <li>Data shared with payment processors is limited to the minimum required to authorise and complete a transaction (e.g., transaction amount, currency, and tokenised payment credentials).</li>
          <li>All payment processors are required to comply with the <strong>Payment Card Industry Data Security Standard (PCI DSS)</strong> and applicable financial regulations.</li>
        </ul>

        <SubHeading>6.2 SMS OTP Verification Providers</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>For phone number verification of vendor and driver accounts, your phone number is transmitted to our SMS delivery provider(s) — which may include <strong>Twilio</strong> or equivalent telecommunications APIs — solely for the purpose of delivering a one-time verification code.</li>
          <li>These providers do not receive any other personal data beyond the phone number required to send the OTP.</li>
        </ul>

        <SubHeading>6.3 Firebase Services (Google LLC)</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong>Firebase Cloud Messaging (FCM):</strong> Your device&apos;s push notification token is shared with Firebase to enable the delivery of push notifications. Firebase does not use this token to identify you personally across other services.</li>
          <li><strong>Firebase Analytics:</strong> We share anonymised and aggregated usage data with Firebase Analytics to understand how users interact with our app. This data cannot be used to identify you individually.</li>
          <li>Firebase is a service of Google LLC and is governed by Google&apos;s Privacy Policy. Google has committed to compliance with applicable data protection laws as a data processor on our behalf.</li>
        </ul>

        <SubHeading>6.4 KYC &amp; Identity Verification Providers</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>For driver onboarding, identity document data may be shared with a regulated third-party KYC verification service. This service acts as a data processor under a binding Data Processing Agreement (DPA) and is prohibited from using your data for any purpose other than identity verification on our behalf.</li>
        </ul>

        <SubHeading>6.5 Cloud Infrastructure &amp; Hosting</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Your data is hosted on secure cloud infrastructure provided by reputable cloud service providers (e.g., Amazon Web Services, Google Cloud Platform, or equivalent). These providers act as data processors and may store data in data centres located in various jurisdictions. All transfers are subject to appropriate safeguards as described in Section 11 (Cross-Border Data Transfers).</li>
        </ul>

        <SubHeading>6.6 Vendors (for Customer Orders)</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>When you place an order with a vendor on SleeKnit, we share your <strong>name, delivery address, and order details</strong> with the relevant vendor solely to enable order fulfilment. Vendors are bound by our Vendor Terms of Service and are prohibited from using this data for any purpose other than fulfilling your order.</li>
        </ul>

        <SubHeading>6.7 Delivery Agents (for Active Deliveries)</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Your <strong>name, delivery address, and contact phone number</strong> may be shared with the assigned delivery agent for an active order, solely to facilitate successful delivery.</li>
        </ul>

        <SubHeading>6.8 Legal &amp; Regulatory Authorities</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>We may disclose your personal data to law enforcement agencies, regulatory bodies, courts, or other governmental authorities if we are required to do so by applicable law, court order, or binding governmental directive.</li>
          <li>We may also disclose data where necessary to protect the legal rights, property, or safety of SleeKnit, its users, or the public.</li>
        </ul>

        <SubHeading>6.9 Business Transfers</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>In the event of a merger, acquisition, restructuring, or sale of all or a substantial portion of our assets, your personal data may be transferred to the acquiring entity as part of the transaction. We will notify affected users in advance via email or in-app notification and ensure that your privacy rights are preserved.</li>
        </ul>
      </section>

      {/* ═══ 07 – DATA SECURITY ═══ */}
      <section className="mb-10">
        <SectionHeading num="07">
          Data Security &amp; Encryption
        </SectionHeading>
        <Box variant="info" title="🔐 All Data Is Encrypted In Transit">
          SleeKnit enforces Transport Layer Security (TLS 1.2 or higher) on all
          communications between the app and our servers. This means that all
          personal data — including login credentials, payment data, and location
          signals — is encrypted during transmission and cannot be intercepted or
          read by third parties.
        </Box>
        <p className="mb-3 text-gray-700">
          In addition to encryption in transit, we implement the following
          security controls:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Encryption at Rest:</strong> Sensitive personal data stored in our databases — including passwords, identity documents, and financial data — is encrypted at rest using AES-256 or equivalent algorithms.</li>
          <li><strong className="text-[#1a1a2e]">Password Hashing:</strong> User passwords are never stored in plaintext. They are processed through a one-way cryptographic hashing algorithm (e.g., bcrypt with an appropriate cost factor) before storage, making them unrecoverable even in the event of a data breach.</li>
          <li><strong className="text-[#1a1a2e]">Access Controls:</strong> Access to personal data is restricted on a strict need-to-know basis. Staff with access to user data are subject to confidentiality obligations and background checks where applicable.</li>
          <li><strong className="text-[#1a1a2e]">Authentication &amp; OTP:</strong> Vendor and driver accounts require multi-factor authentication via SMS OTP, significantly reducing the risk of unauthorised account access.</li>
          <li><strong className="text-[#1a1a2e]">Secure Payments:</strong> We do not store raw payment card numbers (PANs), CVV/CVC codes, or full bank account details. Payment processing is handled entirely by PCI DSS-compliant third-party processors, and we store only non-sensitive transaction references.</li>
          <li><strong className="text-[#1a1a2e]">Regular Security Audits:</strong> We conduct periodic security assessments and vulnerability scans to identify and remediate potential security risks.</li>
          <li><strong className="text-[#1a1a2e]">Incident Response:</strong> In the event of a personal data breach that poses a risk to your rights and freedoms, we will notify the relevant supervisory authorities and affected individuals in accordance with applicable law (within 72 hours where required by GDPR or equivalent legislation).</li>
        </ul>
        <p className="mb-3 text-gray-700">
          While we take all reasonable and commercially appropriate steps to
          protect your personal data, no method of transmission over the internet
          or electronic storage is 100% secure. We therefore cannot guarantee
          absolute security, and you use the Service at your own risk for matters
          beyond our reasonable control.
        </p>
      </section>

      {/* ═══ 08 – UGC ═══ */}
      <section className="mb-10">
        <SectionHeading num="08">
          User-Generated Content (UGC)
        </SectionHeading>
        <p className="mb-3 text-gray-700">
          SleeKnit allows certain users — primarily vendors — to upload content
          to the platform, including product images, listing descriptions, and
          promotional media. In addition, all users may submit support
          attachments via our help and support channels. The following policies
          apply to all user-generated content:
        </p>

        <SubHeading>8.1 Content You Upload</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>You retain ownership of any original content you upload to SleeKnit. By uploading content, you grant SleeKnit a non-exclusive, worldwide, royalty-free licence to store, display, and use that content solely for the purpose of operating and improving the Service.</li>
          <li>You are solely responsible for ensuring that any content you upload does not violate applicable laws, third-party intellectual property rights, or our Community Standards and Vendor Terms of Service.</li>
        </ul>

        <SubHeading>8.2 Content Moderation &amp; Monitoring</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>SleeKnit reserves the right to review, moderate, and — where necessary — remove any user-generated content that violates our policies, including content that is illegal, offensive, deceptive, or harmful.</li>
          <li>We may employ both automated tools (including AI-assisted moderation) and human review processes to monitor uploaded content.</li>
          <li>Content moderation activities are conducted by authorised SleeKnit personnel who are bound by strict confidentiality obligations.</li>
        </ul>

        <SubHeading>8.3 Support Chat Attachments</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Any images, documents, or files you attach to support enquiries are used exclusively by our customer support team to investigate and resolve your reported issue.</li>
          <li>Support attachments are stored securely and are accessible only to authorised support staff. They are retained for a period consistent with our data retention policy (see Section 13) and are then permanently deleted.</li>
          <li>Please avoid submitting sensitive documents — such as full payment card numbers or government IDs — through general support channels unless specifically instructed to do so in a secure, dedicated flow.</li>
        </ul>
      </section>

      {/* ═══ 09 – LOCATION ═══ */}
      <section className="mb-10">
        <SectionHeading num="09">Location Data</SectionHeading>

        <SubHeading>9.1 Customers</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Customers are not required to share real-time GPS location. A delivery address entered manually is used for order routing.</li>
          <li>SleeKnit may use your approximate location (derived from IP address) to suggest relevant local vendors and display applicable currencies. This is not precise GPS tracking.</li>
        </ul>

        <SubHeading>9.2 Drivers (Active Delivery Tracking)</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Precise GPS location data is collected from delivery drivers <strong>only</strong> when they are actively logged in to the app in delivery mode and have an accepted active delivery assignment.</li>
          <li>Before location services are activated, the app will display a clear, plain-language consent prompt explaining the purpose, scope, and duration of location collection. You must affirmatively grant permission.</li>
          <li>Location tracking is automatically suspended when a delivery is completed, when the driver goes offline, or when the app is closed.</li>
          <li>Live location data is shared in real time with the assigned customer for the sole purpose of enabling order tracking. It is not shared with any other party.</li>
          <li>Historical location data is retained for a limited period (see Section 13) for dispute resolution purposes and is then permanently deleted.</li>
        </ul>

        <p className="mb-3 text-gray-700">
          You can revoke location permissions for the SleeKnit app at any time
          through your device&apos;s operating system settings (iOS: Settings &gt;
          Privacy &amp; Security &gt; Location Services; Android: Settings &gt;
          Apps &gt; SleeKnit &gt; Permissions). Revoking location permissions for
          drivers may limit your ability to accept and fulfil delivery
          assignments.
        </p>
      </section>

      {/* ═══ 10 – PUSH NOTIFICATIONS ═══ */}
      <section className="mb-10">
        <SectionHeading num="10">Push Notifications</SectionHeading>
        <p className="mb-3 text-gray-700">
          SleeKnit uses <strong>Firebase Cloud Messaging (FCM)</strong> for
          Android devices and{" "}
          <strong>Apple Push Notification service (APNs)</strong> for iOS devices
          to deliver notifications related to your account and transactions.
        </p>

        <SubHeading>10.1 Types of Notifications</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Transactional (Required):</strong> Order confirmations, payment receipts, shipping updates, delivery status alerts, account security notifications (e.g., OTP, suspicious login alerts). These are essential for the functioning of the Service.</li>
          <li><strong className="text-[#1a1a2e]">Marketing &amp; Promotional (Optional):</strong> Notifications about new products, promotions, vendor spotlights, and platform features. These require your explicit consent via your device&apos;s notification permissions.</li>
        </ul>

        <SubHeading>10.2 Managing Your Notification Preferences</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>
            You can manage and disable marketing push notifications at any time
            via:
            <ul className="mt-1.5 list-disc pl-5 space-y-1">
              <li>Your device settings (iOS: Settings &gt; Notifications &gt; SleeKnit; Android: Settings &gt; Apps &gt; SleeKnit &gt; Notifications)</li>
              <li>The notification preferences section within the SleeKnit app.</li>
            </ul>
          </li>
          <li>Please note that disabling all notifications may result in you missing important transactional alerts related to your orders, payments, or account security.</li>
        </ul>
      </section>

      {/* ═══ 11 – CROSS-BORDER ═══ */}
      <section className="mb-10">
        <SectionHeading num="11">Cross-Border Data Transfers</SectionHeading>
        <p className="mb-3 text-gray-700">
          SleeKnit operates across multiple regions, including global markets and
          African countries. As a result, your personal data may be transferred
          to and processed in countries other than your country of residence,
          including countries that may not provide the same level of data
          protection as your home jurisdiction.
        </p>
        <p className="mb-3 text-gray-700">
          Where personal data is transferred internationally, we ensure that
          appropriate safeguards are in place, which may include:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong>Standard Contractual Clauses (SCCs)</strong> approved by the European Commission, where applicable;</li>
          <li><strong>Data Processing Agreements (DPAs)</strong> with all third-party processors that include appropriate data protection obligations;</li>
          <li>Transfers to countries or processors recognised as providing an <strong>adequate level of data protection</strong> by relevant supervisory authorities;</li>
          <li>Compliance with the requirements of applicable African data protection legislation governing cross-border transfers (e.g., NDPA, POPIA, Kenya DPA).</li>
        </ul>
      </section>

      {/* ═══ 12 – COOKIES ═══ */}
      <section className="mb-10">
        <SectionHeading num="12">
          Cookies &amp; In-App Tracking Technologies
        </SectionHeading>
        <p className="mb-3 text-gray-700">
          The SleeKnit mobile application does not use browser cookies. However,
          we use the following equivalent technologies within the app:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Local Storage / Secure App Storage:</strong> Used to store your login session token, app preferences, and cached data to improve performance. This data remains on your device and is not transmitted unless required for authentication.</li>
          <li><strong className="text-[#1a1a2e]">Firebase Analytics SDK:</strong> An analytics library embedded in the app that collects anonymised behavioural and performance data. You can opt out of analytics data collection by adjusting your device&apos;s advertising settings or by contacting us to opt out at the account level.</li>
          <li><strong className="text-[#1a1a2e]">Crash Reporting SDK:</strong> Automatically collects technical error logs in the event of an app crash. These logs do not contain personal identifying information.</li>
        </ul>
      </section>

      {/* ═══ 13 – RETENTION ═══ */}
      <section className="mb-10">
        <SectionHeading num="13">Data Retention</SectionHeading>
        <p className="mb-3 text-gray-700">
          We retain your personal data only for as long as is necessary for the
          purposes for which it was collected, as required by applicable law, or
          as needed to resolve disputes and enforce our agreements.
        </p>
        <DataTable
          headers={["Data Category", "Retention Period"]}
          rows={retentionRows}
        />
        <p className="mb-3 text-gray-700">
          Upon the expiry of the applicable retention period, or following a
          confirmed account deletion request, personal data is securely and
          permanently deleted or anonymised in accordance with industry-standard
          data destruction practices.
        </p>
        <p className="mb-3 text-gray-700">
          Please note that certain data may be retained beyond the standard
          retention period where required by applicable law (e.g., financial
          transaction records retained for statutory periods) or where the data
          is necessary to establish, exercise, or defend a legal claim.
        </p>
      </section>

      {/* ═══ 14 – DELETION ═══ */}
      <section className="mb-10">
        <SectionHeading num="14">
          Account &amp; Data Deletion
        </SectionHeading>
        <Box
          variant="warn"
          title="🗑️ Your Right to Delete — Google Play & Apple App Store Compliance"
        >
          In full compliance with Google Play&apos;s Data Safety requirements and
          Apple&apos;s App Store guidelines, SleeKnit provides all users with a
          clear, accessible, and effective mechanism to request the permanent
          deletion of their account and all associated personal data. You are not
          required to contact customer support or provide a reason to exercise
          this right.
        </Box>

        <SubHeading>14.1 How to Delete Your Account &amp; Data</SubHeading>
        <p className="mb-3 text-gray-700">
          You can submit a deletion request through any of the following methods:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>
            <strong className="text-[#1a1a2e]">In-App Deletion (Recommended):</strong>
            <br />
            Navigate to: <em>Profile / Account Settings → Privacy &amp; Security → Delete My Account</em>.
            Follow the on-screen confirmation steps. Your deletion request will be initiated immediately.
          </li>
          <li>
            <strong className="text-[#1a1a2e]">Web Deletion Form:</strong>
            <br />
            Visit:{" "}
            <a
              href="https://www.sleeknit.com/delete-account"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://www.sleeknit.com/delete-account
            </a>{" "}
            and complete the account deletion request form. No login is required
            if you have lost access to your account.
          </li>
          <li>
            <strong className="text-[#1a1a2e]">Email Request:</strong>
            <br />
            Send a deletion request to{" "}
            <a href="mailto:support@sleeknit.com" className="text-blue-600 underline">
              support@sleeknit.com
            </a>{" "}
            from the email address associated with your account, with the subject
            line: <em>&quot;Account Deletion Request&quot;</em>.
          </li>
        </ul>

        <SubHeading>14.2 What Happens When You Delete Your Account</SubHeading>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Your account will be deactivated immediately upon confirmation of your deletion request.</li>
          <li>All personal profile data, saved addresses, device tokens, and preferences will be <strong>permanently and irreversibly deleted</strong> within <strong>30 days</strong> of your confirmed request.</li>
          <li>You will no longer be able to log in or access your account, order history, or vendor/driver profile after deletion is completed.</li>
          <li>Any active vendor listings will be automatically unpublished.</li>
        </ul>

        <SubHeading>14.3 Data Retained After Deletion (Legal Exceptions)</SubHeading>
        <Box variant="info">
          <strong>Important Notice:</strong> Certain categories of data may be
          retained after account deletion where required by law or legitimate
          legal interests:
        </Box>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Transaction and financial records</strong> are retained for up to 7 years to comply with applicable tax, accounting, and financial regulatory obligations (e.g., AML/CFT regulations).</li>
          <li><strong className="text-[#1a1a2e]">KYC identity documentation</strong> for drivers may be retained for up to 5 years after account closure, as required under applicable financial and identity verification regulations.</li>
          <li>Data that forms part of an <strong>ongoing legal investigation, dispute, or regulatory enquiry</strong> may be preserved until the matter is resolved.</li>
          <li>Where data is retained for legal reasons, it will be isolated from active processing systems, accessible only for the specific legal purpose, and deleted as soon as legally permissible.</li>
        </ul>
        <p className="mb-3 text-gray-700">
          We will communicate any applicable retention exceptions to you at the
          time of your deletion request.
        </p>
      </section>

      {/* ═══ 15 – RIGHTS ═══ */}
      <section className="mb-10">
        <SectionHeading num="15">Your Privacy Rights</SectionHeading>
        <p className="mb-3 text-gray-700">
          Depending on your jurisdiction, you may have some or all of the
          following rights with respect to your personal data. We are committed
          to honouring these rights in accordance with applicable law:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li><strong className="text-[#1a1a2e]">Right of Access:</strong> You have the right to request a copy of the personal data we hold about you.</li>
          <li><strong className="text-[#1a1a2e]">Right to Rectification:</strong> You have the right to request correction of inaccurate or incomplete personal data.</li>
          <li><strong className="text-[#1a1a2e]">Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You have the right to request the deletion of your personal data, subject to the exceptions described in Section 14.3.</li>
          <li><strong className="text-[#1a1a2e]">Right to Data Portability:</strong> You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transfer it to another service provider.</li>
          <li><strong className="text-[#1a1a2e]">Right to Restriction of Processing:</strong> You have the right to request that we restrict our processing of your personal data in certain circumstances.</li>
          <li><strong className="text-[#1a1a2e]">Right to Object:</strong> You have the right to object to the processing of your personal data for direct marketing purposes or where processing is based on our legitimate interests.</li>
          <li><strong className="text-[#1a1a2e]">Right to Withdraw Consent:</strong> Where processing is based on your consent, you have the right to withdraw that consent at any time without affecting previous processing.</li>
          <li><strong className="text-[#1a1a2e]">Right to Non-Discrimination (CCPA):</strong> California residents have the right not to be discriminated against for exercising their privacy rights.</li>
        </ul>
        <p className="mb-3 text-gray-700">
          To exercise any of these rights, please contact us at{" "}
          <a href="mailto:support@sleeknit.com" className="text-blue-600 underline">
            support@sleeknit.com
          </a>
          . We will respond to all legitimate requests within{" "}
          <strong>30 days</strong> (or within the timeframe required by
          applicable law). We may need to verify your identity before processing
          your request.
        </p>
        <p className="mb-3 text-gray-700">
          If you are not satisfied with our response, you have the right to lodge
          a complaint with the relevant data protection supervisory authority in
          your country of residence (e.g., the Office of the Information
          Regulator in South Africa; the National Information Technology
          Development Agency / NITDA in Nigeria; the Office of the Data
          Protection Commissioner in Kenya).
        </p>
      </section>

      {/* ═══ 16 – THIRD-PARTY LINKS ═══ */}
      <section className="mb-10">
        <SectionHeading num="16">
          Third-Party Links &amp; Services
        </SectionHeading>
        <p className="mb-3 text-gray-700">
          The SleeKnit app may contain links to third-party websites, vendor
          storefronts hosted on external platforms, or integrated services (such
          as payment gateways) that are governed by their own separate privacy
          policies. SleeKnit is not responsible for the privacy practices,
          content, or security of any third-party websites or services accessed
          via our platform.
        </p>
        <p className="mb-3 text-gray-700">
          We encourage you to review the privacy policies of any third-party
          services you use in connection with SleeKnit, particularly payment
          providers and mobile money operators.
        </p>
      </section>

      {/* ═══ 17 – CHANGES ═══ */}
      <section className="mb-10">
        <SectionHeading num="17">
          Changes to This Privacy Policy
        </SectionHeading>
        <p className="mb-3 text-gray-700">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, legal requirements, or business
          operations. When we make material changes to this policy, we will:
        </p>
        <ul className="mb-3 list-disc pl-5 text-gray-700 space-y-1.5">
          <li>Update the <strong>&ldquo;Last Updated&rdquo;</strong> date at the top of this document;</li>
          <li>Display a prominent in-app notification informing you of the update; and/or</li>
          <li>Send a notification to the email address associated with your account, where the changes are significant.</li>
        </ul>
        <p className="mb-3 text-gray-700">
          Your continued use of the SleeKnit Service after the updated Privacy
          Policy becomes effective constitutes your acceptance of the revised
          terms. If you do not agree with the changes, you must discontinue use
          of the Service and may request deletion of your account as described in
          Section 14.
        </p>
        <p className="mb-3 text-gray-700">
          We encourage you to review this Privacy Policy periodically to stay
          informed about how we are protecting your information.
        </p>
      </section>

      {/* ═══ 18 – GOVERNING LAW ═══ */}
      <section className="mb-10">
        <SectionHeading num="18">
          Governing Law &amp; Jurisdiction
        </SectionHeading>
        <p className="mb-3 text-gray-700">
          This Privacy Policy shall be governed by and construed in accordance
          with the laws applicable to SleeKnit&apos;s principal place of
          business, without regard to conflict-of-law provisions. Where
          applicable data protection laws of a user&apos;s jurisdiction provide
          greater protections than those described herein, those laws shall
          additionally apply to the processing of that user&apos;s personal data.
        </p>
      </section>

      {/* ═══ 19 – CONTACT ═══ */}
      <section className="mb-10">
        <SectionHeading num="19">
          Contact Us &amp; Data Protection Enquiries
        </SectionHeading>
        <p className="mb-3 text-gray-700">
          If you have any questions, concerns, or complaints about this Privacy
          Policy, our data practices, or your personal data rights, please
          contact our Privacy &amp; Support team using the details below. We are
          committed to resolving all enquiries promptly and transparently.
        </p>

        <div className="mt-4 rounded-xl bg-[#0a2e6e] px-7 py-6 text-white">
          <h3 className="mb-3 text-base font-bold text-white">
            SleeKnit Privacy &amp; Support Team
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-indigo-200">
            <li>
              <strong className="text-white">Application Name:</strong> SleeKnit
            </li>
            <li>
              <strong className="text-white">Support Email:</strong>{" "}
              <a href="mailto:support@sleeknit.com" className="text-blue-300 underline">
                support@sleeknit.com
              </a>
            </li>
            <li>
              <strong className="text-white">Account Deletion Web Form:</strong>{" "}
              <a
                href="https://www.sleeknit.com/delete-account"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline"
              >
                https://www.sleeknit.com/delete-account
              </a>
            </li>
            <li>
              <strong className="text-white">Privacy Enquiries Subject Line:</strong>{" "}
              &quot;Privacy Policy Enquiry — [Your Name / Account Email]&quot;
            </li>
            <li>
              <strong className="text-white">Response Time:</strong> We aim to
              respond to all privacy-related enquiries within{" "}
              <strong>5 business days</strong> and to fulfil all data rights
              requests within <strong>30 days</strong> of receipt.
            </li>
          </ul>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-14 border-t border-slate-200 pt-5 text-center text-[13px] text-gray-400">
        <p>&copy; 2025 SleeKnit. All rights reserved.</p>
        <p className="mt-1.5">
          This Privacy Policy was prepared for compliance with the Apple App
          Store Review Guidelines, Google Play Data Safety requirements, GDPR,
          CCPA, NDPA, POPIA, Kenya Data Protection Act, and COPPA.
          <br />
          This document does not constitute legal advice. For
          jurisdiction-specific compliance, consult a qualified legal
          professional.
        </p>
      </footer>
    </main>
  );
}