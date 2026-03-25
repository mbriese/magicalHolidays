import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="February 18, 2026">
      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using the Lamplight Holidays website and services, you agree to be bound by
          these Terms of Service. If you do not agree to all of these terms, please do not use our services.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          2. Description of Service
        </h2>
        <p>
          Lamplight Holidays is an independent travel planning tool that helps users organize trips,
          reservations, and travel itineraries. We are not affiliated with any theme park, resort,
          or entertainment company. Our service provides planning tools only and does not sell tickets,
          accommodations, or transportation directly.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          3. User Accounts
        </h2>
        <p>
          When you create an account, you are responsible for maintaining the confidentiality of your
          login credentials and for all activities under your account. You agree to provide accurate
          and complete information during registration. You must notify us immediately of any
          unauthorized use of your account.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          4. User Conduct
        </h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Use the service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to any part of the service</li>
          <li>Interfere with or disrupt the service or servers</li>
          <li>Upload malicious code or content</li>
          <li>Impersonate any person or entity</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          5. Intellectual Property
        </h2>
        <p>
          All content, features, and functionality of Lamplight Holidays — including text, graphics,
          logos, and software — are owned by Lamplight Holidays and protected by copyright and other
          intellectual property laws. You may not reproduce, distribute, or create derivative works
          without our express written permission.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          6. Third-Party Links &amp; Affiliates
        </h2>
        <p>
          Our service may contain links to third-party websites or services, including affiliate links.
          We are not responsible for the content, policies, or practices of any third-party sites.
          Affiliate links may earn us a small commission at no additional cost to you.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          7. Disclaimer of Warranties
        </h2>
        <p>
          Lamplight Holidays is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
          warranties of any kind, either express or implied. We do not guarantee the accuracy,
          completeness, or usefulness of any information on the service. Travel plans, park hours,
          and availability are subject to change without notice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          8. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, Lamplight Holidays shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages arising from your use of
          the service, including but not limited to travel disruptions, missed reservations, or
          inaccurate information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          9. Changes to Terms
        </h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be posted on this page
          with an updated revision date. Your continued use of the service after changes constitutes
          acceptance of the new terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          10. Contact Us
        </h2>
        <p>
          If you have questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:support@lamplightholidays.com" className="text-[#1F2A44] dark:text-[#FFB957] hover:text-[#FFB957] underline">
            support@lamplightholidays.com
          </a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
