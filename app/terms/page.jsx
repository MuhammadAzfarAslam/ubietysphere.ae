import React from "react";

export const metadata = {
  title: "Terms & Conditions | Ubiety Health & Knowledge Sphere",
  description: "Appointment Booking, Cancellation & Refund Policy for Ubiety Health Portal services.",
};

const SectionTitle = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-primary/20">
    {children}
  </h2>
);

const SubSection = ({ title, children }) => (
  <div className="mb-6">
    {title && <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>}
    {children}
  </div>
);

const BulletList = ({ items }) => (
  <ul className="space-y-2 ml-4">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-3">
        <span className="mt-2 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
        <span className="text-gray-700">{item}</span>
      </li>
    ))}
  </ul>
);

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Appointment Booking, Cancellation & Refund Policy
          </p>
          <p className="mt-4 text-white/70 text-sm">
            Ubiety Health & Knowledge Sphere
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10">

          {/* 1. Appointment Booking */}
          <SectionTitle>1. Appointment Booking</SectionTitle>
          <BulletList
            items={[
              "Appointments may be booked up to 30 days in advance, subject to healthcare professional availability.",
              "Same-day bookings are permitted if the selected time slot is visible and available on the platform.",
              "Bookings must be completed at least 1 hour prior to the scheduled appointment time.",
            ]}
          />
          <SubSection title="Appointment Limits">
            <p className="text-gray-700 mb-3">A patient may hold a maximum of:</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span className="text-gray-700"><strong>3</strong> active appointments at any given time</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span className="text-gray-700"><strong>5</strong> appointments per calendar week</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3 italic">
              Ubiety reserves the right to modify booking limits based on service type or program structure.
            </p>
          </SubSection>

          {/* 2. Cancellation Policy */}
          <SectionTitle>2. Cancellation Policy</SectionTitle>
          <p className="text-gray-700 mb-4">
            Patients may cancel appointments through the portal. Refunds are processed according to the following schedule:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary/10">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Time Before Appointment
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200">
                    Refund Policy
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 border border-gray-200">&ge; 48 hours</td>
                  <td className="px-4 py-3 border border-gray-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Full refund
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 border border-gray-200">24–48 hours</td>
                  <td className="px-4 py-3 border border-gray-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      50% refund
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 border border-gray-200">&lt; 24 hours</td>
                  <td className="px-4 py-3 border border-gray-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      No refund
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 border border-gray-200">No-show</td>
                  <td className="px-4 py-3 border border-gray-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      No refund
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <strong>Note:</strong> A "no-show" refers to failure to attend a scheduled consultation without prior cancellation.
          </p>

          {/* 3. Rescheduling Policy */}
          <SectionTitle>3. Rescheduling Policy</SectionTitle>
          <BulletList
            items={[
              "Rescheduling requests made ≥ 24 hours prior incur no penalty.",
              "Requests made between 4–24 hours prior may incur a 50% fee.",
              "Requests made within 4 hours of the appointment may be treated as a no-show.",
            ]}
          />

          {/* 4. Provider-Initiated Cancellations */}
          <SectionTitle>4. Provider-Initiated Cancellations</SectionTitle>
          <p className="text-gray-700 mb-4">
            If a healthcare professional cancels an appointment:
          </p>
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">The patient will receive a <strong>full refund</strong>, or</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">May reschedule at <strong>no additional cost</strong>, subject to availability.</span>
            </div>
          </div>

          {/* 5. Technical Issues */}
          <SectionTitle>5. Technical Issues</SectionTitle>
          <p className="text-gray-700 mb-4">
            If a consultation cannot proceed due to verified platform or technical failure:
          </p>
          <BulletList
            items={[
              "Ubiety may offer a rescheduled appointment, or",
              "A partial or full refund at its discretion.",
            ]}
          />

          {/* 6. Refund Processing */}
          <SectionTitle>6. Refund Processing</SectionTitle>
          <BulletList
            items={[
              "Approved refunds are issued to the original method of payment within 7–14 business days.",
              "Payment gateway or transaction processing fees may not be refundable.",
            ]}
          />

          {/* 7. Exceptional Circumstances */}
          <SectionTitle>7. Exceptional Circumstances</SectionTitle>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700">
                Requests related to medical emergencies or extraordinary situations may be reviewed on a <strong>case-by-case basis</strong>.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about these terms and conditions, please contact us:
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:contact@ubietysphere.ae"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Page
              </a>
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-gray-400 mt-8 text-center">
            Last updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
