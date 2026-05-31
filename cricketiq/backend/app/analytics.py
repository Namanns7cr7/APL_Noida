"""
CricketIQ Analytics Engine
All cricket intelligence formulas: momentum, impact, win probability, turning points, fantasy.
"""

import logging
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
#  MATCH SUMMARY
# ─────────────────────────────────────────────

def compute_match_summary(match_info: dict, deliveries: pd.DataFrame) -> dict:
    teams = {}
    for inning in [1, 2]:
        inn_df = deliveries[deliveries["inning"] == inning]
        if inn_df.empty:
            continue
        team = inn_df["batting_team"].iloc[0]
        runs = int(inn_df["total_runs"].sum())
        wickets = int(inn_df["is_wicket"].sum())
        max_over = int(inn_df["over"].max()) + 1
        last_ball = inn_df[inn_df["over"] == inn_df["over"].max()]["ball"].max()
        overs = round(max_over - 1 + last_ball / 6, 1)
        teams[inning] = {"team": team, "runs": runs, "wickets": wickets, "overs": overs}

    inning1 = teams.get(1, {"team": match_info.get("team1", "Team A"), "runs": 0, "wickets": 0, "overs": 0.0})
    inning2 = teams.get(2, None)

    return {
        "match_id": match_info.get("id", match_info.get("match_id", 0)),
        "team1": match_info.get("team1", inning1["team"]),
        "team2": match_info.get("team2", inning2["team"] if inning2 else "Team B"),
        "venue": match_info.get("venue", "Unknown Venue"),
        "date": str(match_info.get("date", "Unknown Date")),
        "winner": match_info.get("winner"),
        "result": match_info.get("result"),
        "result_margin": match_info.get("result_margin"),
        "player_of_match": match_info.get("player_of_match"),
        "inning1": inning1,
        "inning2": inning2,
        "total_overs": inning1["overs"],
    }


# ─────────────────────────────────────────────
#  MOMENTUM
# ─────────────────────────────────────────────

def _over_stats(over_df: pd.DataFrame) -> dict:
    runs = int(over_df["total_runs"].sum())
    wickets = int(over_df["is_wicket"].sum())
    boundaries = int(((over_df["batsman_runs"] == 4) | (over_df["batsman_runs"] == 6)).sum())
    dots = int((over_df["batsman_runs"] == 0).sum())
    return {"runs": runs, "wickets": wickets, "boundaries": boundaries, "dots": dots}


def compute_momentum(deliveries: pd.DataFrame, window: int = 5) -> List[dict]:
    results = []
    for inning in [1, 2]:
        inn_df = deliveries[deliveries["inning"] == inning]
        if inn_df.empty:
            continue
        team = inn_df["batting_team"].iloc[0]
        max_over = int(inn_df["over"].max())
        recent_overs = range(max(0, max_over - window + 1), max_over + 1)

        recent_df = inn_df[inn_df["over"].isin(recent_overs)]
        stats = _over_stats(recent_df)

        raw_score = (
            stats["runs"] * 2
            + stats["boundaries"] * 5
            - stats["wickets"] * 15
            - stats["dots"] * 2
        )

        over_data = []
        for ov in sorted(inn_df["over"].unique()):
            ov_df = inn_df[inn_df["over"] == ov]
            s = _over_stats(ov_df)
            over_data.append({"over": int(ov) + 1, **s})

        reason = (
            f"{team} scored {stats['runs']} runs in the last {len(list(recent_overs))} overs "
            f"with {stats['boundaries']} boundaries and {stats['wickets']} wicket(s) lost."
        )
        results.append({
            "team": team,
            "raw_score": raw_score,
            "stats": stats,
            "reason": reason,
            "recent_overs": over_data,
        })

    # Normalise to percentages
    if len(results) == 2:
        s0 = max(results[0]["raw_score"], 1)
        s1 = max(results[1]["raw_score"], 1)
        total = s0 + s1
        results[0]["momentum"] = round(s0 / total * 100, 1)
        results[1]["momentum"] = round(s1 / total * 100, 1)
    elif results:
        results[0]["momentum"] = 65.0

    return results


# ─────────────────────────────────────────────
#  PLAYER IMPACT SCORES
# ─────────────────────────────────────────────

