import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Zap, HelpCircle, AlertCircle, TrendingUp, ShieldAlert, BarChart3, ChevronRight } from 'lucide-react';

export default function PlayerComparison() {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load players lists from active match
  useEffect(() => {
    async function loadPlayers() {
      try {
        const list = await apiService.getMatchPlayers(1);
        setPlayers(list);
        if (list && list.length > 1) {
          setPlayer1(list[0].name);
          setPlayer2(list[3]?.name || list[1].name);
        }
      } catch (err) {
        console.error('Failed to load comparison players', err);
      }
    }
    loadPlayers();
  }, []);

  // Fetch comparison stats when players are selected
  useEffect(() => {
    if (!player1 || !player2) return;
    
    async function fetchComparison() {
      setLoading(true);
      try {
        const res = await apiService.getPlayerComparison(player1, player2, 1);
        setComparison(res);
        setError(null);
      } catch (err) {
        console.error('Error fetching player comparison data', err);
        setError('Could not complete head-to-head comparison.');
      } finally {
        setLoading(false);
      }
    }

    fetchComparison();
  }, [player1, player2]);

  const p1 = comparison?.player1;
  const p2 = comparison?.player2;

  // Render a single premium comparison row
  const renderStatRow = (label, key, isLowerBetter = false) => {
    if (!p1 || !p2) return null;
    const val1 = p1[key];
    const val2 = p2[key];

    let p1Better = false;
    if (val1 !== val2) {
      p1Better = isLowerBetter ? val1 < val2 : val1 > val2;
    }

    return (
      <tr className="border-b border-cricket-card-border/60 hover:bg-cricket-dark-1/20 transition-all text-sm">
        <td className="py-4 px-4 font-semibold text-gray-400 text-left">{label}</td>
        <td className={`py-4 px-6 text-center font-bold ${p1Better ? 'text-cricket-green' : 'text-gray-300'}`}>
          {val1}
        </td>
        <td className={`py-4 px-6 text-center font-bold ${!p1Better && val1 !== val2 ? 'text-cricket-blue' : 'text-gray-300'}`}>
          {val2}
        </td>
      </tr>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display font-extrabold text-3xl text-white">Player Intelligence Lab</h2>
        <p className="max-w-xl mx-auto text-sm text-gray-400">
          Compare batting efficiency, bowling defensive value, and custom-formulated Impact Metrics head-to-head.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="premium-card grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Player 1 Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-cricket-green block">Choose Player A</label>
          <select
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            className="w-full bg-cricket-dark-1 border border-cricket-card-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-cricket-green transition-all"
          >
            {players.map((p) => (
              <option key={`p1-${p.name}`} value={p.name} disabled={p.name === player2}>
                {p.name} ({p.role} - {p.team})
              </option>
            ))}
          </select>
        </div>

        {/* Player 2 Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-cricket-blue block">Choose Player B</label>
          <select
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            className="w-full bg-cricket-dark-1 border border-cricket-card-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-cricket-blue transition-all"
          >
            {players.map((p) => (
              <option key={`p2-${p.name}`} value={p.name} disabled={p.name === player1}>
                {p.name} ({p.role} - {p.team})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <TrendingUp className="w-8 h-8 text-cricket-green animate-spin" />
        </div>
      )}

      {/* Head-to-Head Visuals */}
      {!loading && p1 && p2 && (
        <div className="space-y-8">
          
          {/* Top Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Player A Premium Summary Card */}
            <div className="premium-card relative overflow-hidden group hover:border-cricket-green/30 transition-all shadow-green-glow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cricket-green-glow rounded-full blur-3xl" />
              <span className="text-[10px] font-bold text-cricket-green uppercase tracking-widest bg-cricket-green/10 border border-cricket-green/20 px-3 py-1 rounded-full">
                Player A
              </span>
              <h3 className="font-display font-black text-2xl text-white mt-4">{p1.name}</h3>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{p1.role} • {p1.team}</p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-cricket-dark-1/80 border border-cricket-card-border p-4 rounded-xl">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Impact Score</span>
                  <span className="font-display font-extrabold text-2xl text-cricket-green glow-green">{p1.impact_score}</span>
                </div>
                <div className="bg-cricket-dark-1/80 border border-cricket-card-border p-4 rounded-xl">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Fantasy Score</span>
                  <span className="font-display font-extrabold text-2xl text-white">{p1.fantasy_score}</span>
                </div>
              </div>
            </div>

            {/* Player B Premium Summary Card */}
            <div className="premium-card relative overflow-hidden group hover:border-cricket-blue/30 transition-all shadow-blue-glow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cricket-blue-glow rounded-full blur-3xl" />
              <span className="text-[10px] font-bold text-cricket-blue uppercase tracking-widest bg-cricket-blue/10 border border-cricket-blue/20 px-3 py-1 rounded-full">
                Player B
              </span>
              <h3 className="font-display font-black text-2xl text-white mt-4">{p2.name}</h3>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{p2.role} • {p2.team}</p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-cricket-dark-1/80 border border-cricket-card-border p-4 rounded-xl">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Impact Score</span>
                  <span className="font-display font-extrabold text-2xl text-cricket-blue glow-blue">{p2.impact_score}</span>
                </div>
                <div className="bg-cricket-dark-1/80 border border-cricket-card-border p-4 rounded-xl">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Fantasy Score</span>
                  <span className="font-display font-extrabold text-2xl text-white">{p2.fantasy_score}</span>
                </div>
              </div>
            </div>

          </div>

          {/* AI / Formula Explanation Banner */}
          {comparison.summary && (
            <div className="premium-card border-cricket-green/20 bg-gradient-to-r from-cricket-green/5 to-transparent flex items-start gap-4">
              <div className="p-3 bg-cricket-green/10 border border-cricket-green/20 rounded-xl text-cricket-green shrink-0">
                <Zap className="w-5 h-5 glow-green" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-white text-base">Impact Verdict</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{comparison.summary}</p>
              </div>
            </div>
          )}

          {/* Metric Comparison Table */}
          <div className="premium-card overflow-hidden !p-0">
            <div className="border-b border-cricket-card-border p-6 bg-cricket-pitch/40">
              <h3 className="font-display font-bold text-lg text-white">Metrics Breakdown</h3>
              <p className="text-xs text-gray-400">Green / Blue indicators highlight the top-performing player per category</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cricket-card-border bg-cricket-dark-1/40 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <th className="py-4 px-4 text-left">Category</th>
                    <th className="py-4 px-6 text-center text-cricket-green">{p1.name}</th>
                    <th className="py-4 px-6 text-center text-cricket-blue">{p2.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cricket-card-border/40">
                  {renderStatRow('Runs Scored', 'runs')}
                  {renderStatRow('Balls Faced', 'balls')}
                  {renderStatRow('Strike Rate', 'strike_rate')}
                  {renderStatRow('Fours (4s)', 'fours')}
                  {renderStatRow('Sixes (6s)', 'sixes')}
                  {renderStatRow('Wickets Taken', 'wickets')}
                  {renderStatRow('Economy Rate', 'economy', true)}
                  {renderStatRow('Dot Balls Bowled', 'dot_balls')}
                  {renderStatRow('Impact Score', 'impact_score')}
                  {renderStatRow('Fantasy Score', 'fantasy_score')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
