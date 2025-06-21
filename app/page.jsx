import HomepageBanner from "@/components/banner/HomepageBanner";
import Image from "next/image";

const services = [
  {
    icon: "📚", // Replace with your actual SVG/icon
    title: "Nutrition counseling",
    description:
      "Receive personalized nutrition guidance to create balanced, sustainable eating habits that support your health.",
  },
  {
    icon: "👥", // Replace with your actual SVG/icon
    title: "Group Coaching Sessions",
    description:
      "Receive personalized nutrition guidance to create balanced, sustainable eating habits that support your health.",
  },
  {
    icon: "📝",
    title: "Meal Planning",
    description:
      "Custom meal plans to match your health goals and dietary preferences for long-term results.",
  },
  {
    icon: "🏋️‍♂️",
    title: "Fitness Coaching",
    description:
      "Pair your nutrition with expert fitness coaching for a full-body health transformation.",
  },
  {
    icon: "💬",
    title: "1:1 Consultations",
    description:
      "One-on-one expert sessions tailored to your unique challenges and goals.",
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    description:
      "Track improvements and stay accountable with regular check-ins and progress reports.",
  },
];

export default function Home() {
  return (
    <>
      <HomepageBanner />
      {/* Six Column Section */}
      <div className="relative z-10 px-6 lg:px-0 py-6 lg:py-0 rounded-2xl">
        <div className="flex items-center py-16 bg-primary-light max-w-7xl mx-auto px-4 mt-0 lg:mt-[-50px] sm:px-6 lg:px-8 relative lg:absolute inset-0 rounded-xl">
          <div className="grid w-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 justify-center items-center">
            {/* Column 1 */}
            <div className="flex flex-col items-center  border-black lg:last:border-r">
              <div className="text-white text-4xl mb-4">
                {/* Example Icon (Font Awesome or SVG) */}
                <i className="fas fa-phone"></i>
              </div>
              <h3 className="text-white text-[12px]">Column 1</h3>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-center lg:border-l border-black last:border-r">
              <div className="text-white text-4xl mb-4">
                <i className="fas fa-envelope"></i>
              </div>
              <h3 className="text-white text-[12px]">Column 2</h3>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col items-center lg:border-l border-black last:border-r">
              <div className="text-white text-4xl mb-4">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="text-white text-[12px]">Column 3</h3>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col items-center lg:border-l border-black last:border-r">
              <div className="text-white text-4xl mb-4">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 className="text-white text-[12px]">Column 4</h3>
            </div>

            {/* Column 5 */}
            <div className="flex flex-col items-center lg:border-l border-black last:border-r">
              <div className="text-white text-4xl mb-4">
                <i className="fas fa-comments"></i>
              </div>
              <h3 className="text-white text-[12px]">Column 5</h3>
            </div>

            {/* Column 6 */}
            <div className="flex flex-col items-center lg:border-l border-black ">
              <div className="text-white text-4xl mb-4">
                <i className="fas fa-cogs"></i>
              </div>
              <h3 className="text-white text-[12px]">Column 6</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <section className="relative bg-primary-light pb-16 lg:pt-36 pt-6">
        {/* White Overlay */}
        <div className="absolute inset-0 bg-white opacity-100 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto text-center px-2 lg:px-16">
          <p className="text-sm font-bold text-primary mb-2">
            About Ubiety Sphere
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            We provide professional, dedicated, and experienced psychological
            support
          </h2>
          <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto">
            It is a trusted counseling and therapy center, staffed by
            experienced professionals dedicated to listening, supporting, and
            guiding you. We believe in everyone's potential to heal and grow
            with the right care.
          </p>
          <a
            href="#"
            className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-xl shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition"
          >
            <span className="relative z-10 group-hover:text-primary">
              Learn More About Us
            </span>
            <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
          </a>
        </div>
      </section>

      {/* Services Section 3 */}
      <section className="services relative bg-primary-light py-16">
        {/* White Overlay */}
        <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
        <div className="relative max-w-7xl pb-10 mx-auto text-center px-2 lg:px-16">
          <p className="text-sm font-bold text-primary mb-2">Services</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            We provide services for you
          </h2>
          <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto">
            We offer personalized health coaching services support your wellness
            journey and empower you to life.
          </p>
          {/* <a
            href="#"
            className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-xl shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition"
          >
            <span className="relative z-10 group-hover:text-primary">
              All Services
            </span>
            <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
          </a> */}
        </div>
        <div className="max-w-7xl mx-auto px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="relative group p-6 rounded-2xl  bg-white overflow-hidden transition-all duration-500 shadow hover:shadow-lg"
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-secondary scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out rounded-2xl z-0" />

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="font-bold text-lg text-black transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-500 mt-2 text-sm transition-colors duration-300">
                  {item.description}
                </p>
                <div className="mt-4 font-bold text-primary transition-colors duration-300 inline-flex items-center gap-1">
                  Read More <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
