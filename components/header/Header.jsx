"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const menu = [
  { name: "Home", href: "/" },
  {
    name: "Knowledge Dome",
    href: "/knowledge-dome",
    children: [
      { name: "DPT", href: "/knowledge-dome/dpt" },
      { name: "Genetic", href: "/knowledge-dome/genetic" },
    ],
  },
  {
    name: "Our Experts",
    href: "/our-experts",
    children: [
      { name: "DPT", href: "/our-experts/dpt" },
      { name: "Genetic", href: "/our-experts/genetic" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

const MenuItem = ({ item, onClick }) => {
  const [open, setOpen] = useState(false);

  if (item.children) {
    return (
      <li className="relative group lg:static">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center p-1 text-base gap-x-2 text-slate-600 hover:text-red-500"
        >
          {item.name}
          <svg
            className={`w-4 h-4 mt-0.5  transition-transform ${
              open ? "transform rotate-0" : "rotate-270"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <ul
          className={`${
            open ? "block" : "hidden lg:group-hover:block"
          } lg:bg-white lg:shadow-lg lg:absolute mt-2 py-2 rounded-md w-40 z-50`}
        >
          {item.children.map((child, index) => (
            <li key={index}>
              <Link
                href={child.href}
                onClick={onClick}
                className="block px-4 py-2 text-slate-600 hover:text-red-500"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="flex items-center p-1 text-base gap-x-2 text-slate-600 hover:text-red-500">
      <Link href={item.href} onClick={onClick} className="flex items-center">
        {item.name}
      </Link>
    </li>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header>
      <div className="block bg-primary py-2 d-none d-sm-block text-white fw-bold w-full max-w-screen">
        <div className="max-w-7xl container mx-auto">
          <div className="row flex items-center justify-between gx-4">
            <div className="col-auto d-none d-lg-block text-xs px-3 lg:p-0">
              1010 Avenue, New York, NY 10018 US.
            </div>
            <div className="col-auto">
              <button className="hover:underline text-white px-8 rounded-md text-xs hidden lg:block">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <nav className="block relative w-full max-w-screen px-4 py-3 mx-auto bg-white bg-opacity-90 sticky top-3 shadow lg:px-8 backdrop-blur-lg backdrop-saturate-150 z-[9999]">
        <div className="container flex flex-wrap items-center justify-between max-w-7xl mx-auto text-slate-800">
          <Link
            href="/"
            className="mr-4 block cursor-pointer py-1.5 text-red-600 font-bold text-2xl"
          >
            <Image src={"/assets/svg/logo.svg"} width={100} height={50} />
          </Link>

          <div className="lg:hidden">
            <button
              className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed min-h-screen inset-0 bg-black opacity-70 ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div
            className={`fixed top-0 left-0 min-h-screen w-64 bg-slate-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden z-50`}
          >
            <div className="flex flex-row items-center border-b pb-4">
              <Link
                href="/"
                className="cursor-pointer text-primary font-bold text-xl pt-4 ps-4"
              >
                UbietySphere
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-slate-600 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col h-full gap-4 p-4">
              {menu.map((item, index) => (
                <MenuItem
                  key={index}
                  item={item}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
              <li className="mt-4">
                <a
                  href="#"
                  className="inline-block px-6 py-1.5 bg-primary text-white font-medium rounded-[5px] shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition"
                >
                  <span className="relative z-10 group-hover:text-primary">
                    Login
                  </span>
                  <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {menu.map((item, index) => (
                <MenuItem key={index} item={item} />
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
