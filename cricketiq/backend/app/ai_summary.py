"""
AI / Rule-based match summary generator.
Uses Google Gemini if GEMINI_API_KEY is set, else falls back to rule-based text.
"""

import os
import logging
import json
from typing import List

logger = logging.getLogger(__name__)


def _rule_based_summary(metrics: dict) -> str:
    """Generate a fan-friendly match summary without LLM."""
    team_a = metrics.get("teamA", "Team A")
    team_b = metrics.get("teamB", "Team B")
    team_a_prob = metrics.get("teamA_prob", 50)
    team_b_prob = metrics.get("teamB_prob", 50)
    leading_team = team_a if team_a_prob >= team_b_prob else team_b
    trailing_team = team_b if leading_team == team_a else team_a
    leading_prob = max(team_a_prob, team_b_prob)

    momentum_team = metrics.get("momentum_team", leading_team)
    momentum_pct = metrics.get("momentum_pct", leading_prob)
    momentum_reason = metrics.get("momentum_reason", "strong recent overs")

    runs_a = metrics.get("inning1_runs", 0)
    wickets_a = metrics.get("inning1_wickets", 0)
    runs_b = metrics.get("inning2_runs", 0)
    wickets_b = metrics.get("inning2_wickets", 0)

    lines = []

    if runs_b > 0:
        target = runs_a + 1
        needed = target - runs_b
        lines.append(
            f"{team_b} are chasing a target of {target}, "
            f"currently at {runs_b}/{wickets_b} with {max(needed,0)} still needed."
        )
    else:
        lines.append(
            f"{team_a} posted {runs_a}/{wickets_a} in their innings — "
            f"{'a commanding total' if runs_a > 170 else 'a competitive score' if runs_a > 150 else 'a gettable target'}."
        )

    lines.append(
        f"{leading_team} currently controls the game with {leading_prob:.0f}% win probability, "
        f"driven by {momentum_reason}."
    )

    if momentum_pct > 65:
        lines.append(
            f"The momentum clearly belongs to {momentum_team} — "
            f"their recent overs have been clinical and they look well-set to win."
        )
    else:
        lines.append(
            f"This match is finely poised. Both teams still have a realistic shot at victory."
        )

    if runs_b > 0 and wickets_b > 0:
        lines.append(
            f"{trailing_team} need quick partnerships and smart batting "
            f"to overcome the {leading_prob:.0f}% deficit they currently face."
        )
    else:
        lines.append(
            f"{trailing_team} must take early wickets and dry up the boundaries "
            f"if they want to claw back into this contest."
        )

    lines.append(
        "CricketIQ's intelligence suggests the key battleground will be "
        "the middle overs — wickets here could completely flip the match."
    )

    return " ".join(lines)


def _rule_based_insights(metrics: dict) -> List[str]:
    insights = []
    team_a = metrics.get("teamA", "Team A")
    team_b = metrics.get("teamB", "Team B")
    team_a_prob = metrics.get("teamA_prob", 50)

    if team_a_prob > 60:
        insights.append(f"{team_a} hold the advantage — their bowling attack looks lethal today.")
    elif team_a_prob < 40:
        insights.append(f"{team_b} are in cruise control and look set for victory.")
    else:
        insights.append("The match is on a knife's edge — anything can happen!")

    runs_a = metrics.get("inning1_runs", 0)
    if runs_a > 180:
        insights.append(f"A total of {runs_a} is massive in T20 cricket. {team_a} batted out of their skins!")
    elif runs_a < 140:
        insights.append(f"{runs_a} is below-par — the pitch might be tricky for batting.")

    momentum_pct = metrics.get("momentum_pct", 50)
    if momentum_pct > 70:
        insights.append("The momentum shift in the last 5 overs has been dramatic.")
    else:
        insights.append("Both teams have traded punches — form is evenly spread.")

    insights.append("Watch the powerplay and death overs — those 10 overs define the match.")
    return insights[:4]


async def generate_ai_summary(metrics: dict) -> dict:
    """
    Try Gemini API first. Fall back to rule-based text if not available.
    """
    gemini_key = os.getenv("GEMINI_API_KEY", "")

    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")

            prompt = f"""You are CricketIQ, a cricket analytics AI.
Based on these match metrics, write a 4-6 sentence fan-friendly match summary in plain English.
Focus on momentum, key turning points, and what fans should watch for next.
Do NOT use bullet points. Write as flowing prose.

Metrics:
{json.dumps(metrics, indent=2)}

Summary:"""

            response = await model.generate_content_async(prompt)
            summary = response.text.strip()
            insights = _rule_based_insights(metrics)

            return {
                "match_id": metrics.get("match_id", 0),
                "summary": summary,
                "key_insights": insights,
                "source": "gemini",
            }
        except Exception as e:
            logger.warning(f"Gemini API failed: {e}. Using rule-based fallback.")

    # Fallback
    return {
        "match_id": metrics.get("match_id", 0),
        "summary": _rule_based_summary(metrics),
        "key_insights": _rule_based_insights(metrics),
        "source": "rule-based",
    }