def _compute_player_stats(deliveries: pd.DataFrame) -> List[dict]:
    players = {}

    def get_or_create(name: str, team: str, role: str):
        if name not in players:
            players[name] = {
                "name": name, "team": team, "role": role,
                "runs": 0, "balls": 0, "fours": 0, "sixes": 0,
                "wickets": 0, "balls_bowled": 0, "runs_conceded": 0, "dot_balls": 0,
            }
        return players[name]

    for _, row in deliveries.iterrows():
        batter = str(row.get("batter", ""))
        bat_team = str(row.get("batting_team", ""))
        bowl_team = str(row.get("bowling_team", ""))
        bowler = str(row.get("bowler", ""))

        if batter:
            p = get_or_create(batter, bat_team, "Batter")
            p["runs"] += int(row.get("batsman_runs", 0))
            p["balls"] += 1
            runs = int(row.get("batsman_runs", 0))
            if runs == 4:
                p["fours"] += 1
            if runs == 6:
                p["sixes"] += 1

        if bowler:
            p = get_or_create(bowler, bowl_team, "Bowler")
            p["balls_bowled"] += 1
            p["runs_conceded"] += int(row.get("total_runs", 0))
            if int(row.get("is_wicket", 0)) == 1:
                dismissal = str(row.get("dismissal_kind", "")).lower()
                if dismissal not in ["run out", "retired hurt", ""]:
                    p["wickets"] += 1
                    p["role"] = "Bowler"
            if int(row.get("batsman_runs", 0)) == 0 and int(row.get("extras", 0)) == 0:
                p["dot_balls"] += 1

    result = []
    for name, s in players.items():
        strike_rate = round(s["runs"] / s["balls"] * 100, 1) if s["balls"] > 0 else 0
        overs_bowled = s["balls_bowled"] / 6
        economy = round(s["runs_conceded"] / overs_bowled, 2) if overs_bowled > 0 else 0

        bat_impact = s["runs"] + strike_rate / 2 + s["fours"] * 4 + s["sixes"] * 8
        bowl_impact = s["wickets"] * 25 + s["dot_balls"] * 2 - economy * 3

        if s["wickets"] > 0 and s["balls_bowled"] > s["balls"]:
            role = "Bowler"
            raw_impact = bowl_impact
        elif s["runs"] > 0:
            role = "Batter"
            raw_impact = bat_impact
        else:
            role = s["role"]
            raw_impact = bat_impact + bowl_impact

        fantasy_score = (
            s["runs"] * 1
            + s["fours"] * 1
            + s["sixes"] * 2
            + s["wickets"] * 25
            + s["dot_balls"] * 0.5
            + (25 if s["runs"] >= 50 else 0)
            + (50 if s["runs"] >= 100 else 0)
        )

        result.append({
            "name": name,
            "team": s["team"],
            "role": role,
            "runs": s["runs"],
            "balls": s["balls"],
            "strike_rate": strike_rate,
            "fours": s["fours"],
            "sixes": s["sixes"],
            "wickets": s["wickets"],
            "economy": economy,
            "dot_balls": s["dot_balls"],
            "impact_score": round(max(raw_impact, 0), 1),
            "fantasy_score": round(fantasy_score, 1),
        })

    # Normalise impact_score to 0–100
    if result:
        max_impact = max(p["impact_score"] for p in result) or 1
        for p in result:
            p["impact_score"] = round(p["impact_score"] / max_impact * 100, 1)

    return sorted(result, key=lambda x: x["fantasy_score"], reverse=True)


def get_players(deliveries: pd.DataFrame) -> List[dict]:
    return _compute_player_stats(deliveries)


# ─────────────────────────────────────────────
#  WIN PROBABILITY
# ─────────────────────────────────────────────

