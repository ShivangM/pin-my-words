import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import footerLinks from '../../constants/footer-links.json';

type FooterLink = {
  name: string;
  url: string;
};

type FooterLinkProps = {
  link: FooterLink;
};

const FooterLink = ({ link }: FooterLinkProps) => {
  const { name, url } = link;
  return (
    <li>
      <Link href={url} className="mr-4 hover:underline md:mr-6 ">
        {name}
      </Link>
    </li>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-50 rounded-lg shadow m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center relative mb-4 sm:mb-0">
            <Image
              src="/PinMyWords-Logo.svg"
              className="mr-3"
              width={120}
              height={32}
              alt="Pin-My-Words Logo"
            />
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
            {footerLinks.map((link) => (
              <FooterLink key={link.name} link={link} />
            ))}
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center">
          © {new Date().getFullYear()}{' '}
          <a href="/" className="hover:underline">
            Pin-My-Words™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
