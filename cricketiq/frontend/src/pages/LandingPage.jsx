import React from 'react';
import { BarChart2, UserCheck, Zap, TrendingUp, Sparkles, Database, Cpu } from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-80px)] py-12 flex flex-col justify-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cricket-green-glow rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cricket-blue-glow rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex-1 flex flex-col justify-center">
        {/* Badges / Tech Meta */}
        <div className="inline-flex items-center gap-2 bg-cricket-pitch border border-cricket-card-border px-4 py-2 rounded-full mx-auto mb-8 animate-fade-in shadow-green-glow">
          <Cpu className="w-4 h-4 text-cricket-green" />
          <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
            Qualcomm Snapdragon NPU Optimized • Edge AI Ready
          </span>
        </div>

        {/* Hero Headlines */}
        <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight mb-6 animate-slide-up bg-gradient-to-b from-white via-gray-100 to-gray-500 bg-clip-text text-transparent">
          CricketIQ
        </h1>
        <p className="font-display text-2xl md:text-3xl font-bold text-cricket-green tracking-wide mb-4 animate-slide-up animate-delay-100 glow-green">
          Cricket Data Into Fan Intelligence
        </p>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-12 animate-slide-up animate-delay-200">
          Turn ball-by-ball cricket data into momentum, predictions, fantasy picks, and match stories fans can understand — running ultra-low latency local AI on the edge.
        </p>

        {/* Interactive Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left max-w-5xl mx-auto">
          {/* Card 1 */}
          <div 
            onClick={() => setActiveTab('match')}
            className="premium-card cursor-pointer group hover:-translate-y-2 hover:border-cricket-green/50 transition-all duration-300 card-glow-green"
          >
            <div className="w-12 h-12 rounded-xl bg-cricket-green/10 flex items-center justify-center border border-cricket-green/20 mb-6 group-hover:bg-cricket-green/20 transition-all">
              <BarChart2 className="w-6 h-6 text-cricket-green" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-cricket-green transition-colors">
              Match Intelligence
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Track live momentum meters, real-time win probability algorithms, over-by-over run trajectories, and game-changing turning points.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setActiveTab('fantasy')}
            className="premium-card cursor-pointer group hover:-translate-y-2 hover:border-cricket-green/50 transition-all duration-300 card-glow-green"
          >
            <div className="w-12 h-12 rounded-xl bg-cricket-green/10 flex items-center justify-center border border-cricket-green/20 mb-6 group-hover:bg-cricket-green/20 transition-all">
              <UserCheck className="w-6 h-6 text-cricket-green" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-cricket-green transition-colors">
              Fantasy Assistant
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Unlock data-driven captain and vice-captain picks, discover hidden high-upside differential players, and check avoids based on real impact data.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => setActiveTab('compare')}
            className="premium-card cursor-pointer group hover:-translate-y-2 hover:border-cricket-blue/50 transition-all duration-300 card-glow-blue"
          >
            <div className="w-12 h-12 rounded-xl bg-cricket-blue/10 flex items-center justify-center border border-cricket-blue/20 mb-6 group-hover:bg-cricket-blue/20 transition-all">
              <Zap className="w-6 h-6 text-cricket-blue" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-cricket-blue transition-colors">
              Player Comparison
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Put any two players head-to-head. Analyze strike rates, dot-ball percentages, wicket ratios, and our unique AI-calculated Player Impact Score.
            </p>
          </div>
        </div>

        {/* Built for Edge Sports Intelligence Section */}
        <div className="max-w-5xl mx-auto mb-16 text-left space-y-6">
          <h2 className="font-display font-extrabold text-2xl text-white text-center">
            Built for Edge Sports Intelligence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-cricket-pitch border border-cricket-card-border p-5 rounded-2xl hover:border-cricket-green/20 transition-all">
              <span className="text-xs font-extrabold text-cricket-green uppercase tracking-widest block mb-2">01. Latency</span>
              <h4 className="font-display font-bold text-base text-white mb-1">Low-Latency</h4>
              <p className="text-xs text-gray-500">Sub-10ms predictions directly using Snapdragon NPUs.</p>
            </div>

            <div className="bg-cricket-pitch border border-cricket-card-border p-5 rounded-2xl hover:border-cricket-green/20 transition-all">
              <span className="text-xs font-extrabold text-cricket-green uppercase tracking-widest block mb-2">02. Data</span>
              <h4 className="font-display font-bold text-base text-white mb-1">Local Analytics</h4>
              <p className="text-xs text-gray-500">100% offline-compatible sports calculations.</p>
            </div>

            <div className="bg-cricket-pitch border border-cricket-card-border p-5 rounded-2xl hover:border-cricket-green/20 transition-all">
              <span className="text-xs font-extrabold text-cricket-green uppercase tracking-widest block mb-2">03. Graph</span>
              <h4 className="font-display font-bold text-base text-white mb-1">ONNX-Ready</h4>
              <p className="text-xs text-gray-500">Portable model graphs targeting Qualcomm QNN.</p>
            </div>

            <div className="bg-cricket-pitch border border-cricket-card-border p-5 rounded-2xl hover:border-cricket-green/20 transition-all">
              <span className="text-xs font-extrabold text-cricket-green uppercase tracking-widest block mb-2">04. Compile</span>
              <h4 className="font-display font-bold text-base text-white mb-1">AI Hub Ready</h4>
              <p className="text-xs text-gray-500">Profile compiled models on target devices.</p>
            </div>

            <div className="bg-cricket-pitch border border-cricket-card-border p-5 rounded-2xl hover:border-cricket-green/20 transition-all">
              <span className="text-xs font-extrabold text-cricket-green uppercase tracking-widest block mb-2">05. Platform</span>
              <h4 className="font-display font-bold text-base text-white mb-1">Snapdragon Ready</h4>
              <p className="text-xs text-gray-500">Optimized for Hexagon NPU capabilities.</p>
            </div>

          </div>
        </div>

        {/* Direct CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab('match')}
            className="w-full sm:w-auto bg-gradient-to-r from-cricket-green to-cricket-green-dark text-white font-display font-bold px-8 py-4 rounded-xl shadow-green-glow hover:brightness-110 active:scale-95 transition-all text-base tracking-wide"
          >
            Analyze Match
          </button>
          <button
            onClick={() => setActiveTab('fantasy')}
            className="w-full sm:w-auto bg-cricket-pitch border border-cricket-card-border text-white hover:text-cricket-green hover:border-cricket-green/30 font-display font-semibold px-8 py-4 rounded-xl active:scale-95 transition-all text-base tracking-wide"
          >
            Fantasy Assistant
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className="w-full sm:w-auto bg-cricket-pitch border border-cricket-card-border text-white hover:text-cricket-blue hover:border-cricket-blue/30 font-display font-semibold px-8 py-4 rounded-xl active:scale-95 transition-all text-base tracking-wide"
          >
            Compare Players
          </button>
        </div>

        {/* Dynamic Analytics Overview */}
        <div className="max-w-4xl mx-auto border border-cricket-card-border bg-cricket-pitch/40 rounded-2xl p-6 flex flex-wrap gap-8 items-center justify-around text-left">
          <div className="flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cricket-green" />
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Edge Processing</p>
              <h4 className="font-display font-extrabold text-lg text-white">Qualcomm QNN Ready</h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-cricket-green" />
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Analytics Formulas</p>
              <h4 className="font-display font-extrabold text-lg text-white">100% Explainable</h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-cricket-green" />
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Match Stories</p>
              <h4 className="font-display font-extrabold text-lg text-white">On-Device Insights</h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
