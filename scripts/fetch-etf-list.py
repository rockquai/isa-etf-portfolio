"""
네이버 금융 API에서 국내 ETF 전종목을 가져와 lib/static/etf-list.json을 갱신합니다.
GitHub Actions에서 매월 1일 자동 실행됩니다.
"""

import json
import os
import sys
import requests

API_URL = "https://finance.naver.com/api/sise/etfItemList.nhn"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "lib", "static", "etf-list.json")

CATEGORY_RULES = [
    (["배당", "고배당", "프리미엄"], "배당"),
    (["리츠", "부동산", "REIT"], "리츠"),
    (["채권", "국고채", "단기채", "회사채", "국채"], "채권"),
    (["금", "원유", "구리", "원자재", "commodity"], "원자재"),
    (["S&P500", "나스닥", "NASDAQ", "미국", "다우"], "미국주식"),
    (["차이나", "중국", "CSI", "항셍", "홍콩"], "글로벌"),
    (["인도", "일본", "유럽", "베트남", "신흥", "글로벌", "세계", "MSCI EM"], "글로벌"),
    (["반도체", "2차전지", "배터리", "AI", "바이오", "헬스케어", "IT", "게임", "메타버스", "클라우드", "로봇", "신재생", "수소"], "섹터"),
]


def derive_category(name: str) -> str:
    for keywords, category in CATEGORY_RULES:
        if any(kw in name for kw in keywords):
            return category
    return "국내주식"


def fetch_etf_list() -> list[dict]:
    resp = requests.get(
        API_URL,
        headers={
            "Referer": "https://finance.naver.com",
            "User-Agent": "Mozilla/5.0 (compatible; ETF-Portfolio-Bot/1.0)",
        },
        timeout=10,
    )
    resp.raise_for_status()

    data = resp.json()
    items = data.get("result", {}).get("etfItemList", [])

    if not items:
        raise ValueError("ETF 목록이 비어있습니다. API 응답을 확인하세요.")

    return [
        {
            "name": item["itemname"],
            "code": item["itemcode"],
            "category": derive_category(item["itemname"]),
        }
        for item in items
        if item.get("itemname") and item.get("itemcode")
    ]


def main():
    print("📡 네이버 금융 API에서 ETF 목록을 가져오는 중...")

    try:
        etf_list = fetch_etf_list()
    except requests.RequestException as e:
        print(f"❌ API 호출 실패: {e}", file=sys.stderr)
        sys.exit(1)
    except (KeyError, ValueError) as e:
        print(f"❌ 응답 파싱 실패: {e}", file=sys.stderr)
        sys.exit(1)

    output_path = os.path.normpath(OUTPUT_PATH)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(etf_list, f, ensure_ascii=False, indent=2)

    print(f"✅ {len(etf_list)}개 ETF 저장 완료 → {output_path}")

    categories = {}
    for etf in etf_list:
        categories[etf["category"]] = categories.get(etf["category"], 0) + 1
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"   {cat}: {count}개")


if __name__ == "__main__":
    main()
