#!/usr/bin/env python3
"""
自动抓取 football-data.org 世界杯数据
生成 data.json 供前端使用
API 文档: https://docs.football-data.org/
"""

import json
import os
import sys
import re
from datetime import datetime, timezone

import requests

API_KEY = os.environ.get("API_KEY", "")
BASE_URL = "https://api.football-data.org/v4"
HEADERS = {
    "X-Auth-Token": API_KEY
}

# football-data.org 世界杯竞赛 ID (FIFA World Cup)
# 可通过 /v4/competitions 查询确认，世界杯通常为 WC
WORLD_CUP_COMPETITION_ID = "WC"
SEASON = 2026


def api_get(endpoint, params=None):
    """调用 football-data.org API"""
    url = f"{BASE_URL}/{endpoint}"
    try:
        resp = requests.get(url, headers=HEADERS, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"Request failed: {e}", file=sys.stderr)
        return None


def fetch_matches():
    """获取世界杯所有比赛 (赛程和比分)"""
    data = api_get(f"competitions/{WORLD_CUP_COMPETITION_ID}/matches", {
        "season": SEASON
    })
    return data.get("matches", []) if data else []


def fetch_standings():
    """获取小组积分榜"""
    data = api_get(f"competitions/{WORLD_CUP_COMPETITION_ID}/standings", {
        "season": SEASON
    })
    return data.get("standings", []) if data else []


def fetch_scorers():
    """获取射手榜"""
    data = api_get(f"competitions/{WORLD_CUP_COMPETITION_ID}/scorers", {
        "season": SEASON,
        "limit": 20
    })
    return data.get("scorers", []) if data else []


def transform_matches(raw_matches):
    """将 football-data.org 比赛数据转换为前端格式"""
    matches = []
    for m in raw_matches:
        # 状态映射
        status_map = {
            "SCHEDULED": "upcoming",
            "LIVE": "live",
            "IN_PLAY": "live",
            "PAUSED": "live",
            "FINISHED": "finished",
            "POSTPONED": "upcoming",
            "SUSPENDED": "upcoming",
            "CANCELLED": "upcoming",
        }

        status = status_map.get(m.get("status", "SCHEDULED"), "upcoming")
        utc_date = m.get("utcDate", "")
        date_str = utc_date[:10] if utc_date else ""
        time_str = utc_date[11:16] if utc_date else ""

        home_team = m.get("homeTeam", {})
        away_team = m.get("awayTeam", {})
        score = m.get("score", {})
        full_time = score.get("fullTime", {})
        half_time = score.get("halfTime", {})
        extra_time = score.get("extraTime", {})
        penalties = score.get("penalties", {})

        # 确定最终比分
        home_score = full_time.get("home") if full_time.get("home") is not None else None
        away_score = full_time.get("away") if full_time.get("away") is not None else None

        # 比赛阶段映射
        stage = map_stage(m.get("stage", "GROUP_STAGE"))
        group = m.get("group", "")
        # 提取小组字母，如 "GROUP_A" -> "A"
        group_letter = group.replace("GROUP_", "") if group.startswith("GROUP_") else ""

        # 场地信息
        venue = ""
        city = ""
        if m.get("venue"):
            venue = m.get("venue", "")

        match = {
            "id": m.get("id"),
            "date": date_str,
            "time": time_str,
            "timestamp": int(datetime.fromisoformat(utc_date.replace("Z", "+00:00")).timestamp()) if utc_date else None,
            "home": home_team.get("name", ""),
            "homeFlag": get_flag_emoji(home_team.get("name", "")),
            "homeId": home_team.get("id"),
            "homeShort": home_team.get("shortName", ""),
            "homeTla": home_team.get("tla", ""),
            "away": away_team.get("name", ""),
            "awayFlag": get_flag_emoji(away_team.get("name", "")),
            "awayId": away_team.get("id"),
            "awayShort": away_team.get("shortName", ""),
            "awayTla": away_team.get("tla", ""),
            "homeScore": home_score,
            "awayScore": away_score,
            "halfTimeHome": half_time.get("home"),
            "halfTimeAway": half_time.get("away"),
            "extraTimeHome": extra_time.get("home"),
            "extraTimeAway": extra_time.get("away"),
            "penaltiesHome": penalties.get("home"),
            "penaltiesAway": penalties.get("away"),
            "status": status,
            "stage": stage,
            "group": group_letter,
            "matchday": m.get("matchday"),
            "venue": venue,
            "city": city,
            "winner": m.get("score", {}).get("winner")
        }
        matches.append(match)

    return matches


def transform_standings(raw_standings):
    """转换积分榜数据为前端格式"""
    groups = {}
    for standing in raw_standings:
        group_type = standing.get("type", "")
        if group_type != "TOTAL":
            continue

        group_name = standing.get("group", "Unknown")
        # 提取小组字母
        group_letter = group_name.replace("GROUP_", "") if group_name.startswith("GROUP_") else group_name[-1] if group_name else "?"

        if group_letter not in groups:
            groups[group_letter] = {"teams": []}

        for team_data in standing.get("table", []):
            team = team_data.get("team", {})
            stats = {
                "name": team.get("name", ""),
                "flag": get_flag_emoji(team.get("name", "")),
                "code": team.get("tla", ""),
                "shortName": team.get("shortName", ""),
                "p": team_data.get("playedGames", 0),
                "w": team_data.get("won", 0),
                "d": team_data.get("draw", 0),
                "l": team_data.get("lost", 0),
                "gf": team_data.get("goalsFor", 0),
                "ga": team_data.get("goalsAgainst", 0),
                "gd": team_data.get("goalDifference", 0),
                "pts": team_data.get("points", 0),
                "rank": team_data.get("position", 0),
                "form": team_data.get("form", "")
            }
            groups[group_letter]["teams"].append(stats)

    return groups


