import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="February 18, 2026">
      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          1. Information We Collect
        </h2>
        <p>We collect information that you provide directly when using Lamplight Holidays:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Account information:</strong> name, email address, and password when you register</li>
          <li><strong>Profile information:</strong> preferred name, display preferences, and optional title</li>
          <li><strong>Trip data:</strong> trip names, destinations, dates, guest details, reservations, and notes</li>
          <li><strong>Usage data:</strong> pages visited, features used, and interactions with the service</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          2. How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Provide and maintain the Lamplight Holidays service</li>
          <li>Personalize your experience and address you by your preferred name</li>
          <li>Send trip-related notifications and email itineraries (when requested)</li>
          <li>Send newsletters (only with your explicit consent)</li>
          <li>Improve our service and develop new features</li>
          <li>Protect against fraudulent or unauthorized activity</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          3. Information Sharing
        </h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share
          information only in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>With your explicit consent</li>
          <li>To comply with legal obligations or respond to lawful requests</li>
          <li>To protect the rights, safety, or property of Lamplight Holidays or its users</li>
          <li>With service providers who assist in operating our platform (e.g., email delivery, hosting), under strict confidentiality agreements</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          4. Cookies &amp; Local Storage
        </h2>
        <p>
          We use cookies to maintain your session and remember your preferences. We also use local
          storage for offline functionality and caching. These are essential to the operation of the
          service. We do not use tracking cookies for advertising purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          5. Data Security
        </h2>
        <p>
          We take reasonable measures to protect your personal information, including encryption of
          passwords, secure HTTPS connections, and regular security reviews. However, no method of
          transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          6. Data Retention
        </h2>
        <p>
          We retain your account and trip data for as long as your account is active. If you wish to
          delete your account and associated data, please contact us. We will process deletion requests
          within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          7. Your Rights
        </h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Withdraw consent for newsletter subscriptions at any time</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          8. Children&apos;s Privacy
        </h2>
        <p>
          Lamplight Holidays is not directed at children under 13. We do not knowingly collect personal
          information from children under 13. If you believe a child has provided us with personal
          information, please contact us so we can take appropriate action.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          9. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated revision date. We encourage you to review this policy periodically.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-[#1F2A44] dark:text-white mb-3">
          10. Contact Us
        </h2>
        <p>
          If you have questions about this Privacy Policy or your personal data, please contact us at{" "}
          <a href="mailto:privacy@lamplightholidays.com" className="text-[#1F2A44] dark:text-[#FFB957] hover:text-[#FFB957] underline">
            privacy@lamplightholidays.com
          </a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
