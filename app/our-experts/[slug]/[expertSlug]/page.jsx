import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { slugToTitle } from "@/utils/general";
import Link from "next/link";
import getData from "@/utils/getData";
import NextImage from "@/components/nextImage/NextImage";
import BookingFormWrapper from "@/components/form/BookingFormWrapper";

const Instagram = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
    </svg>
  );
};

const LinkedIn = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 10v7M8 7v.01M12 17v-4.5a2 2 0 0 1 4 0V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Twitter = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 
        8.502 11.24H16.17l-5.214-6.817 
        L4.99 21.75H1.68l7.73-8.835 
        L1.254 2.25H8.08l4.713 6.231z
        M17.083 19.77h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
};

const Facebook = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M13 7h-1.5A2.5 2.5 0 0 0 9 9.5V11H8v2h1v4h2v-4h1.5l.5-2H11V9.5a.5.5 0 0 1 .5-.5H13V7z"
        fill="currentColor"
      />
    </svg>
  );
};

const ExpertDetailPage = async ({ params }) => {
  const { slug, expertSlug } = await params;

  const res = await getData(`doctor?slug=${expertSlug}`, {});
  const content = res?.data;
  console.log("expert response", res);
  console.log(
    "image url",
    `https://cms.ubietysphere.ae/img/user-images/${content?.imageName}`
  );

  return (
    <>
      <Breadcrumb title={`${slugToTitle(slug)} Profile`}>
        <span>/</span>
        <span className="text-primary-light font-medium capitalize">
          <Link href={`/out-expers/${slug}`}>{slugToTitle(slug)}</Link>
        </span>
        <span>/</span>
        <span className="text-primary-light font-medium capitalize">
          {slugToTitle(expertSlug)}
        </span>
      </Breadcrumb>
      <div className="max-w-7xl w-full mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Sticky Image */}
        <div className="lg:grid-cols-2">
          <div className="sticky top-6">
            <NextImage
              src={`https://cms.ubietysphere.ae/img/user-images/${content?.imageName}`}
              objectFit="cover"
              alt={content?.firstName}
              width={500}
              height={700}
              priority
              className="w-full h-auto rounded-2xl shadow-lg object-cover max-h-[800px]"
            />
          </div>
        </div>

        {/* Right Column - Doctor Details */}
        <div className="lg:grid-cols-2 space-y-6">
          {/* Specialty */}
          <p className="uppercase tracking-widest text-sm text-gray-500">
            {content?.details?.category}
          </p>

          {/* Name */}
          <h1 className="text-3xl font-bold text-primary-light">
            {`${content?.firstName} ${content?.lastName}`}
          </h1>

          {/* Social Icons */}
          <div className="flex gap-3">
            {content?.details?.socialMediaUrls?.linkedin && (
              <Link
                href={content.details.socialMediaUrls.linkedin}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                target="_blank"
              >
                <LinkedIn />
              </Link>
            )}

            {content?.details?.socialMediaUrls?.instagram && (
              <Link
                href={content.details.socialMediaUrls.instagram}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                target="_blank"
              >
                <Instagram />
              </Link>
            )}

            {content?.details?.socialMediaUrls?.x && (
              <Link
                href={content.details.socialMediaUrls.x}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                target="_blank"
              >
                <Twitter />
              </Link>
            )}

            {content?.details?.socialMediaUrls?.facebook && (
              <Link
                href={content.details.socialMediaUrls.facebook}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                target="_blank"
              >
                <Facebook />
              </Link>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">
            {content?.details?.bio}
          </p>
          <br />
          {/* Information */}
          <div>
            <h2 className="text-xl font-semibold text-primary-light mb-4">
              Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xl">
              <div>
                <p className="text-gray-500 uppercase text-sm">Email</p>
                <p className="font-medium text-primary">{content?.email}</p>
              </div>
              {/* <div>
                <p className="text-gray-500 uppercase text-sm">Phone</p>
                <p className="font-medium text-primary">
                  {content?.mobileNumber}
                </p>
              </div> */}
              <div>
                <p className="text-gray-500 uppercase text-sm">From</p>
                <p className="font-medium text-primary">
                  {content?.details?.nationality}
                </p>
              </div>
            </div>
          </div>
          <br />
          {/* Experience */}
          <div>
            <h2 className="text-xl font-semibold text-primary-light mb-0">
              Qualifications & Experiences
            </h2>
            <div className="grid grid-cols-1 text-primary">
              {content?.qualifications?.map((item) => (
                <div
                  key={item?.id}
                  className="flex justify-between items-center gap-4 border-b-1 border-gray-300 py-4"
                >
                  <p className="text-gray-500 uppercase text-sm">
                    {item?.degreeType} Education:
                  </p>
                  <p className="font-medium">
                    {`${item?.fieldOfStudy}, ${item?.institutionName}, ${item?.country}`}
                  </p>
                </div>
              ))}
              {content?.licences?.map((item) => (
                <div
                  key={item?.id}
                  className="flex justify-between items-center gap-4 border-b-1 border-gray-300 py-4"
                >
                  <p className="text-gray-500 uppercase text-sm">
                    {item?.specialization} Licence:
                  </p>
                  <p className="font-medium">
                    {`From ${item?.authority}, Licence# ${item?.licenceNumber}`}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center gap-4 border-b-1 border-gray-300 py-4">
                <p className="text-gray-500 uppercase text-sm">
                  Years of Experience:
                </p>
                <p className="font-medium">
                  {content?.details?.totalExperience} Year
                  {content?.details?.totalExperience > 1 && "s"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl bg-[#e8e6f2] items-center rounded-[20px] w-full mx-auto mt-6 mb-15 lg:p-[60px] p-[20px] grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:grid-cols-2">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
            Our Working Process
          </h2>
          <div className="">
            <div className="flex items-center text-left gap-3 mb-8">
              <div className=" text-white bg-green-500 lg:p-6 p-3 flex items-center justify-center rounded-full">
                <span className="text-3xl font-semibold">01</span>
              </div>
              <p className="text-gray-600">
                <b className="text-xl font-semibold text-black">
                  Fill The Form:
                </b>{" "}
                There are many variations of passage of Lorem Ipsum available,
                but the majority have suffered.
              </p>
            </div>
            <div className="flex items-center text-left gap-3 mb-8">
              <div className=" text-white bg-blue-500 lg:p-6 p-3 flex items-center justify-center rounded-full">
                <span className="text-3xl font-semibold">02</span>
              </div>
              <p className="text-gray-600">
                <b className="text-xl font-semibold text-black">
                  Book an Appointment:
                </b>{" "}
                There are many variations of passage of Lorem Ipsum available,
                but the majority have suffered.
              </p>
            </div>
            <div className="flex items-center text-left gap-3 mb-8">
              <div className=" text-white bg-pink-500 lg:p-6 p-3 flex items-center justify-center rounded-full">
                <span className="text-3xl font-semibold">03</span>
              </div>
              <p className="text-gray-600">
                <b className="text-xl font-semibold text-black">Check-Ups:</b>{" "}
                There are many variations of passage of Lorem Ipsum available,
                but the majority have suffered.
              </p>
            </div>
            <div className="flex items-center text-left gap-3">
              <div className=" text-white bg-yellow-500 lg:p-6 p-3 flex items-center justify-center rounded-full">
                <span className="text-3xl font-semibold">04</span>
              </div>
              <p className="text-gray-600">
                <b className="text-xl font-semibold text-black">Get Reports:</b>{" "}
                There are many variations of passage of Lorem Ipsum available,
                but the majority have suffered.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:grid-cols-2">
          <div className="bg-white lg:p-[28px] p-[10px] rounded-2xl">
            <h3 className="text-center text-3xl capitalize font-medium">
              Book a consultation
            </h3>
            <BookingFormWrapper doctorName={expertSlug} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertDetailPage;