def transform_scorers(raw_scorers):
    """转换射手榜数据"""
    scorers = []
    for s in raw_scorers:
        player = s.get("player", {})
        team = s.get("team", {})
        scorers.append({
            "name": player.get("name", ""),
            "flag": get_flag_emoji(team.get("name", "")),
            "team": team.get("name", ""),
            "teamShort": team.get("shortName", ""),
            "goals": s.get("goals", 0),
            "assists": s.get("assists", 0),
            "penalties": s.get("penalties", 0)
        })
    return scorers


def get_flag_emoji(country_name):
    """根据国家名返回国旗 emoji"""
    flags = {
        "Mexico": "🇲🇽", "Canada": "🇨🇦", "United States": "🇺🇸",
        "Argentina": "🇦🇷", "Brazil": "🇧🇷", "France": "🇫🇷",
        "Germany": "🇩🇪", "Spain": "🇪🇸", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "Netherlands": "🇳🇱", "Portugal": "🇵🇹", "Italy": "🇮🇹",
        "Belgium": "🇧🇪", "Croatia": "🇭🇷", "Uruguay": "🇺🇾",
        "Japan": "🇯🇵", "South Korea": "🇰🇷", "Korea Republic": "🇰🇷",
        "Australia": "🇦🇺", "Morocco": "🇲🇦", "Senegal": "🇸🇳",
        "Tunisia": "🇹🇳", "South Africa": "🇿🇦", "Egypt": "🇪🇬",
        "Nigeria": "🇳🇬", "Saudi Arabia": "🇸🇦", "Iran": "🇮🇷",
        "Qatar": "🇶🇦", "Ecuador": "🇪🇨", "Peru": "🇵🇪",
        "Chile": "🇨🇱", "Colombia": "🇨🇴", "Poland": "🇵🇱",
        "Czech Republic": "🇨🇿", "Turkey": "🇹🇷", "Switzerland": "🇨🇭",
        "Austria": "🇦🇹", "Denmark": "🇩🇰", "Sweden": "🇸🇪",
        "Norway": "🇳🇴", "Serbia": "🇷🇸", "Ukraine": "🇺🇦",
        "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Greece": "🇬🇷",
        "Russia": "🇷🇺", "Curaçao": "🇨🇼", "Cape Verde": "🇨🇻",
        "Jordan": "🇯🇴", "Uzbekistan": "🇺🇿", "Iraq": "🇮🇶",
        "DR Congo": "🇨🇩", "Haiti": "🇭🇹", "New Zealand": "🇳🇿",
        "Paraguay": "🇵🇾", "Ghana": "🇬🇭", "Cameroon": "🇨🇲",
        "Costa Rica": "🇨🇷", "Panama": "🇵🇦", "Jamaica": "🇯🇲",
        "Honduras": "🇭🇳", "Guatemala": "🇬🇹", "El Salvador": "🇸🇻",
        "Algeria": "🇩🇿", "Ivory Coast": "🇨🇮", "Mali": "🇲🇱",
        "Burkina Faso": "🇧🇫", "Guinea": "🇬🇳", "Zambia": "🇿🇲",
        "China": "🇨🇳", "India": "🇮🇳", "Thailand": "🇹🇭",
        "Vietnam": "🇻🇳", "Indonesia": "🇮🇩", "Malaysia": "🇲🇾",
    }
    return flags.get(country_name, "🏳️")


def map_stage(stage):
    """映射 football-data.org 比赛阶段到前端格式"""
    stage_map = {
        "GROUP_STAGE": "group",
        "LAST_64": "r64",
        "LAST_32": "r32",
        "LAST_16": "r16",
        "QUARTER_FINALS": "qf",
        "SEMI_FINALS": "sf",
        "FINAL": "final",
        "THIRD_PLACE": "third",
        "PRELIMINARY_ROUND": "pre",
        "QUALIFICATION": "qual",
        "PLAYOFFS": "playoff",
    }
    return stage_map.get(stage, "group")


def generate_fallback_data():
    """当 API 不可用时生成基础数据结构"""
    return {
        "matches": [],
        "groups": {},
        "scorers": [],
        "lastUpdate": datetime.now(timezone.utc).isoformat(),
        "source": "football-data.org",
        "status": "fallback"
    }


def main():
    print("=" * 50)
    print("2026 FIFA World Cup Data Fetcher")
    print("Source: football-data.org")
    print("=" * 50)

    if not API_KEY:
        print("警告: 未设置 API_KEY，将生成空数据结构")
        print("请在 GitHub Secrets 中设置 FOOTBALL_DATA_KEY")
        data = generate_fallback_data()
    else:
        print("正在从 football-data.org 获取数据...")

        # 获取数据
        matches_raw = fetch_matches()
        standings_raw = fetch_standings()
        scorers_raw = fetch_scorers()

        # 转换数据
        matches = transform_matches(matches_raw)
        groups = transform_standings(standings_raw)
        top_scorers = transform_scorers(scorers_raw)

        data = {
            "matches": matches,
            "groups": groups,
            "scorers": top_scorers,
            "lastUpdate": datetime.now(timezone.utc).isoformat(),
            "source": "football-data.org",
            "status": "live",
            "competition": WORLD_CUP_COMPETITION_ID,
            "season": SEASON
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