def compute_win_probability(deliveries: pd.DataFrame, match_info: dict) -> dict:
    teams = {}
    for inning in [1, 2]:
        inn_df = deliveries[deliveries["inning"] == inning]
        if inn_df.empty:
            continue
        teams[inning] = inn_df

    team_a = match_info.get("team1", "Team A")
    team_b = match_info.get("team2", "Team B")

    if 1 not in teams:
        return {
            "teamA": team_a, "teamB": team_b,
            "teamA_prob": 50.0, "teamB_prob": 50.0,
            "explanation": "Match data is incomplete. Probability set to 50/50.",
        }

    inn1 = teams[1]
    inning1_runs = int(inn1["total_runs"].sum())
    inning1_wickets = int(inn1["is_wicket"].sum())
    total_overs = int(inn1["over"].max()) + 1

    if 2 not in teams:
        # Only inning 1 data
        crr = inning1_runs / max(total_overs, 1)
        momentum_adj = 5 if crr > 9 else (-5 if crr < 7 else 0)
        wickets_adj = -inning1_wickets * 2
        prob_a = max(5, min(95, 50 + momentum_adj + wickets_adj))
        return {
            "teamA": team_a, "teamB": team_b,
            "teamA_prob": round(prob_a, 1),
            "teamB_prob": round(100 - prob_a, 1),
            "explanation": (
                f"{team_a} scored {inning1_runs} runs at {crr:.1f} RPO "
                f"with {inning1_wickets} wickets down. "
                f"Win probability is estimated based on first innings performance."
            ),
        }

    inn2 = teams[2]
    inn2_runs = int(inn2["total_runs"].sum())
    inn2_wickets = int(inn2["is_wicket"].sum())
    max_over2 = int(inn2["over"].max())
    balls_faced2 = len(inn2)

    target = inning1_runs + 1
    runs_needed = target - inn2_runs
    wickets_remaining = 10 - inn2_wickets
    overs_remaining = total_overs - max_over2 - 1

    if runs_needed <= 0:
        prob_b = 92.0
    elif overs_remaining <= 0 or wickets_remaining <= 0:
        prob_b = 8.0
    else:
        rrr = runs_needed / max(overs_remaining, 0.1)
        crr2 = inn2_runs / max(max_over2 + 1, 1)
        rrr_adj = (crr2 - rrr) * 5
        wkt_adj = (wickets_remaining - 5) * 3
        prob_b = max(5, min(95, 50 + rrr_adj + wkt_adj))

    prob_a = 100 - prob_b
    winner_hint = match_info.get("winner", "")

    if winner_hint == team_a:
        prob_a = max(prob_a, 60)
        prob_b = 100 - prob_a
    elif winner_hint == team_b:
        prob_b = max(prob_b, 60)
        prob_a = 100 - prob_b

    explanation = (
        f"{team_b} needs {max(runs_needed,0)} runs from {max(overs_remaining,0):.0f} overs "
        f"with {wickets_remaining} wickets remaining. "
        f"Required run rate: {max(runs_needed,0)/max(overs_remaining,0.1):.1f}. "
        f"{team_a if prob_a > prob_b else team_b} currently has the upper hand."
    )

    return {
        "teamA": team_a, "teamB": team_b,
        "teamA_prob": round(prob_a, 1),
        "teamB_prob": round(prob_b, 1),
        "explanation": explanation,
    }


# ─────────────────────────────────────────────
#  TURNING POINTS
# ─────────────────────────────────────────────

def compute_turning_points(deliveries: pd.DataFrame) -> List[dict]:
    turning_points = []

    for inning in [1, 2]:
        inn_df = deliveries[deliveries["inning"] == inning]
        if inn_df.empty:
            continue
        team = inn_df["batting_team"].iloc[0]

        for ov in sorted(inn_df["over"].unique()):
            ov_df = inn_df[inn_df["over"] == ov]
            runs = int(ov_df["total_runs"].sum())
            wickets = int(ov_df["is_wicket"].sum())
            boundaries = int(((ov_df["batsman_runs"] == 4) | (ov_df["batsman_runs"] == 6)).sum())
            sixes = int((ov_df["batsman_runs"] == 6).sum())

            over_display = int(ov) + 1

            if runs >= 15:
                turning_points.append({
                    "over": over_display,
                    "inning": inning,
                    "title": "Explosive Over",
                    "description": f"{team} plundered {runs} runs in over {over_display} with {boundaries} boundaries.",
                    "impact": "high",
                })

            if wickets >= 2:
                dismissed = ov_df[ov_df["is_wicket"] == 1]["player_dismissed"].dropna().tolist()
                names = ", ".join(str(d) for d in dismissed[:2])
                turning_points.append({
                    "over": over_display,
                    "inning": inning,
                    "title": "Wicket Burst",
                    "description": f"{wickets} wickets in over {over_display}! {names} dismissed.",
                    "impact": "high",
                })

            if sixes >= 2:
                turning_points.append({
                    "over": over_display,
                    "inning": inning,
                    "title": "Six Assault",
                    "description": f"{sixes} sixes in over {over_display} — crowd goes wild!",
                    "impact": "medium",
                })

        # Detect milestones (50s, 100s)
        batter_runs = inn_df.groupby("batter")["batsman_runs"].sum()
        for batter, runs in batter_runs.items():
            if runs >= 50:
                label = "Century!" if runs >= 100 else "Half-Century!"
                batter_df = inn_df[inn_df["batter"] == batter]
                over_reached = int(batter_df.iloc[-1]["over"]) + 1
                turning_points.append({
                    "over": over_reached,
                    "inning": inning,
                    "title": label,
                    "description": f"{batter} reached {runs} runs — a match-defining knock!",
                    "impact": "high" if runs >= 100 else "medium",
                })

    # Sort by over and remove duplicates
    seen = set()
    unique_tps = []
    for tp in sorted(turning_points, key=lambda x: (x["inning"], x["over"])):
        key = (tp["over"], tp["inning"], tp["title"])
        if key not in seen:
            seen.add(key)
            unique_tps.append(tp)

    return unique_tps[:10]


# ─────────────────────────────────────────────
#  FANTASY ASSISTANT
# ─────────────────────────────────────────────

