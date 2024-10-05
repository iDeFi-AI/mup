import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NextImage from 'next/image';
import Link from 'next/link';

import LogoImage from '@/assets/imgs/agent-idefi-ai.png';

const NavMenu: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Disclosure as="nav" className={`bg-white shadow ${isScrolled ? 'sticky-header' : ''}`}>
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center">
                <Link href="/">
                  <NextImage
                    className="h-8 w-auto"
                    src={LogoImage}
                    alt="iDeFi.AI Logo"
                    width={150}
                    height={50}
                  />
                </Link>
              </div>
              <div className="hidden lg:flex lg:space-x-8">
                <Link href="/" className="text-gray-900 hover:text-neorange">Agents</Link>
                <Link href="/" className="text-gray-900 hover:text-neorange">Recents</Link>
                <Link href="/" className="text-gray-900 hover:text-neorange">Favorites</Link>
                <Link href="/" className="text-gray-900 hover:text-neorange">Share with Client</Link>
                <Link href="/" className="text-gray-900 hover:text-neorange">Savings</Link>
                <Link href="/" className="text-gray-900 hover:text-neorange">Upgrade Plan</Link>
              </div>
              <div className="lg:hidden">
                <Disclosure.Button className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neorange">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-neorange">Agents</Link>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-neorange">Recents</Link>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-neorange">Favorites</Link>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-neorange">Share with Client</Link>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-neorange">Savings</Link>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-neorange">Upgrade Plan</Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default NavMenu;
