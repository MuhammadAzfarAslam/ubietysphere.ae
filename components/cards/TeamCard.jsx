import React from "react";
import Image from "next/image";
import Link from "next/link";

const TeamCard = ({
  imageURL = "/assets/images/team1.jpg",
  title = "",
  designation = "",
  service,
  slug,
  totalExperience
}) => {
  return (
    <div className="relative flex flex-col items-center text-center ">
      <Link href={`/our-experts/${service}/${slug}`} className="absolute top-0 left-0 w-full h-full z-50"></Link>
      <div className="relative h-60 w-full">
        <Image
          src={imageURL}
          alt={title}
          fill
          objectFit="cover"
          className="rounded-2xl object-top mb-4 shadow"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 pt-6">{title}</h3>
      <p className="text-sm text-gray-500 capitalize">{totalExperience > 4 ? 'Senior' : null} {designation}</p>
    </div>
  );
};

export default TeamCard;
