import { CommonLink } from '@/interfaces/Typings.d';
import Image from 'next/image';
import Link from 'next/link';
import navbarLinks from '../../constants/navbar-links.json';
import HamburgerIcon from './HamburgerIcon';
import User from './User';

const NavbarLink = ({ link }: { link: CommonLink }) => {
  const { label, href } = link;
  return (
    <li>
      <Link
        href={href}
        className="block py-2 pl-3 pr-4 hover:underline text-white bg-gray-800 rounded md:bg-transparent md:text-gray-800 md:p-0"
        aria-current="page"
      >
        {label}
      </Link>
    </li>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-gray-50 z-40 border-gray-200 sticky top-0 left-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/PinMyWords-Logo.svg"
            className="mr-3"
            width={120}
            height={32}
            alt="Pin-My-Words Logo"
          />
        </Link>

        <div className="flex items-center md:order-2">
          <User />
          <HamburgerIcon />
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            {navbarLinks.map((link, idx) => (
              <NavbarLink key={idx} link={link} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
