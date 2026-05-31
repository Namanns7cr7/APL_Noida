import React from 'react';
import { Shield, Zap, UserCheck, BarChart2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'match', label: 'Match Intelligence', icon: BarChart2 },
    { id: 'fantasy', label: 'Fantasy Assistant', icon: UserCheck },
    { id: 'compare', label: 'Player Comparison', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cricket-card-border bg-cricket-dark-1/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cricket-green to-cricket-green-dark shadow-green-glow animate-pulse-green">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-wider text-white">
                CRICKET<span className="text-cricket-green glow-green">IQ</span>
              </span>
              <p className="text-[10px] tracking-widest text-gray-400 font-medium uppercase -mt-1">
                Data Into Fan Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium tracking-wide text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-cricket-green/20 to-cricket-green-dark/10 border border-cricket-green/30 text-cricket-green glow-green'
                      : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-cricket-green' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Small Match Status Badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cricket-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cricket-green"></span>
            </span>
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest bg-cricket-pitch border border-cricket-card-border px-3 py-1.5 rounded-lg">
              Live Intel
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}
