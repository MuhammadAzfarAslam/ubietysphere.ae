import HomepageBanner from "@/components/banner/HomepageBanner";
import Image from "next/image";

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

      <section className="relative bg-primary-light pb-16 pt-30">
        {/* White Overlay */}
        <div className="absolute inset-0 bg-white opacity-70 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto text-center px-2 lg:px-16">
          <p className="text-sm font-medium text-primary mb-2">
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
            className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-xl shadow hover:bg-primary-dark transition"
          >
            Learn More About Us
          </a>
        </div>
      </section>
    </>
  );
}
