import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MatchDashboard from './pages/MatchDashboard';
import FantasyAssistant from './pages/FantasyAssistant';
import PlayerComparison from './pages/PlayerComparison';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  // Handle active navigation content render
  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'match':
        return <MatchDashboard />;
      case 'fantasy':
        return <FantasyAssistant />;
      case 'compare':
        return <PlayerComparison />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-cricket-dark-1 relative overflow-hidden flex flex-col">
      {/* Decorative Top-Right Corner Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-cricket-green/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Primary Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Layout Wrapper */}
      <main className="flex-grow pb-16 relative z-10">
        {renderContent()}
      </main>

      {/* Footer Meta */}
      <footer className="border-t border-cricket-card-border/60 py-6 bg-cricket-dark-2 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="text-xs text-gray-500 font-medium">
            © {new Date().getFullYear()} CricketIQ. Designed for elite hackathon demonstration.
          </p>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold">
            Deep Data-Driven Fan Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
