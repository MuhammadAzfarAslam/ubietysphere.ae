import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ContactCard from "@/components/cards/ContactCard";
import Image from "next/image";
import Contact from "@/components/form/Contact";

const ContactPage = () => {
  return (
    <>
      <Breadcrumb title="Contact">
        <span>/</span>
        <span className="text-primary-light font-medium">Contact</span>
      </Breadcrumb>
      <section className="relative bg-white py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <ContactCard
            type="address"
            title="Office Address"
            lines={[
              "16/A, Romadan House City",
              "Tower New York, United States",
            ]}
          />
          <ContactCard
            type="phone"
            title="Phone Number"
            lines={["+971527777595", "+971527777595"]}
          />
          <ContactCard
            type="email"
            title="Email Address"
            lines={["contact@ubietysphere.ae", "sumedha@sumedhasahni.com"]}
          />
        </div>
      </section>

      <section className="contact-form relative bg-white pb-16">
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto">
          <div className="w-full md:w-2/5">
            <Image src={'https://ubietysphere.ae/assets/images/contact.jpg'} height={300} width={500} alt="contact image" />
          </div>
          <div className="w-full md:w-3/5"><Contact /></div>
        </div>
      </section>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1786534495045!2d55.27437639999999!3d25.197197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2s!4v1753532773011!5m2!1sen!2s"
        width="100%"
        height="600"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </>
  );
};

export default ContactPage;
