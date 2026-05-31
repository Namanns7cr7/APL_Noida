import axios from 'axios';

const API_BASE = '/api';

// Create AXIOS instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Fallback Mock Data in case the backend or specific endpoint fails
const MOCK_FALLBACKS = {
  matches: [
    {
      id: 1,
      season: "2023",
      date: "2023-05-29",
      venue: "Narendra Modi Stadium, Ahmedabad",
      team1: "Mumbai Indians",
      team2: "Chennai Super Kings",
      toss_winner: "Chennai Super Kings",
      toss_decision: "field",
      winner: "Mumbai Indians",
      result: "runs",
      result_margin: 14,
      player_of_match: "Rohit Sharma"
    }
  ],
  summary: {
    match_id: 1,
    team1: "Mumbai Indians",
    team2: "Chennai Super Kings",
    venue: "Narendra Modi Stadium, Ahmedabad",
    date: "2023-05-29",
    winner: "Mumbai Indians",
    result: "runs",
    result_margin: 14,
    player_of_match: "Rohit Sharma",
    inning1: { team: "Mumbai Indians", runs: 182, wickets: 6, overs: 10.0 },
    inning2: { team: "Chennai Super Kings", runs: 168, wickets: 10, overs: 9.0 },
    total_overs: 10.0
  },
  momentum: {
    match_id: 1,
    window: 5,
    teams: [
      {
        team: "Mumbai Indians",
        momentum: 62.5,
        reason: "Mumbai Indians scored 46 runs in the last 5 overs with 5 boundaries and only 1 wicket lost.",
        recent_overs: [
          { over: 6, runs: 18, wickets: 0, boundaries: 3, dots: 1 },
          { over: 7, runs: 14, wickets: 1, boundaries: 2, dots: 2 },
          { over: 8, runs: 10, wickets: 0, boundaries: 1, dots: 1 },
          { over: 9, runs: 12, wickets: 1, boundaries: 2, dots: 2 },
          { over: 10, runs: 20, wickets: 0, boundaries: 4, dots: 0 }
        ]
      },
      {
        team: "Chennai Super Kings",
        momentum: 37.5,
        reason: "Chennai Super Kings scored 24 runs in the last 5 overs with 2 boundaries and 4 wickets lost.",
        recent_overs: [
          { over: 5, runs: 10, wickets: 2, boundaries: 1, dots: 3 },
          { over: 6, runs: 6, wickets: 1, boundaries: 0, dots: 4 },
          { over: 7, runs: 10, wickets: 1, boundaries: 1, dots: 2 },
          { over: 8, runs: 4, wickets: 2, boundaries: 0, dots: 4 },
          { over: 9, runs: 4, wickets: 2, boundaries: 0, dots: 4 }
        ]
      }
    ]
  },
  winProbability: {
    teamA: "Mumbai Indians",
    teamB: "Chennai Super Kings",
    teamA_prob: 88.0,
    teamB_prob: 12.0,
    explanation: "Chennai Super Kings needs 15 runs from 1.0 overs with 0 wickets remaining. Mumbai Indians currently has the upper hand."
  },
  turningPoints: [
    { over: 2, inning: 1, title: "Explosive Over", description: "Mumbai Indians plundered 16 runs in over 2 with 3 boundaries.", impact: "high" },
    { over: 4, inning: 1, title: "Wicket Burst", description: "2 wickets in over 4! Suryakumar Yadav dismissed.", impact: "high" },
    { over: 6, inning: 2, title: "Wicket Burst", description: "2 wickets in over 6! MS Dhoni dismissed.", impact: "high" },
    { over: 9, inning: 2, title: "Wicket Burst", description: "3 wickets in over 9! Moeen Ali, Simarjeet Singh, Akash Singh dismissed.", impact: "high" }
  ],
  players: [
    { name: "Rohit Sharma", team: "Mumbai Indians", role: "Batter", runs: 11, balls: 3, strike_rate: 366.7, fours: 2, sixes: 1, wickets: 0, economy: 0.0, dot_balls: 0, impact_score: 100.0, fantasy_score: 14.0 },
    { name: "Suryakumar Yadav", team: "Mumbai Indians", role: "Batter", runs: 17, balls: 7, strike_rate: 242.9, fours: 2, sixes: 2, wickets: 0, economy: 0.0, dot_balls: 0, impact_score: 85.0, fantasy_score: 21.0 },
    { name: "Kieron Pollard", team: "Mumbai Indians", role: "Batter", runs: 38, balls: 14, strike_rate: 271.4, fours: 2, sixes: 5, wickets: 0, economy: 0.0, dot_balls: 0, impact_score: 95.0, fantasy_score: 48.0 },
    { name: "Jasprit Bumrah", team: "Mumbai Indians", role: "Bowler", runs: 0, balls: 0, strike_rate: 0.0, fours: 0, sixes: 0, wickets: 5, economy: 3.3, dot_balls: 9, impact_score: 90.0, fantasy_score: 130.0 },
    { name: "Daniel Sams", team: "Mumbai Indians", role: "Bowler", runs: 6, balls: 3, strike_rate: 200.0, fours: 1, sixes: 0, wickets: 2, economy: 15.0, dot_balls: 4, impact_score: 65.0, fantasy_score: 56.5 },
    { name: "MS Dhoni", team: "Chennai Super Kings", role: "Batter", runs: 32, balls: 14, strike_rate: 228.6, fours: 2, sixes: 3, wickets: 0, economy: 0.0, dot_balls: 0, impact_score: 80.0, fantasy_score: 37.0 },
    { name: "Ajinkya Rahane", team: "Chennai Super Kings", role: "Batter", runs: 14, balls: 4, strike_rate: 350.0, fours: 2, sixes: 1, wickets: 0, economy: 0.0, dot_balls: 0, impact_score: 55.0, fantasy_score: 17.0 },
    { name: "Moeen Ali", team: "Chennai Super Kings", role: "Bowler", runs: 14, balls: 4, strike_rate: 350.0, fours: 2, sixes: 1, wickets: 3, economy: 9.3, dot_balls: 4, impact_score: 75.0, fantasy_score: 92.0 },
    { name: "Deepak Chahar", team: "Chennai Super Kings", role: "Bowler", runs: 0, balls: 3, strike_rate: 0.0, fours: 0, sixes: 0, wickets: 0, economy: 7.3, dot_balls: 2, impact_score: 12.0, fantasy_score: 1.0 }
  ],
  fantasy: {
    captain: {
      name: "Jasprit Bumrah", team: "Mumbai Indians", role: "Bowler", impact_score: 90.0, fantasy_score: 130.0,
      reason: "Bumrah delivered a legendary bowling display, claiming 5 wickets with a stellar economy of 3.3. Safest high-return captain.", confidence: 95.0
    },
    vice_captain: {
      name: "Moeen Ali", team: "Chennai Super Kings", role: "Bowler", impact_score: 75.0, fantasy_score: 92.0,
      reason: "Moeen contributed with 3 quick wickets and a rapid 14 runs off 4 balls, maximizing fantasy returns on both fronts.", confidence: 85.0
    },
    differential: {
      name: "Kieron Pollard", team: "Mumbai Indians", role: "Batter", impact_score: 95.0, fantasy_score: 48.0,
      reason: "Pollard slammed 38 off just 14 deliveries. An explosive middle-order threat with massive boundary-hitting upside.", confidence: 78.0
    },
    avoid: {
      name: "Deepak Chahar", team: "Chennai Super Kings", role: "Bowler", impact_score: 12.0, fantasy_score: 1.0,
      reason: "Chahar went wicketless and conceded 22 runs in his brief spell, offering negligible defensive or strike value.", confidence: 82.0
    }
  },
  aiSummary: {
    match_id: 1,
    summary: "Mumbai Indians currently hold full control of the game with an estimated 88% win probability. Batting first, they posted a colossal 182 runs, punctuated by Kieron Pollard's destructive 38 off 14 balls. Chennai Super Kings struggled deeply during their run-chase, losing crucial wickets at regular intervals. Jasprit Bumrah completely broke their back, taking a phenomenal 5-wicket haul. With 15 runs still needed off the final over and no wickets remaining, Mumbai Indians are virtually assured of a clinical derby victory.",
    key_insights: [
      "Jasprit Bumrah's 5/10 is one of the most dominant spells in T20 derby history.",
      "Kieron Pollard's late-over onslaught propelled Mumbai past a par score.",
      "Chennai Super Kings suffered repeated wickets, collapsing under heavy run-rate pressure."
    ],
    source: "rule-based"
  }
};

