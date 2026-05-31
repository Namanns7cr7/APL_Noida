import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  Trophy, MapPin, Calendar, Activity, Zap, Sparkles, AlertCircle, RefreshCw, 
  HelpCircle, ChevronRight, BarChart2
} from 'lucide-react';

export default function MatchDashboard() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Match Data States
  const [summary, setSummary] = useState(null);
  const [momentum, setMomentum] = useState(null);
  const [winProb, setWinProb] = useState(null);
  const [turningPoints, setTurningPoints] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [edgeStatus, setEdgeStatus] = useState(null);
  const [edgePrediction, setEdgePrediction] = useState(null);

  // Initialize: Load Matches
  useEffect(() => {
    async function loadMatches() {
      try {
        const list = await apiService.getMatches();
        setMatches(list);
        if (list && list.length > 0) {
          setSelectedMatchId(list[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load matches list', err);
        setError('Could not connect to backend server. Operating in local demo mode.');
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  // Fetch all match stats when selectedMatchId changes
  useEffect(() => {
    if (!selectedMatchId) return;

    async function fetchMatchStats() {
      setLoading(true);
      try {
        const [sumRes, momRes, wpRes, tpRes, aiRes, edgeStatusRes, edgePredRes] = await Promise.all([
          apiService.getMatchSummary(selectedMatchId),
          apiService.getMatchMomentum(selectedMatchId),
          apiService.getMatchWinProbability(selectedMatchId),
          apiService.getMatchTurningPoints(selectedMatchId),
          apiService.getMatchAISummary(selectedMatchId),
          apiService.getEdgeStatus(),
          apiService.getEdgePredict()
        ]);

        setSummary(sumRes);
        setMomentum(momRes);
        setWinProb(wpRes);
        setTurningPoints(tpRes);
        setAiSummary(aiRes);
        setEdgeStatus(edgeStatusRes);
        setEdgePrediction(edgePredRes);
        setError(null);
      } catch (err) {
        console.error('Error fetching match dashboard details', err);
        setError('Error loading data for the selected match. Using offline simulation data.');
      } finally {
        setLoading(false);
      }
    }

    fetchMatchStats();
  }, [selectedMatchId]);

  if (loading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <RefreshCw className="w-10 h-10 text-cricket-green animate-spin" />
        <p className="text-gray-400 font-medium tracking-wide">Synthesizing Cricket Data & Fan Intelligence...</p>
      </div>
    );
  }

  // Safely grab team details from summary
  const team1 = summary?.team1 || 'Mumbai Indians';
  const team2 = summary?.team2 || 'Chennai Super Kings';
  const inn1 = summary?.inning1 || { runs: 0, wickets: 0, overs: 0 };
  const inn2 = summary?.inning2 || null;

  // Prepare chart data (Runs per over)
  const chartData = [];
  const team1Overs = momentum?.teams?.find(t => t.team === team1)?.recent_overs || [];
  const team2Overs = momentum?.teams?.find(t => t.team === team2)?.recent_overs || [];

  const maxOvers = Math.max(team1Overs.length, team2Overs.length, 1);
  for (let i = 1; i <= maxOvers; i++) {
    const t1Stats = team1Overs.find(o => o.over === i) || { runs: 0, wickets: 0 };
    const t2Stats = team2Overs.find(o => o.over === i) || { runs: 0, wickets: 0 };
    chartData.push({
      over: `Over ${i}`,
      [team1]: t1Stats.runs,
      [team2]: t2Stats.runs,
      [`${team1} Wkts`]: t1Stats.wickets * 10, // Scale for visuals
      [`${team2} Wkts`]: t2Stats.wickets * 10,
    });
  }

  // Momentum Stats
  const team1Momentum = momentum?.teams?.find(t => t.team === team1) || { momentum: 50, reason: '' };
  const team2Momentum = momentum?.teams?.find(t => t.team === team2) || { momentum: 50, reason: '' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Top Controls: Match Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-cricket-pitch border border-cricket-card-border p-4 rounded-2xl">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Live Match Intelligence Center</h2>
          <p className="text-xs text-gray-400">Select any match from your Kaggle repository or local database</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm text-gray-400 font-medium whitespace-nowrap">Active Match:</span>
          <select
            value={selectedMatchId || ''}
            onChange={(e) => setSelectedMatchId(Number(e.target.value))}
            className="bg-cricket-dark-1 border border-cricket-card-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-cricket-green w-full sm:w-64 transition-all"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.team1} vs {m.team2} ({m.season})
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

      {/* Main Match Summary Banner */}
      {summary && (
        <div className="premium-card relative overflow-hidden">
          {/* Subtle live indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-cricket-green/10 border border-cricket-green/20 px-3 py-1 rounded-full text-xs font-semibold text-cricket-green">
            <span className="h-1.5 w-1.5 rounded-full bg-cricket-green animate-pulse" />
            MATCH ANALYSIS LIVE
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Team 1 Info */}
            <div className="text-center lg:text-left space-y-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">1st Innings Batting</span>
              <h3 className="font-display font-extrabold text-2xl text-white">{team1}</h3>
              <div className="flex items-baseline justify-center lg:justify-start gap-2">
                <span className="font-display font-black text-4xl text-white">{inn1.runs}/{inn1.wickets}</span>
                <span className="text-sm text-gray-400">({inn1.overs} ov)</span>
              </div>
            </div>

            {/* Match VS / Venue Meta */}
            <div className="text-center space-y-3 py-4 lg:py-0 border-y lg:border-y-0 lg:border-x border-cricket-card-border px-4">
              <div className="inline-block bg-cricket-green/10 border border-cricket-green/20 rounded-full px-4 py-1 text-sm font-bold text-cricket-green tracking-wide">
                VS
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cricket-green" />
                  {summary.venue}
                </p>
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {summary.date}
                </p>
              </div>
            </div>

            {/* Team 2 Info */}
            <div className="text-center lg:text-right space-y-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">2nd Innings Batting</span>
              <h3 className="font-display font-extrabold text-2xl text-white">{team2}</h3>
              {inn2 ? (
                <div className="flex items-baseline justify-center lg:justify-end gap-2">
                  <span className="font-display font-black text-4xl text-white">{inn2.runs}/{inn2.wickets}</span>
                  <span className="text-sm text-gray-400">({inn2.overs} ov)</span>
                </div>
              ) : (
                <div className="text-sm text-gray-400 font-semibold uppercase py-2">Yet to Bat</div>
              )}
            </div>
          </div>

          {/* Winner details */}
          {summary.winner && (
            <div className="mt-6 pt-6 border-t border-cricket-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Result: <strong className="text-white">{summary.winner}</strong> won by {summary.result_margin} {summary.result}</span>
              </div>
              {summary.player_of_match && (
                <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase bg-cricket-dark-1/80 border border-cricket-card-border px-4 py-2 rounded-lg">
                  POM: <span className="text-cricket-green">{summary.player_of_match}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AI Explanation & Win Probability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Insight Card */}
        <div className="premium-card lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cricket-green/10 border border-cricket-green/20">
              <Sparkles className="w-5 h-5 text-cricket-green" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">AI Match Story</h3>
              <p className="text-xs text-gray-400">Natural language intelligence and situational overview</p>
            </div>
          </div>
          {aiSummary ? (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed text-sm md:text-base bg-cricket-dark-1/40 border border-cricket-card-border p-4 rounded-xl">
                {aiSummary.summary}
              </p>
              <div className="space-y-2">
                <span className="text-xs font-bold text-cricket-green uppercase tracking-wider block">Key Insights:</span>
                <ul className="space-y-2.5 text-xs text-gray-400">
                  {aiSummary.key_insights?.map((ins, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-normal">
                      <ChevronRight className="w-4 h-4 text-cricket-green shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500 text-sm">AI Summary data not available.</div>
          )}
        </div>

        {/* Win Probability Card */}
        {winProb && (
          <div className="premium-card flex flex-col justify-between space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cricket-blue/10 border border-cricket-blue/20">
                <Activity className="w-5 h-5 text-cricket-blue" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Win Probability</h3>
                <p className="text-xs text-gray-400">Explainable machine learning simulation</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-white text-xs uppercase tracking-wider">{team1}</span>
                <span className="font-bold text-cricket-green text-sm">{winProb.teamA_prob}%</span>
              </div>
              <div className="w-full h-3 bg-cricket-dark-1 border border-cricket-card-border rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${winProb.teamA_prob}%` }} 
                  className="h-full bg-gradient-to-r from-cricket-green to-cricket-green-dark transition-all duration-1000 shadow-green-glow" 
                />
                <div 
                  style={{ width: `${winProb.teamB_prob}%` }} 
                  className="h-full bg-gradient-to-r from-cricket-blue-dark to-cricket-blue transition-all duration-1000 shadow-blue-glow" 
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-white text-xs uppercase tracking-wider">{team2}</span>
                <span className="font-bold text-cricket-blue text-sm">{winProb.teamB_prob}%</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 bg-cricket-dark-1/80 border border-cricket-card-border p-3 rounded-xl leading-relaxed">
              {winProb.explanation}
            </p>
          </div>
        )}

      </div>

      {/* Qualcomm Edge AI Readiness Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Qualcomm Status Card */}
        <div className="premium-card lg:col-span-1 space-y-6 border-cricket-green/30 shadow-green-glow">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cricket-green/10 border border-cricket-green/20 text-cricket-green">
              <Zap className="w-5 h-5 glow-green" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Qualcomm Edge AI Readiness</h3>
              <p className="text-xs text-gray-400">On-device inference layer parameters</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-cricket-card-border/60 pb-2">
              <span className="text-xs text-gray-400 font-semibold uppercase">Edge Mode</span>
              <span className="text-xs font-bold text-cricket-green bg-cricket-green/15 border border-cricket-green/30 px-2 py-0.5 rounded">Enabled</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-cricket-card-border/60 pb-2">
              <span className="text-xs text-gray-400 font-semibold uppercase">Runtime</span>
              <span className="text-xs font-bold text-white uppercase">{edgeStatus?.onnx_runtime_active ? "ONNX Runtime" : "ONNX (Fallback Mode)"}</span>
            </div>

            <div className="flex items-center justify-between border-b border-cricket-card-border/60 pb-2">
              <span className="text-xs text-gray-400 font-semibold uppercase">Selected Provider</span>
              <span className="text-xs font-bold text-cricket-blue uppercase">{edgeStatus?.selected_execution_provider || "CPUExecutionProvider / Emulated"}</span>
            </div>

            <div className="flex items-center justify-between border-b border-cricket-card-border/60 pb-2">
              <span className="text-xs text-gray-400 font-semibold uppercase">Qualcomm AI Hub</span>
              <span className="text-xs font-bold text-gray-300">Optional Integration</span>
            </div>

            <div className="flex items-center justify-between border-b border-cricket-card-border/60 pb-2">
              <span className="text-xs text-gray-400 font-semibold uppercase">Latency Target</span>
              <span className="text-xs font-extrabold text-cricket-green glow-green">&lt;50 ms Local Analytics</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-semibold uppercase">Status</span>
              <span className="text-xs font-bold text-white bg-cricket-blue/15 border border-cricket-blue/30 px-2.5 py-0.5 rounded uppercase tracking-wider">Snapdragon-Ready</span>
            </div>
          </div>
        </div>

        {/* Qualcomm Explanation & Performance Card */}
        <div className="premium-card lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-xl text-white">Built for Edge Sports Intelligence</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              CricketIQ is designed with an edge-first AI layer. The current MVP uses lightweight mock inference, but the model interface is ONNX-ready and can later be optimized and profiled using Qualcomm AI Hub for Snapdragon-powered devices.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              By shifting calculations from distant clouds to the local Snapdragon Hexagon NPU, we bypass internet lag entirely. Fans receive immediate stats with absolute privacy, zero cloud subscription fees, and extreme power efficiency.
            </p>
          </div>

          {/* Performance Emulation Panel */}
          {edgePrediction && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-cricket-card-border/60">
              <div className="bg-cricket-dark-1/80 border border-cricket-card-border p-3.5 rounded-xl text-center">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Estimated NPU Latency</span>
                <span className="font-display font-black text-lg text-cricket-green glow-green">
                  {edgePrediction.edge_performance?.estimated_local_npu_latency_ms} ms
                </span>
              </div>
              <div className="bg-cricket-dark-1/80 border border-cricket-card-border p-3.5 rounded-xl text-center">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Cloud Overhead</span>
                <span className="font-display font-black text-lg text-white">
                  {edgePrediction.edge_performance?.cloud_roundtrip_latency_ms} ms (0.0 ms)
                </span>
              </div>
              <div className="bg-cricket-dark-1/80 border border-cricket-card-border p-3.5 rounded-xl text-center">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Power Saved</span>
                <span className="font-display font-black text-lg text-cricket-blue glow-blue">
                  {edgePrediction.edge_performance?.power_efficiency_saving}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Momentum Meter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Momentum Progress Bars */}
        <div className="premium-card flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cricket-green/10 border border-cricket-green/20">
              <Activity className="w-5 h-5 text-cricket-green" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Momentum Meter</h3>
              <p className="text-xs text-gray-400">Performance indicator based on last 5 overs</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Team 1 Momentum */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-300">
                <span>{team1}</span>
                <span className="text-cricket-green font-bold">{team1Momentum.momentum}%</span>
              </div>
              <div className="w-full bg-cricket-dark-1 border border-cricket-card-border h-4 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cricket-green/80 to-cricket-green rounded-full transition-all duration-1000 shadow-green-glow" 
                  style={{ width: `${team1Momentum.momentum}%` }}
                />
              </div>
            </div>

            {/* Team 2 Momentum */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-300">
                <span>{team2}</span>
                <span className="text-cricket-blue font-bold">{team2Momentum.momentum}%</span>
              </div>
              <div className="w-full bg-cricket-dark-1 border border-cricket-card-border h-4 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cricket-blue/80 to-cricket-blue rounded-full transition-all duration-1000 shadow-blue-glow" 
                  style={{ width: `${team2Momentum.momentum}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 bg-cricket-dark-1 border border-cricket-card-border p-3 rounded-xl leading-relaxed">
            <strong className="text-white block mb-1">Momentum Analysis:</strong>
            {team1Momentum.momentum >= team2Momentum.momentum ? team1Momentum.reason : team2Momentum.reason}
          </div>
        </div>

        {/* Turning Points Timeline */}
        <div className="premium-card lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cricket-blue/10 border border-cricket-blue/20">
              <Zap className="w-5 h-5 text-cricket-blue" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Match Turning Points</h3>
              <p className="text-xs text-gray-400">Critical events identified by our analytics formula</p>
            </div>
          </div>

          <div className="relative border-l border-cricket-card-border pl-6 ml-3 space-y-6">
            {turningPoints.length > 0 ? (
              turningPoints.map((tp, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 rounded-full bg-cricket-green shadow-green-glow border-2 border-cricket-dark-1" />
                  
                  <div className="bg-cricket-dark-1/50 border border-cricket-card-border p-3.5 rounded-xl space-y-1 hover:border-cricket-green/30 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display font-bold text-sm text-white">{tp.title}</h4>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        tp.impact === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {tp.impact} Impact
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{tp.description}</p>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block pt-1">
                      Inning {tp.inning} • Over {tp.over}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm py-4">No major turning points detected.</div>
            )}
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Runs Per Over Bar Chart */}
        <div className="premium-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Runs Per Over</h3>
              <p className="text-xs text-gray-400">Comparing over-by-over scoring frequency</p>
            </div>
            <BarChart2 className="w-5 h-5 text-cricket-green" />
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A1E" vertical={false} />
                <XAxis dataKey="over" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0E1A0E', borderColor: '#1E3A1E', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey={team1} fill="#00C851" radius={[4, 4, 0, 0]} />
                <Bar dataKey={team2} fill="#00B4FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wickets Timeline Line Chart */}
        <div className="premium-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Wickets Fall Intensity</h3>
              <p className="text-xs text-gray-400">Analyzing wicket-taking pressure spikes per over</p>
            </div>
            <Zap className="w-5 h-5 text-cricket-blue" />
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A1E" vertical={false} />
                <XAxis dataKey="over" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0E1A0E', borderColor: '#1E3A1E', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey={`${team1} Wkts`} stroke="#00C851" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey={`${team2} Wkts`} stroke="#00B4FF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
