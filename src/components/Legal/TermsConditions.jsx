import { Link } from 'react-router-dom';

export default function TermsConditions() {
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">Last updated: November 23, 2025</p>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using the E-Mandate platform, you agree to be bound by these Terms & Conditions and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from 
                using or accessing this platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                E-Mandate provides a platform for businesses to create, manage, and process recurring payment mandates 
                through the UPI auto-debit system. Our services include mandate creation, customer management, transaction 
                processing, and reporting.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Maintain accurate and up-to-date account information</li>
                <li>Ensure all customer data provided is valid and accurate</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Protect account credentials and notify us of any unauthorized access</li>
                <li>Obtain proper consent from customers before creating mandates</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Users agree to pay all fees associated with using the E-Mandate platform as outlined in the pricing plan. 
                All fees are non-refundable unless otherwise specified. We reserve the right to modify pricing with 30 days' notice.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                E-Mandate shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary 
                damages resulting from your use of the platform. This includes but is not limited to damages for loss of 
                profits, goodwill, use, data, or other intangible losses.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Service Availability</h2>
              <p className="text-gray-700 mb-4">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We reserve the right to 
                modify, suspend, or discontinue the service at any time without notice.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms shall be governed by and construed in accordance with the laws of India, without regard to 
                its conflict of law provisions.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
                posting to the platform. Your continued use of the platform after any changes constitutes acceptance 
                of the new terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@emandate.com
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