import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  Trophy, Award, Sparkles, UserX, Star, Zap, ShieldCheck, 
  Percent, ArrowRight, ShieldAlert, Sparkle, RefreshCw
} from 'lucide-react';

export default function FantasyAssistant() {
  const [picks, setPicks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFantasyPicks() {
      try {
        const res = await apiService.getMatchFantasy(1);
        setPicks(res);
      } catch (err) {
        console.error('Error fetching fantasy picks', err);
      } finally {
        setLoading(false);
      }
    }
    loadFantasyPicks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <RefreshCw className="w-10 h-10 text-cricket-green animate-spin" />
        <p className="text-gray-400 font-medium tracking-wide">Assembling optimal fantasy rosters...</p>
      </div>
    );
  }

  const { captain, vice_captain, differential, avoid } = picks || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-cricket-green/10 border border-cricket-green/20 px-4 py-2 rounded-full text-xs font-bold text-cricket-green tracking-wide">
          <Star className="w-4 h-4 fill-cricket-green text-cricket-green" />
          FANTASY TEAM OPTIMIZER
        </div>
        <h2 className="font-display font-extrabold text-3xl text-white">AI-Optimized Fantasy Strategy</h2>
        <p className="max-w-xl mx-auto text-sm text-gray-400">
          Gain immediate competition advantage with calculated captains, vice-captains, differential picks, and crucial players to avoid.
        </p>
      </div>

      {/* Grid of Picks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Captain Pick */}
        {captain && (
          <div className="premium-card relative overflow-hidden group hover:border-cricket-green/40 shadow-green-glow transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cricket-green-glow rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cricket-green/10 border border-cricket-green/20 flex items-center justify-center shadow-inner shrink-0 text-cricket-green">
                <Trophy className="w-7 h-7 glow-green" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cricket-green">
                  Primary Pick (2x Points)
                </span>
                <h3 className="font-display font-black text-2xl text-white mt-0.5">{captain.name}</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{captain.role} • {captain.team}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-cricket-dark-1/60 border border-cricket-card-border p-3.5 rounded-xl">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Impact Score</span>
                <span className="font-display font-black text-xl text-white">{captain.impact_score}</span>
              </div>
              <div className="bg-cricket-dark-1/60 border border-cricket-card-border p-3.5 rounded-xl">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Selection Confidence</span>
                <span className="font-display font-black text-xl text-cricket-green glow-green">{captain.confidence}%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-cricket-card-border/60">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">Intelligence Report:</h4>
              <p className="text-xs text-gray-400 leading-relaxed bg-cricket-dark-1/40 border border-cricket-card-border p-3 rounded-xl">
                {captain.reason}
              </p>
            </div>
          </div>
        )}

        {/* 2. Vice Captain Pick */}
        {vice_captain && (
          <div className="premium-card relative overflow-hidden group hover:border-cricket-green/40 shadow-green-glow transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cricket-green-glow rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cricket-green/10 border border-cricket-green/20 flex items-center justify-center shadow-inner shrink-0 text-cricket-green">
                <Award className="w-7 h-7 glow-green" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cricket-green">
                  Secondary Pick (1.5x Points)
                </span>
                <h3 className="font-display font-black text-2xl text-white mt-0.5">{vice_captain.name}</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{vice_captain.role} • {vice_captain.team}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-cricket-dark-1/60 border border-cricket-card-border p-3.5 rounded-xl">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Impact Score</span>
                <span className="font-display font-black text-xl text-white">{vice_captain.impact_score}</span>
              </div>
              <div className="bg-cricket-dark-1/60 border border-cricket-card-border p-3.5 rounded-xl">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Selection Confidence</span>
                <span className="font-display font-black text-xl text-cricket-green glow-green">{vice_captain.confidence}%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-cricket-card-border/60">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">Intelligence Report:</h4>
              <p className="text-xs text-gray-400 leading-relaxed bg-cricket-dark-1/40 border border-cricket-card-border p-3 rounded-xl">
                {vice_captain.reason}
              </p>
            </div>
          </div>
        )}

        {/* 3. Differential Pick */}
        {differential && (
          <div className="premium-card relative overflow-hidden group hover:border-cricket-blue/40 shadow-blue-glow transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cricket-blue-glow rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cricket-blue/10 border border-cricket-blue/20 flex items-center justify-center shadow-inner shrink-0 text-cricket-blue">
                <Zap className="w-7 h-7 glow-blue" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cricket-blue">
                  Differential (High Risk/Reward)
                </span>
                <h3 className="font-display font-black text-2xl text-white mt-0.5">{differential.name}</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{differential.role} • {differential.team}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-cricket-dark-1/60 border border-cricket-card-border p-3.5 rounded-xl">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Impact Score</span>
                <span className="font-display font-black text-xl text-white">{differential.impact_score}</span>
              </div>
              <div className="bg-cricket-dark-1/60 border border-cricket-card-border p-3.5 rounded-xl">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Selection Confidence</span>
                <span className="font-display font-black text-xl text-cricket-blue glow-blue">{differential.confidence}%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-cricket-card-border/60">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">Intelligence Report:</h4>
              <p className="text-xs text-gray-400 leading-relaxed bg-cricket-dark-1/40 border border-cricket-card-border p-3 rounded-xl">
                {differential.reason}
              </p>
            </div>
          </div>
        )}

        {/* 4. Avoid Pick */}
        {avoid && (
          <div className="premium-card relative overflow-hidden group hover:border-red-500/30 transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-inner shrink-0 text-red-400">
                <UserX className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">
                  Avoid Pick (Low Yield Potential)
                </span>
                <h3 className="font-display font-black text-2xl text-white mt-0.5">{avoid.name}</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{avoid.role} • {avoid.team}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-cricket-dark-1/60 border border-cricket-card-border p-3.5 rounded-xl">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Impact Score</span>
                <span className="font-display font-black text-xl text-white">{avoid.impact_score}</span>
              </div>
              <div className="bg-cricket-dark-1/60 border border-cricket-card-border p-3.5 rounded-xl">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Avoid Recommendation</span>
                <span className="font-display font-black text-xl text-red-400">{avoid.confidence}%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-cricket-card-border/60">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">Intelligence Report:</h4>
              <p className="text-xs text-gray-400 leading-relaxed bg-cricket-dark-1/40 border border-cricket-card-border p-3 rounded-xl">
                {avoid.reason}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Roster Optimization Overview */}
      <div className="premium-card flex flex-col md:flex-row items-center gap-6 border-cricket-green/20 bg-gradient-to-r from-cricket-green/5 to-transparent">
        <div className="p-4 bg-cricket-green/10 border border-cricket-green/20 rounded-2xl text-cricket-green">
          <ShieldCheck className="w-8 h-8 glow-green" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-display font-bold text-white text-base">Roster Formula Overview</h4>
          <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">
            Our fantasy optimization rules weigh runs, batting strike-rate acceleration, boundary bonus counts (fours and sixes), wickets taken, dot-ball defensive values, and scoring milestones (half-centuries and centuries) to predict absolute expected performance yields.
          </p>
        </div>
      </div>

    </div>
  );
}
