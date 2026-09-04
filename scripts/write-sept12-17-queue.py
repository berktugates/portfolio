#!/usr/bin/env python3
"""Generate Sept 12–17 blog queue JSON files."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "blog-queue"

LOCALES = ("tr", "de", "fr", "it", "zh", "ja")


def post(
    slug,
    title,
    excerpt,
    description,
    keywords,
    social_tr_1,
    social_tr_2_suffix,
    sections_en,
    locales,
):
    return {
        "slug": slug,
        "title": title,
        "excerpt": excerpt,
        "description": description,
        "readingMinutes": 7,
        "keywords": keywords,
        "socialThreadTr": [
            social_tr_1,
            f"{social_tr_2_suffix} Detay: https://berktugberke.com/tr/blogs/{slug}",
        ],
        "sections": sections_en,
        "locales": locales,
    }


# --- Post 12: feature store vs prompt store ---
POSTS = []


def main():
    for filename, body in POSTS:
        path = OUT / filename
        path.write_text(json.dumps(body, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("wrote", filename)


if __name__ == "__main__":
    main()
