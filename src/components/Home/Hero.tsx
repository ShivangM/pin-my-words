import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Hero = (props: Props) => {
  return (
    <section className="">
      <div className="flex flex-col justify-center mx-auto lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-5xl font-bold leadi sm:text-6xl">
            Explore the world of <span className="text-brand">words</span>
          </h1>
          <p className="mt-6 mb-8 text-sm sm:text-base lg:text-md 2xl:text-lg sm:mb-12">
            Are you preparing for CAT or GRE? Do you want to learn new words
            every day? Do you want to keep track of your progress? Do you want
            to compete with your friends? If yes, then you are at the right
            place.
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link
              rel="noopener noreferrer"
              href="/login"
              className="px-8 py-3 text-lg font-semibold rounded bg-brand text-white"
            >
              Login
            </Link>
            <Link
              rel="noopener noreferrer"
              href="/explore"
              className="px-8 py-3 text-lg font-semibold border-2 rounded border-gray-400 hover:border-gray-500 transition-all ease-in-out duration-300"
            >
              Explore
            </Link>
          </div>
        </div>
        <div className="flex items-center relative justify-center p-6 mt-8 lg:mt-0">
          <Image
            src="assets/Hero.svg"
            alt="Hero Image"
            className=""
            height={600}
            width={600}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
