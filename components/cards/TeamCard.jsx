import React from "react";
import Image from "next/image";

const TeamCard = ({
  imageURL = "/assets/images/team1.jpg",
  title="",
  designation="",
}) => {
  return (
    <div className="flex flex-col items-center text-center ">
      <div className="relative h-60 w-full">
        <Image
          src={'/assets/images/team1.jpg'}
          alt="Dr. Jane Doe"
          fill
          objectFit="cover"
          width={264}
          height={240}
          className="rounded-2xl object-top mb-4 shadow"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 pt-6">{title}</h3>
      <p className="text-sm text-gray-500">{designation}</p>
    </div>
  );
};

export default TeamCard;
