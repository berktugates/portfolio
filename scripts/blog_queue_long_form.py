#!/usr/bin/env python3
"""Append long-form sections from content/blog-long-form-append.json."""

import json
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
_APPEND_PATH = _ROOT / "content" / "blog-long-form-append.json"


def _load_append() -> dict:
    if not _APPEND_PATH.is_file():
        return {}
    return json.loads(_APPEND_PATH.read_text(encoding="utf-8"))


def append_long_form_sections(slug: str, locale: str, sections: list) -> list:
    append = _load_append().get(slug, {}).get(locale)
    if not append:
        return sections
    out = [dict(s) for s in sections]
    for section in append:
        out.append(dict(section))
    return out
