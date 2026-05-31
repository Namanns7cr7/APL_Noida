from pydantic import BaseModel
from typing import Optional, List, Any, Dict


class MatchInfo(BaseModel):
    id: int
    season: str
    date: str
    venue: str
    team1: str
    team2: str
    toss_winner: Optional[str] = None
    toss_decision: Optional[str] = None
    winner: Optional[str] = None
    result: Optional[str] = None
    result_margin: Optional[Any] = None
    player_of_match: Optional[str] = None


class TeamScore(BaseModel):
    team: str
    runs: int
    wickets: int
    overs: float


class MatchSummary(BaseModel):
    match_id: int
    team1: str
    team2: str
    venue: str
    date: str
    winner: Optional[str]
    result: Optional[str]
    result_margin: Optional[Any]
    player_of_match: Optional[str]
    inning1: TeamScore
    inning2: Optional[TeamScore]
    total_overs: float


class OverData(BaseModel):
    over: int
    runs: int
    wickets: int
    boundaries: int
    dots: int


class MomentumData(BaseModel):
    team: str
    momentum: float
    reason: str
    recent_overs: List[OverData]


class WinProbability(BaseModel):
    teamA: str
    teamB: str
    teamA_prob: float
    teamB_prob: float
    explanation: str


class TurningPoint(BaseModel):
    over: int
    title: str
    description: str
    impact: str


class PlayerStats(BaseModel):
    name: str
    team: str
    role: str
    runs: int
    balls: int
    strike_rate: float
    fours: int
    sixes: int
    wickets: int
    economy: float
    dot_balls: int
    impact_score: float
    fantasy_score: float


class PlayerComparison(BaseModel):
    player1: PlayerStats
    player2: PlayerStats
    winner: str
    summary: str


class FantasyPick(BaseModel):
    name: str
    team: str
    role: str
    impact_score: float
    fantasy_score: float
    reason: str
    confidence: float


class FantasyResponse(BaseModel):
    captain: FantasyPick
    vice_captain: FantasyPick
    differential: FantasyPick
    avoid: FantasyPick
    match_id: int


class AISummary(BaseModel):
    match_id: int
    summary: str
    key_insights: List[str]
    source: str  # 'ai' or 'rule-based'
