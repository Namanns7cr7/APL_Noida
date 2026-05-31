"""
CricketEdgePredictor — Edge AI simulation for local on-device inference.
Emulates machine learning model outputs locally without cloud dependencies.
"""

import numpy as np

class CricketEdgePredictor:
    def __init__(self):
        pass

    def predict_win_probability(self, features: dict) -> float:
        """
        Predicts win probability (0.0 to 1.0) using a lightweight edge regression emulation.
        Features expected:
            - momentum (0 to 100)
            - wickets_remaining (0 to 10)
            - run_rate (float)
            - required_rate (float)
            - recent_boundaries (int)
        """
        # Read features with default values
        momentum = float(features.get("momentum", 50.0))
        wickets_remaining = float(features.get("wickets_remaining", 5.0))
        run_rate = float(features.get("run_rate", 7.5))
        required_rate = float(features.get("required_rate", 8.0))
        recent_boundaries = float(features.get("recent_boundaries", 2.0))

        # Core emulation logic
        base = 0.50
        
        # Momentum contribution: max weight +/- 0.15
        momentum_factor = (momentum - 50.0) / 100.0 * 0.30
        
        # Wickets remaining: each wicket above 5 adds 0.04, below subtracts 0.04
        wickets_factor = (wickets_remaining - 5.0) * 0.04
        
        # Run rate difference: max weight +/- 0.20
        rate_diff = run_rate - required_rate
        rate_factor = np.clip(rate_diff * 0.03, -0.20, 0.20)
        
        # Recent boundary acceleration
        boundary_factor = min(recent_boundaries * 0.02, 0.10)

        # Combine inputs linearly (like a lightweight neural network or logistic regression)
        probability = base + momentum_factor + wickets_factor + rate_factor + boundary_factor
        
        # Clamp output
        return float(np.clip(probability, 0.05, 0.95))

    def predict_fantasy_score(self, player_features: dict) -> float:
        """
        Predicts expected fantasy performance score (0 to 100) on device.
        Features expected:
            - recent_runs (int)
            - strike_rate (float)
            - recent_wickets (int)
            - economy (float)
            - dot_ball_ratio (float)
        """
        runs = float(player_features.get("recent_runs", 0))
        sr = float(player_features.get("strike_rate", 100.0))
        wickets = float(player_features.get("recent_wickets", 0))
        economy = float(player_features.get("economy", 8.0))
        dot_ratio = float(player_features.get("dot_ball_ratio", 0.30))

        # Batting components
        bat_score = runs * 0.8 + (sr / 150.0) * 15.0
        
        # Bowling components
        bowl_score = wickets * 20.0 + (dot_ratio * 15.0) - max((economy - 6.0) * 2.0, 0.0)

        total_predicted = max(bat_score, 0.0) + max(bowl_score, 0.0)
        return float(np.clip(total_predicted, 0.0, 100.0))

    def predict_momentum_class(self, features: dict) -> str:
        """
        Classifies current game momentum state.
        """
        momentum = float(features.get("momentum", 50.0))
        wickets_lost_recently = int(features.get("wickets_lost_recently", 0))
        runs_scored_recently = int(features.get("runs_scored_recently", 0))

        if wickets_lost_recently >= 2:
            return "Collapse Risk"
        elif runs_scored_recently >= 15 and momentum > 60:
            return "Batting Surge"
        elif wickets_lost_recently == 1 and runs_scored_recently <= 5:
            return "Bowling Comeback"
        else:
            return "Balanced"
