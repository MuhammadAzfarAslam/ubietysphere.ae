import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title = "", children }) => {
  return (
    <section className="bg-primary-light relative py-16">
      <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 text-center relative">
        <h1 className="text-3xl font-semibold text-primary mb-2">{title}</h1>
        <nav className="text-sm text-primary-light space-x-1">
          <Link href={'/'}>Home</Link>
          {children}
        </nav>
      </div>
    </section>
  );
};

export default Breadcrumb;
