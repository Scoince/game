from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def load_json(path: str | Path) -> Any:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def safe_lower(value: str | None) -> str:
    return (value or "").strip().lower()
