"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Recommend', path: '/recommend' },
    { name: 'Generate', path: '/generate' },
  ];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`mx-2 px-3 py-2 rounded-md text-sm font-medium ${
              pathname === item.path
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
