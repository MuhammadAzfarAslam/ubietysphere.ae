import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column A */}
          <div>
            <h3 className="text-lg font-semibold">A</h3>
            <p className="mt-4">Content for section A goes here.</p>
          </div>

          {/* Column B */}
          <div>
            <h3 className="text-lg font-semibold">B</h3>
            <p className="mt-4">Content for section B goes here.</p>
          </div>

          {/* Column C */}
          <div>
            <h3 className="text-lg font-semibold">C</h3>
            <p className="mt-4">Content for section C goes here.</p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 pt-4 border-t border-gray-600 text-center">
        <p>&copy; 2025 UbietySphere. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
