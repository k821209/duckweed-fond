import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuLeaf, LuMenu, LuX } from 'react-icons/lu';

const navItems = [
  { path: '/accessions', label: '품종' },
  { path: '/genomics', label: '게놈 브라우저' },
  { path: '/map', label: '지도' },
  { path: '/literature', label: '연구현황' },
  { path: '/download', label: '다운로드' },
  { path: '/about', label: 'About' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-duckweed-700 font-bold text-xl">
            <LuLeaf className="text-2xl" />
            <span className="hidden sm:inline">Duckweed Genomics</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'text-duckweed-600'
                    : 'text-gray-600 hover:text-duckweed-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <LuX className="text-xl" /> : <LuMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 text-sm font-medium ${
                location.pathname.startsWith(item.path)
                  ? 'text-duckweed-600 bg-duckweed-50'
                  : 'text-gray-600'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
