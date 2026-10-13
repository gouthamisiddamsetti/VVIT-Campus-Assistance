import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Building2,
  Cpu,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
  Menu,
  X,
  Search
} from 'lucide-react';
import { authService } from '../../services/firebase/authService';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentAdmin = authService.getCurrentAdmin();

  const navLinks = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Explore Campus', path: '/explore', icon: Building2 },
    { name: 'Departments & Labs', path: '/departments-labs', icon: Cpu },
    { name: 'Facilities', path: '/facilities', icon: Layers },
    { name: 'Ask AI', path: '/ask-ai', icon: Sparkles },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-black text-white border-b border-[#E67E6A]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Wordmark with Official VVIT University Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#E67E6A] rounded-lg p-1"
          >
            <div className="bg-white p-1 rounded-xl shadow-md border border-neutral-200 flex items-center justify-center shrink-0">
              <img
                src="/vvit-logo.jpg"
                alt="VVIT University Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-[#E67E6A] transition-colors">
                VVIT <span className="text-[#E67E6A] font-bold">ASSISTANCE</span>
              </span>
              <span className="text-[10px] text-neutral-300 tracking-wider uppercase font-medium">
                Vasireddy Venkatadri University
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#E67E6A] text-white shadow-sm'
                      : 'text-neutral-200 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Admin portal & Quick Search */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/search"
              aria-label="Quick Campus Search"
              className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors focus:ring-2 focus:ring-[#E67E6A]"
            >
              <Search className="w-4 h-4" />
            </Link>

            {currentAdmin ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E67E6A] text-white text-xs font-bold shadow-sm hover:bg-[#d66c58] transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#E67E6A]" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E67E6A]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-black px-4 pt-3 pb-6 space-y-1 shadow-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#E67E6A] text-white font-bold'
                    : 'text-neutral-200 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-5 h-5 text-[#E67E6A]" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2 text-sm text-neutral-300 hover:text-white"
            >
              <Search className="w-5 h-5 text-[#E67E6A]" />
              <span>Full Campus Search</span>
            </Link>
            {currentAdmin ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 text-sm text-white font-bold bg-[#E67E6A] rounded-xl"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 text-sm text-neutral-300 hover:text-white"
              >
                <ShieldAlert className="w-5 h-5 text-[#E67E6A]" />
                <span>Administrator Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
