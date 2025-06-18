import HomepageBanner from "@/components/banner/HomepageBanner";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <HomepageBanner />
      {/* Six Column Section */}
      <div className="relative px-6 lg:px-0 py-6 lg:py-0 rounded-2xl">
        <div className="flex items-center py-16 bg-primary-light max-w-7xl container mx-auto px-4 mt-0 lg:mt-[-50px] sm:px-6 lg:px-8 relative lg:absolute inset-0 rounded-xl">
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
    </>
  );
}
