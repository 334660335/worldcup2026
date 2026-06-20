#!/usr/bin/env python3
"""
自动抓取 API-Football 世界杯数据
生成 data.json 供前端使用
"""

import json
import os
import sys
import time
from datetime import datetime, timezone

import requests

API_KEY = os.environ.get("API_KEY", "")
BASE_URL = "https://v3.football.api-sports.io"
HEADERS = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "v3.football.api-sports.io"
}

# 2026 世界杯联赛 ID (API-Football)
# 注意：实际使用时需要确认正确的 league ID
WORLD_CUP_LEAGUE_ID = 1  # FIFA World Cup
SEASON = 2026


def api_get(endpoint, params=None):
    """调用 API-Football"""
    url = f"{BASE_URL}/{endpoint}"
    try:
        resp = requests.get(url, headers=HEADERS, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if data.get("errors"):
            print(f"API Error: {data['errors']}", file=sys.stderr)
            return None
        return data.get("response", [])
    except Exception as e:
        print(f"Request failed: {e}", file=sys.stderr)
        return None


def fetch_fixtures():
    """获取赛程和比分"""
    fixtures = api_get("fixtures", {
        "league": WORLD_CUP_LEAGUE_ID,
        "season": SEASON,
        "timezone": "Asia/Shanghai"
    })
    return fixtures or []


def fetch_standings():
    """获取小组积分榜"""
    standings = api_get("standings", {
        "league": WORLD_CUP_LEAGUE_ID,
        "season": SEASON
    })
    return standings or []


def fetch_topscorers():
    """获取射手榜"""
    scorers = api_get("players/topscorers", {
        "league": WORLD_CUP_LEAGUE_ID,
        "season": SEASON
    })
    return scorers or []


def transform_fixtures(raw_fixtures):
    """将 API 数据转换为前端格式"""
    matches = []
    for f in raw_fixtures:
        fixture = f.get("fixture", {})
        teams = f.get("teams", {})
        goals = f.get("goals", {})
        league = f.get("league", {})
        status = fixture.get("status", {})

        # 状态映射
        status_map = {
            "NS": "upcoming",      # Not Started
            "1H": "live",          # First Half
            "HT": "live",          # Halftime
            "2H": "live",          # Second Half
            "ET": "live",          # Extra Time
            "P": "live",           # Penalty
            "FT": "finished",      # Full Time
            "AET": "finished",     # After Extra Time
            "PEN": "finished",     # After Penalties
        }

        match_status = status_map.get(status.get("short", "NS"), "upcoming")

        match = {
            "id": fixture.get("id"),
            "date": fixture.get("date", "")[:10],
            "time": fixture.get("date", "")[11:16],
            "timestamp": fixture.get("timestamp"),
            "home": teams.get("home", {}).get("name", ""),
            "homeFlag": get_flag_emoji(teams.get("home", {}).get("name", "")),
            "homeId": teams.get("home", {}).get("id"),
            "away": teams.get("away", {}).get("name", ""),
            "awayFlag": get_flag_emoji(teams.get("away", {}).get("name", "")),
            "awayId": teams.get("away", {}).get("id"),
            "homeScore": goals.get("home"),
            "awayScore": goals.get("away"),
            "status": match_status,
            "stage": map_stage(league.get("round", "")),
            "group": extract_group(league.get("round", "")),
            "venue": fixture.get("venue", {}).get("name", ""),
            "city": fixture.get("venue", {}).get("city", ""),
            "elapsed": status.get("elapsed")
        }
        matches.append(match)

    return matches


def transform_standings(raw_standings):
    """转换积分榜数据"""
    groups = {}
    for s in raw_standings:
        league = s.get("league", {})
        for group_data in league.get("standings", []):
            for team_data in group_data:
                group_name = team_data.get("group", "Unknown")[-1]  # 提取字母
                if group_name not in groups:
                    groups[group_name] = {"teams": []}

                team = team_data.get("team", {})
                stats = {
                    "name": team.get("name", ""),
                    "flag": get_flag_emoji(team.get("name", "")),
                    "code": team.get("code", ""),
                    "p": team_data.get("all", {}).get("played", 0),
                    "w": team_data.get("all", {}).get("win", 0),
                    "d": team_data.get("all", {}).get("draw", 0),
                    "l": team_data.get("all", {}).get("lose", 0),
                    "gf": team_data.get("all", {}).get("goals", {}).get("for", 0),
                    "ga": team_data.get("all", {}).get("goals", {}).get("against", 0),
                    "pts": team_data.get("points", 0),
                    "rank": team_data.get("rank", 0)
                }
                groups[group_name]["teams"].append(stats)

    return groups


def transform_topscorers(raw_scorers):
    """转换射手榜"""
    scorers = []
    for s in raw_scorers[:10]:
        player = s.get("player", {})
        stats = s.get("statistics", [{}])[0]
        scorers.append({
            "name": player.get("name", ""),
            "flag": get_flag_emoji(stats.get("team", {}).get("name", "")),
            "team": stats.get("team", {}).get("name", ""),
            "goals": stats.get("goals", {}).get("total", 0),
            "assists": stats.get("goals", {}).get("assists", 0)
        })
    return scorers


def get_flag_emoji(country_name):
    """根据国家名返回国旗 emoji（简化版）"""
    flags = {
        "Mexico": "🇲🇽", "Canada": "🇨🇦", "United States": "🇺🇸",
        "Argentina": "🇦🇷", "Brazil": "🇧🇷", "France": "🇫🇷",
        "Germany": "🇩🇪", "Spain": "🇪🇸", "England": "🏴",
        "Netherlands": "🇳🇱", "Portugal": "🇵🇹", "Italy": "🇮🇹",
        "Belgium": "🇧🇪", "Croatia": "🇭🇷", "Uruguay": "🇺🇾",
        "Japan": "🇯🇵", "South Korea": "🇰🇷", "Australia": "🇦🇺",
        "Morocco": "🇲🇦", "Senegal": "🇸🇳", "Tunisia": "🇹🇳",
        "South Africa": "🇿🇦", "Egypt": "🇪🇬", "Nigeria": "🇳🇬",
        "Saudi Arabia": "🇸🇦", "Iran": "🇮🇷", "Qatar": "🇶🇦",
        "Ecuador": "🇪🇨", "Peru": "🇵🇪", "Chile": "🇨🇱",
        "Colombia": "🇨🇴", "Poland": "🇵🇱", "Czech Republic": "🇨🇿",
        "Turkey": "🇹🇷", "Switzerland": "🇨🇭", "Austria": "🇦🇹",
        "Denmark": "🇩🇰", "Sweden": "🇸🇪", "Norway": "🇳🇴",
        "Serbia": "🇷🇸", "Ukraine": "🇺🇦", "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
        "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Greece": "🇬🇷", "Russia": "🇷🇺",
        "Curaçao": "🇨🇼", "Cape Verde": "🇨🇻", "Jordan": "🇯🇴",
        "Uzbekistan": "🇺🇿", "Iraq": "🇮🇶", "DR Congo": "🇨🇩",
        "Haiti": "🇭🇹", "New Zealand": "🇳🇿", "Paraguay": "🇵🇾",
    }
    return flags.get(country_name, "🏳️")


def map_stage(round_name):
    """映射比赛阶段"""
    round_lower = round_name.lower()
    if "group" in round_lower:
        return "group"
    elif "round of 32" in round_lower or "1/16" in round_lower:
        return "r32"
    elif "round of 16" in round_lower or "1/8" in round_lower:
        return "r16"
    elif "quarter" in round_lower:
        return "qf"
    elif "semi" in round_lower:
        return "sf"
    elif "final" in round_lower:
        return "final"
    return "group"


def extract_group(round_name):
    """提取小组名"""
    import re
    match = re.search(r'Group ([A-Z])', round_name)
    return match.group(1) if match else ""


def generate_fallback_data():
    """当 API 不可用时生成基础数据结构"""
    return {
        "matches": [],
        "groups": {},
        "scorers": [],
        "lastUpdate": datetime.now(timezone.utc).isoformat(),
        "source": "API-Football",
        "status": "fallback"
    }


def main():
    print("=" * 50)
    print("2026 FIFA World Cup Data Fetcher")
    print("=" * 50)

    if not API_KEY:
        print("警告: 未设置 API_KEY，将生成空数据结构")
        print("请在 GitHub Secrets 中设置 API_FOOTBALL_KEY")
        data = generate_fallback_data()
    else:
        print("正在获取数据...")

        # 获取数据
        fixtures = fetch_fixtures()
        standings = fetch_standings()
        scorers = fetch_topscorers()

        # 转换数据
        matches = transform_fixtures(fixtures)
        groups = transform_standings(standings)
        top_scorers = transform_topscorers(scorers)

        data = {
            "matches": matches,
            "groups": groups,
            "scorers": top_scorers,
            "lastUpdate": datetime.now(timezone.utc).isoformat(),
            "source": "API-Football",
            "status": "live"
        }

        print(f"获取到 {len(matches)} 场比赛")
        print(f"获取到 {len(groups)} 个小组")
        print(f"获取到 {len(top_scorers)} 名射手")

    # 写入文件
    output_path = "data.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"数据已保存到 {output_path}")
    print("=" * 50)


if __name__ == "__main__":
    main()
