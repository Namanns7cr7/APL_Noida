"""
Data loader for CricketIQ.
Tries to load Kaggle dataset first, falls back to sample mock data.
Handles flexible column name mapping across different dataset versions.
"""

import os
import json
import logging
from pathlib import Path
from typing import Optional, Tuple

import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)

# Column name alternatives for flexible parsing
COLUMN_MAPPINGS = {
    "match_id": ["match_id", "id", "match_key", "matchid"],
    "inning": ["inning", "innings", "inn"],
    "batting_team": ["batting_team", "bat_team", "batting"],
    "bowling_team": ["bowling_team", "bowl_team", "bowling"],
    "over": ["over", "overs", "over_id"],
    "ball": ["ball", "ball_number", "delivery"],
    "batter": ["batter", "batsman", "striker", "bat"],
    "bowler": ["bowler", "bowl"],
    "non_striker": ["non_striker", "non_facing"],
    "batsman_runs": ["batsman_runs", "runs_off_bat", "bat_runs", "runs"],
    "total_runs": ["total_runs", "runs_total", "total", "run_total"],
    "extras": ["extras", "extra_runs"],
    "is_wicket": ["is_wicket", "wicket", "player_dismissed", "out"],
    "player_dismissed": ["player_dismissed", "dismissed", "wicket_player"],
    "dismissal_kind": ["dismissal_kind", "method", "dismissal_type", "kind"],
    "venue": ["venue", "stadium", "ground"],
    "date": ["date", "match_date"],
    "winner": ["winner", "match_winner"],
}

BASE_DIR = Path(__file__).parent.parent
SAMPLE_DATA_PATH = BASE_DIR / "data" / "sample_match.json"
KAGGLE_DATA_DIR = BASE_DIR / "data" / "kaggle"


def resolve_column(df: pd.DataFrame, logical_name: str) -> Optional[str]:
    """Find the actual column name in df for a logical field name."""
    candidates = COLUMN_MAPPINGS.get(logical_name, [logical_name])
    for col in candidates:
        if col in df.columns:
            return col
    return None


def normalize_deliveries(df: pd.DataFrame) -> pd.DataFrame:
    """Rename columns to canonical names based on mappings."""
    rename_map = {}
    for canonical, candidates in COLUMN_MAPPINGS.items():
        for col in candidates:
            if col in df.columns and col != canonical:
                rename_map[col] = canonical
                break
    df = df.rename(columns=rename_map)
    # Ensure numeric types
    for col in ["batsman_runs", "total_runs", "extras", "is_wicket", "over", "ball", "inning"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
    # Normalize is_wicket: if it was player_dismissed string, convert to 0/1
    if "is_wicket" in df.columns:
        df["is_wicket"] = df["is_wicket"].apply(
            lambda x: 1 if (x and str(x) not in ["0", "nan", "", "None", "none"]) else 0
        )
    return df


def load_kaggle_data() -> Tuple[Optional[pd.DataFrame], Optional[pd.DataFrame]]:
    """Try to load matches and deliveries from Kaggle data directory."""
    try:
        if not KAGGLE_DATA_DIR.exists():
            return None, None

        # Look for matches file
        matches_df = None
        for fname in ["matches.csv", "Match.csv", "match.csv"]:
            fpath = KAGGLE_DATA_DIR / fname
            if fpath.exists():
                matches_df = pd.read_csv(fpath)
                logger.info(f"Loaded matches from {fname}")
                break

        # Look for deliveries file
        deliveries_df = None
        for fname in ["deliveries.csv", "Ball_by_Ball.csv", "ball_by_ball.csv", "deliveries.csv"]:
            fpath = KAGGLE_DATA_DIR / fname
            if fpath.exists():
                deliveries_df = pd.read_csv(fpath)
                logger.info(f"Loaded deliveries from {fname}")
                break

        if deliveries_df is not None:
            deliveries_df = normalize_deliveries(deliveries_df)

        return matches_df, deliveries_df
    except Exception as e:
        logger.warning(f"Failed to load Kaggle data: {e}")
        return None, None


def load_sample_data() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Load the bundled sample match JSON data."""
    with open(SAMPLE_DATA_PATH, "r") as f:
        data = json.load(f)

    matches_df = pd.DataFrame(data["matches"])
    deliveries_df = pd.DataFrame(data["deliveries"])
    deliveries_df = normalize_deliveries(deliveries_df)
    return matches_df, deliveries_df


class DataStore:
    """Singleton data store initialized once at startup."""
    _matches_df: Optional[pd.DataFrame] = None
    _deliveries_df: Optional[pd.DataFrame] = None
    _source: str = "mock"

    @classmethod
    def initialize(cls):
        # Forced MOCK-ONLY mode for Qualcomm Edge AI Hackathon readiness
        cls._matches_df, cls._deliveries_df = load_sample_data()
        cls._source = "mock"
        logger.info("Using sample mock data exclusively (Qualcomm Hackathon Ready)")

    @classmethod
    def get(cls) -> Tuple[pd.DataFrame, pd.DataFrame]:
        if cls._matches_df is None:
            cls.initialize()
        return cls._matches_df, cls._deliveries_df  # type: ignore

    @classmethod
    def get_match_deliveries(cls, match_id: int) -> pd.DataFrame:
        _, deliveries_df = cls.get()
        if "match_id" in deliveries_df.columns:
            return deliveries_df[deliveries_df["match_id"] == match_id].copy()
        return deliveries_df.copy()

    @classmethod
    def get_match_info(cls, match_id: int) -> Optional[dict]:
        matches_df, _ = cls.get()
        id_col = "id" if "id" in matches_df.columns else "match_id"
        row = matches_df[matches_df[id_col] == match_id]
        if row.empty:
            return None
        return row.iloc[0].to_dict()

    @classmethod
    def get_all_matches(cls) -> list:
        matches_df, _ = cls.get()
        # Ensure 'id' column
        if "id" not in matches_df.columns and "match_id" in matches_df.columns:
            matches_df = matches_df.rename(columns={"match_id": "id"})
        return matches_df.to_dict(orient="records")

    @classmethod
    def source(cls) -> str:
        return cls._source