def compute_fantasy(deliveries: pd.DataFrame, match_info: dict) -> dict:
    players = _compute_player_stats(deliveries)
    if not players:
        return _mock_fantasy(match_info)

    # Sort by fantasy_score
    sorted_players = sorted(players, key=lambda x: x["fantasy_score"], reverse=True)

    # Captain: highest fantasy score
    captain = sorted_players[0]

    # Vice Captain: second highest with reasonable involvement
    vice_captain = sorted_players[1] if len(sorted_players) > 1 else captain

    # Differential: good contributor who might be overlooked (not top 3 in impact but high recent contribution)
    differential = None
    for p in sorted_players[3:]:
        if p["fantasy_score"] >= 20 and p["impact_score"] >= 30:
            differential = p
            break
    if not differential and len(sorted_players) > 2:
        differential = sorted_players[2]

    # Avoid: lowest fantasy score with enough balls/overs
    avoid = None
    for p in reversed(sorted_players):
        if p["balls"] >= 5 or p["economy"] > 0:
            avoid = p
            break
    if not avoid:
        avoid = sorted_players[-1]

    def make_pick(p: dict, reason: str, conf: float) -> dict:
        return {
            "name": p["name"],
            "team": p["team"],
            "role": p["role"],
            "impact_score": p["impact_score"],
            "fantasy_score": p["fantasy_score"],
            "reason": reason,
            "confidence": conf,
        }

    crr = captain["runs"]
    return {
        "captain": make_pick(
            captain,
            f"{captain['name']} leads with {captain['runs']} runs "
            f"(SR {captain['strike_rate']}) and {captain['wickets']} wickets. "
            f"Fantasy score: {captain['fantasy_score']} — safe captain choice.",
            min(95, 60 + captain["impact_score"] * 0.35),
        ),
        "vice_captain": make_pick(
            vice_captain,
            f"{vice_captain['name']} is the reliable second option with "
            f"{vice_captain['runs']} runs and {vice_captain['wickets']} wickets.",
            min(90, 55 + vice_captain["impact_score"] * 0.3),
        ),
        "differential": make_pick(
            differential,
            f"{differential['name']} is an underrated pick with solid contribution "
            f"({differential['runs']} runs, {differential['wickets']} wickets) "
            f"that many fantasy managers may overlook.",
            min(75, 40 + differential["impact_score"] * 0.3),
        ),
        "avoid": make_pick(
            avoid,
            f"{avoid['name']} had limited impact — "
            f"{avoid['runs']} runs from {avoid['balls']} balls "
            f"(SR {avoid['strike_rate']}) and economy {avoid['economy']}. "
            f"Low ROI for fantasy points.",
            min(80, 50 + (100 - avoid["impact_score"]) * 0.3),
        ),
        "match_id": match_info.get("id", match_info.get("match_id", 0)),
    }


def _mock_fantasy(match_info: dict) -> dict:
    return {
        "captain": {
            "name": "Rohit Sharma", "team": "Mumbai Indians", "role": "Batter",
            "impact_score": 92.5, "fantasy_score": 87.0,
            "reason": "Rohit scored 47 runs with a strike rate of 158. Dominant opener choice.",
            "confidence": 88.0,
        },
        "vice_captain": {
            "name": "Jasprit Bumrah", "team": "Mumbai Indians", "role": "Bowler",
            "impact_score": 85.0, "fantasy_score": 78.5,
            "reason": "Bumrah picked 3 wickets with an economy of 5.2. Elite bowling performance.",
            "confidence": 82.0,
        },
        "differential": {
            "name": "Tilak Varma", "team": "Mumbai Indians", "role": "Batter",
            "impact_score": 62.0, "fantasy_score": 55.0,
            "reason": "Tilak Varma's 28-ball 34 is often overlooked. Solid differential pick.",
            "confidence": 65.0,
        },
        "avoid": {
            "name": "Deepak Chahar", "team": "Chennai Super Kings", "role": "Bowler",
            "impact_score": 18.0, "fantasy_score": 12.0,
            "reason": "Deepak conceded 42 runs in 4 overs with no wickets. Expensive and ineffective.",
            "confidence": 70.0,
        },
        "match_id": match_info.get("id", match_info.get("match_id", 0)),
    }


# ─────────────────────────────────────────────
#  PLAYER COMPARISON
# ─────────────────────────────────────────────

def compare_players(player1_name: str, player2_name: str, all_players: List[dict]) -> Optional[dict]:
    p1 = next((p for p in all_players if p["name"].lower() == player1_name.lower()), None)
    p2 = next((p for p in all_players if p["name"].lower() == player2_name.lower()), None)
    if not p1 or not p2:
        return None

    winner = p1["name"] if p1["impact_score"] >= p2["impact_score"] else p2["name"]
    summary = (
        f"{winner} outperformed with an impact score of "
        f"{max(p1['impact_score'], p2['impact_score']):.1f} vs "
        f"{min(p1['impact_score'], p2['impact_score']):.1f}."
    )
    return {"player1": p1, "player2": p2, "winner": winner, "summary": summary}
