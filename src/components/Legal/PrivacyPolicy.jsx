import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: November 23, 2025</p>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to E-Mandate. We are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                our E-Mandate platform for recurring payment management.
              </p>
              <p className="text-gray-700">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                please do not access the platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Name, email address, phone number, and business details</li>
                <li>UPI ID and bank account information for mandate processing</li>
                <li>Transaction history and payment records</li>
                <li>Customer data you provide for mandate creation</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>IP address, browser type, and device information</li>
                <li>Pages visited and time spent on the platform</li>
                <li>Features used and actions taken</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process recurring payments and manage mandates</li>
                <li>To communicate with you about your account and transactions</li>
                <li>To improve our platform and user experience</li>
                <li>To detect and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information. 
                All data is encrypted in transit and at rest. However, no method of transmission over the Internet or 
                electronic storage is 100% secure.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to provide our services and comply with legal obligations. 
                When data is no longer needed, we securely delete it in accordance with our retention policies.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to access, update, or delete your personal information. You may also have the right to 
                data portability and the right to object to certain processing activities.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions or comments about this privacy policy, you may contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@emandate.com
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Phone:</strong> +91 98765 43210
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}