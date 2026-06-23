import React from "react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto text-white/80">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the KALNET Approval Workflow Engine, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              The KALNET Approval Workflow Engine provides a platform for submitting, tracking, and managing academic requests and approvals within the institution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. User Conduct</h2>
            <p>
              You agree to use the service only for lawful purposes related to academic administration. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Modifications to Service</h2>
            <p>
              KALNET reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
