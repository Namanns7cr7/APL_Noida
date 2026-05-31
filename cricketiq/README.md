# CricketIQ: Cricket Data Into Fan Intelligence 🏏💡

> **Qualcomm Snapdragon NPU Ready • Local Edge AI Inference Engine**

CricketIQ is a premium sports analytics platform designed to solve a major problem: **cricket generates massive amounts of data (ball-by-ball actions, player stats, historical swings), but most fans struggle to interpret and extract actionable meaning from it.** 

CricketIQ turns raw datasets into engaging momentum shifts, head-to-head player comparisons, explained win probabilities, visual timelines, and actionable fantasy advice.

---

## ⚡ Qualcomm / Edge AI Positioning & Pitch

Most cricket platforms are cloud-bound scoreboards. **CricketIQ is designed as an edge-ready, local-first fan intelligence engine.** It converts ball-by-ball data into momentum, fantasy guidance, and match predictions using lightweight analytics that run 100% locally and can later be optimized for Qualcomm Snapdragon devices through ONNX Runtime and Qualcomm AI Hub.

### 🌟 Qualcomm Tech Capabilities:
1. **Lightweight & Cloud-Optional:** Employs an ultra-fast, local numpy-based prediction layer to guarantee zero cloud dependencies, offline readiness, and massive energy savings.
2. **ONNX-Ready Model Architecture:** Fully integrates `onnxruntime` with prioritization for the **Qualcomm QNN Execution Provider** to target Snapdragon Hexagon NPUs.
3. **Qualcomm AI Hub Deployment Path:** Optional compilation support for `qai-hub` to seamlessly profile, quantize (using AIMET to INT8), and validate models across physical Snapdragon chips (e.g. Snapdragon 8 Gen 3, Snapdragon X Elite).
4. **NPU-Ready Acceleration:** If QNN EP is missing, the engine gracefully falls back to CPU execution while retaining a fully compatible Snapdragon compilation pipeline for future deployment.

---

## 🚀 Key Features

1. **Match Intelligence Dashboard**
   - **Momentum Meter:** A rolling 5-over metric highlighting momentum spikes.
   - **Win Probability:** Dynamic simulation based on target chases, wickets, and run rates.
   - **AI Match Story:** Situational match summaries powered by Google Gemini (with local fallback rules).
   - **Turning Points:** Automated triggers identifying wickets bursts, boundaries, and half-centuries.
   - **Qualcomm Edge AI Card:** Interactive diagnostics depicting local latency targets, NPU acceleration status, and active ONNX providers.

2. **Player Head-to-Head Lab**
   - Interactive dropdown matching any two active players.
   - Side-by-side batting efficiency and defensive bowling indicators.
   - Unique **Player Impact Score** formula determining absolute tactical values.

3. **Fantasy Team Assistant**
   - High-confidence **Captain** and **Vice-Captain** picks with analytical justifications.
   - High-yield **Differential Picks** for hidden roster advantages.
   - Clear **Avoid Recommendations** based on low ROI indicators.

---

## 🔌 API Documentation

### Core Analytics Endpoints
| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | GET | Check API server state & active dataset source. |
| `/api/matches` | GET | Retrieve list of all matches in database. |
| `/api/match/{match_id}/summary` | GET | Returns scores, wickets, overs, POM, and venue meta. |
| `/api/match/{match_id}/momentum` | GET | Rolling 5-over momentum percentages. |
| `/api/match/{match_id}/win-probability` | GET | Returns win probability percentages for both teams. |
| `/api/match/{match_id}/turning-points` | GET | Returns high/medium impact match turning points. |
| `/api/match/{match_id}/players` | GET | Lists roster performance statistics and Impact scores. |
| `/api/players/compare` | GET | Head-to-head comparison parameters between two players. |
| `/api/match/{match_id}/fantasy` | GET | Roster selection recommendations and reasons. |
| `/api/match/{match_id}/ai-summary` | GET | Flowing natural prose summarizing the match situation. |

### Qualcomm Edge AI Endpoints
| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/edge/status` | GET | ONNX Runtime configuration, QNN EP readiness state, and NPU availability. |
| `/api/edge/predict` | GET | Emulated Snapdragon NPU prediction outputs for win probability, momentum class, and fantasy scores. |
| `/api/edge/qualcomm` | GET | Qualcomm AI Hub Snapdragon compile target profile and device availability. |

---

## 📊 Dataset Integration (Local-First Mock Mode)

CricketIQ works instantly out of the box using a high-fidelity bundled JSON dataset in `backend/data/sample_match.json`. This guarantees **100% demo uptime** and requires:
* **No external live cricket APIs**
* **No Kaggle API setups**
* **No paid cloud subscriptions**

---

## 🏁 How to Run

### 1. Launch Backend API
```bash
cd backend
# Install Python dependencies
pip install -r requirements.txt

# Start local server on Port 8000
uvicorn app.main:app --reload
```

### 2. Launch Frontend Dev Server
```bash
cd frontend
# Install npm packages
npm install

# Start Vite React server on Port 3000
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 📦 Optional Qualcomm Integrations

Install the target libraries to enable live environment checks (works on all laptop architectures; will gracefully fall back if Hexagon NPU is absent):

```bash
# ONNX Runtime support
pip install onnxruntime

# Qualcomm AI Hub API client
pip install qai-hub
```

---

## 🎭 Interactive Hackathon Demo Flow

1. **The Entrance:** Open the landing page. Highlight the **"Built for Edge Sports Intelligence"** section. Pitch that CricketIQ is cloud-optional, low-latency, and Snapdragon NPU optimized.
2. **Click "Analyze Match":** The system loads local mock database stats. Show the judges the rolling momentum meters and the explainable win probability calculations.
3. **Point out the "Qualcomm Edge AI Readiness" Card:** Show that **Edge Mode is Enabled**. Point out that the engine prioritizes the **Qualcomm QNN Execution Provider** for Snapdragon chips, with automatic local fallback to CPU execution so the demo is 100% robust. Highlight local latency estimates (e.g. `8.4 ms` vs `~200ms` cloud API roundtrips).
4. **Compare Players:** Select Rohit Sharma vs Jasprit Bumrah. Highlight their relative impact scores.
5. **Unlock Fantasy Strategy:** Toggle to the Fantasy tab. Highlight the AI recommended Captain, Vice-Captain, Differential, and Avoid picks with detailed sports logic explanations.
