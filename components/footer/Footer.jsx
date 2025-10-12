import Image from "next/image";
import Link from "next/link";
import React from "react";

const ListItem = ({ link = "/", children }) => {
  return (
    <li className="flex items-center space-x-3 rtl:space-x-reverse">
      <svg
        className="h-6 text-gray-800 dark:text-white w-1.5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 8 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
        />
      </svg>
      <Link href={link} className="text-sm">{children}</Link>
    </li>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-white pb-4">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column A */}
          <div>
            <Image src={"/assets/svg/logo2.svg"} width={100} height={50} alt="footer logo" />
            <p className="mt-4 text-sm">
              Deleniti aeue corrupti quos dolores quas tias excepturi sint
              occaecati rupiditate non similique sunt incidunt…
            </p>
          </div>

          {/* Column B */}
          <div>
            <h3 className="text-lg font-semibold">About Us</h3>
            <ul className="mt-4">
              <ListItem link="/">Home</ListItem>
              <ListItem link="/join-our-team">Join Our Team</ListItem>
              <ListItem link="/services">Services</ListItem>
              <ListItem link="/contact">Contact Us</ListItem>
              <ListItem link="/privacy">Privacy Policy</ListItem>
            </ul>
          </div>

          {/* Column C */}
          <div>
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="mt-4">
              <ListItem link="/">Physician Consultation</ListItem>
              <ListItem link="/about">Medical Second Opinion</ListItem>
              <ListItem link="/services">Mental Health Counseling</ListItem>
              <ListItem link="/contact">Genetic Counseling</ListItem>
              <ListItem link="/privacy">Nutrition & Dietetics</ListItem>
            </ul>
          </div>

          {/* Column C */}
          <div>
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <ul className="mt-4">
              <li className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="text-sm">+9232345645645</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>

                <span className="text-sm">contact@ubietysphere.ae</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="text-sm">21 King Street Melbourne, 3000, Australia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="pt-4 border-t border-gray-600 text-center">
        <p className="text-sm">&copy; 2025 UbietySphere. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
