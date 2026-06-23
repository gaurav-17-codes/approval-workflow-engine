import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto text-white/80">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when using the KALNET Approval Workflow Engine, including your name, email address, role, and details within the requests you submit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              Your information is used exclusively to facilitate the academic approval processes within KALNET. This includes routing requests, sending email notifications, and maintaining administrative records.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact our support team at support@kalnet.com or through our Contact Support page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
