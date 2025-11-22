import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import TeamCard from "@/components/cards/TeamCard";
import React from "react";
import { DOCTOR_CATEGORIES } from "@/utils/enums";
import { SERVICE_CONTENT } from "@/utils/serviceContent";
import getData from "@/utils/getData";

const ServiceDetailPage = async ({ params }) => {
  // Get slug from params
  const slug = await params.slug;

  const doctorList = await getData(`doctor/by-professions?slug=${slug}`);

  // Get service content by slug
  const serviceContent = SERVICE_CONTENT[slug] || {
    slug: slug,
    title:
      DOCTOR_CATEGORIES.find(
        (category) => category.toLowerCase().replace(/\s+/g, "-") === slug
      ) || "Our Service",
    bannerText: "Professional healthcare services tailored to your needs.",
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/assets/images/service.png")',
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <div className="relative max-w-3xl mx-auto text-center px-2 lg:px-16 py-16">
            <h1 className="text-4xl md:text-5xl font-semibold text-secondary mb-6">
              {serviceContent.title}
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
              {serviceContent.bannerText}
            </p>
            <button className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-sm shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition">
              <span className="relative z-10 group-hover:text-primary">
                Book An Appointment
              </span>
              <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
            </button>
          </div>
        </section>

        {/* Service Benefits Section */}
        <section className="relative bg-primary-light py-16">
          <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
          <div className="relative max-w-7xl mx-auto px-2 lg:px-16">
            <div className="text-center mb-12">
              <p className="text-sm font-bold text-primary mb-2">
                Why Choose Us
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                {serviceContent.title} Benefits
              </h2>
              <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto">
                Discover how our professional services can help you achieve
                optimal health and wellbeing
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Benefit 1 */}
              <div className="relative group p-6 rounded-2xl bg-white overflow-hidden transition-all duration-500 shadow hover:shadow-lg">
                <div className="absolute inset-0 bg-secondary scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out rounded-2xl z-0" />
                <div className="relative z-10">
                  <div className="mb-4 text-3xl">❤️</div>
                  <h3 className="font-bold text-lg text-black transition-colors duration-300">
                    Personalized Care
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm transition-colors duration-300">
                    Customized nutrition plans tailored to your unique health
                    goals, dietary preferences, and lifestyle needs.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="relative group p-6 rounded-2xl bg-white overflow-hidden transition-all duration-500 shadow hover:shadow-lg">
                <div className="absolute inset-0 bg-secondary scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out rounded-2xl z-0" />
                <div className="relative z-10">
                  <div className="mb-4 text-3xl">👥</div>
                  <h3 className="font-bold text-lg text-black transition-colors duration-300">
                    Expert Guidance
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm transition-colors duration-300">
                    Work with certified nutritionists who have years of
                    experience in helping clients achieve sustainable results.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="relative group p-6 rounded-2xl bg-white overflow-hidden transition-all duration-500 shadow hover:shadow-lg">
                <div className="absolute inset-0 bg-secondary scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out rounded-2xl z-0" />
                <div className="relative z-10">
                  <div className="mb-4 text-3xl">📈</div>
                  <h3 className="font-bold text-lg text-black transition-colors duration-300">
                    Progress Tracking
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm transition-colors duration-300">
                    Monitor your journey with regular check-ins and detailed
                    progress reports to keep you motivated and on track.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="relative group p-6 rounded-2xl bg-white overflow-hidden transition-all duration-500 shadow hover:shadow-lg">
                <div className="absolute inset-0 bg-secondary scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out rounded-2xl z-0" />
                <div className="relative z-10">
                  <div className="mb-4 text-3xl">💪</div>
                  <h3 className="font-bold text-lg text-black transition-colors duration-300">
                    Holistic Approach
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm transition-colors duration-300">
                    Comprehensive wellness strategies that address nutrition,
                    lifestyle, and long-term health maintenance.
                  </p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="relative group p-6 rounded-2xl bg-white overflow-hidden transition-all duration-500 shadow hover:shadow-lg">
                <div className="absolute inset-0 bg-secondary scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out rounded-2xl z-0" />
                <div className="relative z-10">
                  <div className="mb-4 text-3xl">🛡️</div>
                  <h3 className="font-bold text-lg text-black transition-colors duration-300">
                    Evidence-Based
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm transition-colors duration-300">
                    All recommendations are based on the latest scientific
                    research and proven nutritional science principles.
                  </p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="relative group p-6 rounded-2xl bg-white overflow-hidden transition-all duration-500 shadow hover:shadow-lg">
                <div className="absolute inset-0 bg-secondary scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out rounded-2xl z-0" />
                <div className="relative z-10">
                  <div className="mb-4 text-3xl">⏰</div>
                  <h3 className="font-bold text-lg text-black transition-colors duration-300">
                    Flexible Scheduling
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm transition-colors duration-300">
                    Choose appointment times that work for you with our
                    convenient online booking and consultation options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <div id="booking-section">
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-2 lg:px-16">
              <div className="text-center mb-12">
                <p className="text-sm font-bold text-primary mb-2">
                  Book Your Appointment
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                  Schedule Your Consultation
                </h2>
                <p className="text-base text-gray-700 max-w-2xl mx-auto">
                  Fill out the form below to book your appointment with our
                  expert team
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <form className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name*
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your Name"
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
                          name="name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email*
                        </label>
                        <input
                          type="email"
                          placeholder="Enter your Email"
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
                          name="email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number*
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your Phone Number"
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
                          name="phone"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Choose Doctor*
                        </label>
                        <select
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
                          name="doctor"
                        >
                          <option value="">Select a doctor</option>
                          <option value="Dr. Ali">Dr. Ali</option>
                          <option value="Dr. Sara">Dr. Sara</option>
                          <option value="Dr. John">Dr. John</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date*
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
                          name="date"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Time*
                        </label>
                        <input
                          type="time"
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary"
                          name="time"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Your health complaint (150)*
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Enter your Message"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary resize-none"
                        name="message"
                      ></textarea>
                    </div>
                    <div className="flex items-center gap-5">
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 min-h-9 w-full px-6 py-3 bg-primary text-white font-medium rounded-sm shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition"
                        type="submit"
                      >
                        <span className="relative z-10 group-hover:text-primary">
                          Book An Appointment
                        </span>
                        <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
                      </button>
                    </div>
                  </form>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-6 rounded-sm shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      What to Expect
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Comprehensive Assessment
                          </p>
                          <p className="text-sm text-gray-600">
                            Detailed evaluation of your health goals and current
                            status
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Personalized Plan
                          </p>
                          <p className="text-sm text-gray-600">
                            Custom strategies tailored to your unique needs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Expert Consultation
                          </p>
                          <p className="text-sm text-gray-600">
                            Professional guidance from certified specialists
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Evidence-Based Approach
                          </p>
                          <p className="text-sm text-gray-600">
                            Treatment methods backed by latest medical research
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Ongoing Support
                          </p>
                          <p className="text-sm text-gray-600">
                            Regular follow-ups to track your progress and adjust
                            care
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">⏰</span>
                          <span className="text-sm text-gray-600">
                            Duration: 45-60 minutes
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">📞</span>
                          <span className="text-sm text-gray-600">
                            +971 123 456 789
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">✉️</span>
                          <span className="text-sm text-gray-600">
                            info@ubietysphere.ae
                          </span>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Team Section */}
        <section className="relative bg-primary-light py-16">
          <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
          <div className="relative max-w-7xl mx-auto text-center px-2 lg:px-16">
            <p className="text-sm font-bold text-primary mb-2">Team Members</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Meet Our {serviceContent.title} Experts
            </h2>
            <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto">
              Our team of certified {serviceContent.title.toLowerCase()}{" "}
              professionals are here to guide you on your wellness journey with
              personalized care and expert knowledge.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-12">
              {doctorList?.data?.content?.map((doctor) => (
                <TeamCard
                  key={doctor.id}
                  imageURL={
                    doctor?.imageName !== null
                      ? `https://cms.ubietysphere.ae/img/user-images/${doctor?.imageName}`
                      : `${process.env.NEXT_PUBLIC_URL}assets/images/placeholder-user.png`
                  }
                  title={`${doctor.firstName} ${doctor.lastName}`}
                  designation={serviceContent.title}
                  service={slug}
                  slug={doctor.slug}
                  totalExperience={doctor.totalExperience}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-white py-16">
          <div className="max-w-2xl mx-auto text-center px-2 lg:px-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-base text-gray-700 mb-8">
              Take the first step towards better health today. Book your
              consultation with our expert nutritionists and discover a
              personalized path to wellness.
            </p>
            <button className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-sm shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition">
              <span className="relative z-10 group-hover:text-primary">
                Book Your Consultation
              </span>
              <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServiceDetailPage;