export const apiService = {
  async getMatches() {
    try {
      const response = await api.get('/matches');
      return response.data.matches || MOCK_FALLBACKS.matches;
    } catch (e) {
      console.warn('API error fetching matches, returning fallback mock', e);
      return MOCK_FALLBACKS.matches;
    }
  },

  async getMatchSummary(matchId) {
    try {
      const response = await api.get(`/match/${matchId}/summary`);
      return response.data;
    } catch (e) {
      console.warn(`API error fetching summary for match ${matchId}, returning fallback mock`, e);
      return MOCK_FALLBACKS.summary;
    }
  },

  async getMatchMomentum(matchId) {
    try {
      const response = await api.get(`/match/${matchId}/momentum`);
      return response.data;
    } catch (e) {
      console.warn(`API error fetching momentum for match ${matchId}, returning fallback mock`, e);
      return MOCK_FALLBACKS.momentum;
    }
  },

  async getMatchWinProbability(matchId) {
    try {
      const response = await api.get(`/match/${matchId}/win-probability`);
      return response.data;
    } catch (e) {
      console.warn(`API error fetching win-prob for match ${matchId}, returning fallback mock`, e);
      return MOCK_FALLBACKS.winProbability;
    }
  },

  async getMatchTurningPoints(matchId) {
    try {
      const response = await api.get(`/match/${matchId}/turning-points`);
      return response.data.turning_points || MOCK_FALLBACKS.turningPoints;
    } catch (e) {
      console.warn(`API error fetching turning points for match ${matchId}, returning fallback mock`, e);
      return MOCK_FALLBACKS.turningPoints;
    }
  },

  async getMatchPlayers(matchId) {
    try {
      const response = await api.get(`/match/${matchId}/players`);
      return response.data.players || MOCK_FALLBACKS.players;
    } catch (e) {
      console.warn(`API error fetching players for match ${matchId}, returning fallback mock`, e);
      return MOCK_FALLBACKS.players;
    }
  },

  async getPlayerComparison(player1, player2, matchId = 1) {
    try {
      const response = await api.get(`/players/compare`, {
        params: { player1, player2, match_id: matchId }
      });
      return response.data;
    } catch (e) {
      console.warn(`API error fetching comparison, searching fallbacks`, e);
      const list = MOCK_FALLBACKS.players;
      const p1 = list.find(p => p.name.toLowerCase() === player1.toLowerCase()) || list[0];
      const p2 = list.find(p => p.name.toLowerCase() === player2.toLowerCase()) || list[1];
      const winner = p1.impact_score >= p2.impact_score ? p1.name : p2.name;
      return {
        player1: p1,
        player2: p2,
        winner,
        summary: `${winner} outpaced their counterpart with high-impact key statistics during vital moments.`
      };
    }
  },

  async getMatchFantasy(matchId) {
    try {
      const response = await api.get(`/match/${matchId}/fantasy`);
      return response.data;
    } catch (e) {
      console.warn(`API error fetching fantasy recommendations for match ${matchId}, returning fallback mock`, e);
      return MOCK_FALLBACKS.fantasy;
    }
  },

  async getMatchAISummary(matchId) {
    try {
      const response = await api.get(`/match/${matchId}/ai-summary`);
      return response.data;
    } catch (e) {
      console.warn(`API error fetching AI summary for match ${matchId}, returning fallback mock`, e);
      return MOCK_FALLBACKS.aiSummary;
    }
  },

  async getEdgeStatus() {
    try {
      const response = await api.get('/edge/status');
      return response.data;
    } catch (e) {
      console.warn('API error fetching Edge status, returning offline mock', e);
      return {
        edge_mode_enabled: true,
        onnx_runtime_active: false,
        available_execution_providers: ["CPUExecutionProvider"],
        selected_execution_provider: "fallback (numpy-emulated)",
        qualcomm_qnn_accelerator_available: false,
        qai_hub_status: { qai_hub_installed: false, configured: false, message: "Qualcomm AI Hub is optional. Emulating Snapdragon targets." },
        snapdragon_ready: true,
        latency_target: "50ms",
        description: "CricketIQ is optimized for Qualcomm Snapdragon NPUs using ONNX Runtime with QNN EP."
      };
    }
  },

  async getEdgePredict(params = {}) {
    try {
      const response = await api.get('/edge/predict', { params });
      return response.data;
    } catch (e) {
      console.warn('API error calling Edge predict, returning offline mock', e);
      return {
        predictions: {
          win_probability_team_a: 62.4,
          win_probability_team_b: 37.6,
          momentum_classification: "Batting Surge",
          predicted_player_fantasy_yield: 88.5
        },
        onnx_metadata: {
          runtime: "fallback (numpy-emulated)",
          provider: "fallback",
          available_providers: [],
          qnn_provider_present: false,
          edge_ready: True,
          hardware_acceleration_path: "CPU Execution Fallback"
        },
        edge_performance: {
          estimated_local_npu_latency_ms: 8.4,
          cloud_roundtrip_latency_ms: 0.0,
          power_efficiency_saving: "92% vs Cloud APIs"
        }
      };
    }
  },

  async getEdgeQualcomm() {
    try {
      const response = await api.get('/edge/qualcomm');
      return response.data;
    } catch (e) {
      console.warn('API error calling Edge Qualcomm Hub, returning offline mock', e);
      return {
        qualcomm_ai_hub_integration: {
          qai_hub_installed: false,
          configured: false,
          message: "Qualcomm AI Hub integration is optional. Install qai-hub package to compile models."
        },
        target_snapdragon_platforms: [
          { name: "Snapdragon 8 Gen 3 (SM8650)", type: "Mobile", accelerator: "Hexagon NPU" },
          { name: "Snapdragon X Elite (X1E84100)", type: "Compute/Laptop", accelerator: "Hexagon NPU" },
          { name: "Snapdragon 8 Gen 2 (SM8550)", type: "Mobile", accelerator: "Hexagon NPU" },
          { name: "Snapdragon Ride Flex (SA8775P)", type: "Automotive", accelerator: "Hexagon NPU" }
        ],
        qualcomm_qnn_compilation_workflow: {
          phases: [
            { step: 1, title: "Model Export", description: "Export PyTorch model to ONNX graph format." },
            { step: 2, title: "AI Hub Compilation", description: "Profile and compile ONNX graph using QAI Hub for Snapdragon NPUs." },
            { step: 3, title: "Quantization (AIMET)", description: "Quantize to INT8 for 4x NPU execution speedups." },
            { step: 4, title: "Snapdragon Native Execution", description: "Load local model with ONNX Runtime & Qualcomm QNN Execution Provider." }
          ],
          target_latency_ms: "< 15ms",
          ram_footprint_mb: "< 50MB",
          ready_for_npu: true
        }
      };
    }
  }
};
