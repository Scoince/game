from __future__ import annotations

import json
import re
from typing import Any

from config import settings

try:
    from openai import OpenAI
except Exception:  # optional dependency in offline/demo mode
    OpenAI = None  # type: ignore


class LLMClient:
    def __init__(self) -> None:
        self.client = None
        # Prefer NVIDIA API key; fallback to OpenAI key for compatibility.
        api_key = settings.nvidia_api_key or settings.openai_api_key
        if OpenAI and api_key:
            self.client = OpenAI(api_key=api_key, base_url=settings.llm_base_url)
        if OpenAI and settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)

    def _fallback_intent(self, message: str) -> dict[str, Any]:
        text = (message or "").lower()
        state = ""
        city = ""
        for s in ["meghalaya", "manipur", "assam", "nagaland"]:
            if s in text:
                state = s.title()
                break
        for c in ["shillong", "cherrapunji", "imphal", "guwahati", "kohima"]:
            if c in text:
                city = c.title()
                break

        intent = "general_query"
        if any(k in text for k in ["plan", "trip", "itinerary"]):
            intent = "plan_trip"
        elif any(k in text for k in ["route", "reach", "distance", "maps"]):
            intent = "get_route"
        elif any(k in text for k in ["culture", "custom", "festival", "etiquette"]):
            intent = "culture_info"
        elif any(k in text for k in ["translate", "say", "meaning"]):
            intent = "translate"
        elif any(k in text for k in ["safe", "safety", "alert", "landslide", "flood"]):
            intent = "safety_check"

        duration = 4
        m = re.search(r"(\d+)\s*[- ]?(hour|hr)", text)
        if m:
            duration = max(1, min(12, int(m.group(1))))

        return {
            "intent": intent,
            "state": state,
            "city": city,
            "duration_hours": duration,
            "interests": [k for k in ["food", "culture", "nature", "heritage", "shopping"] if k in text],
            "origin": "",
            "destination": "",
            "translate_phrase": "",
            "target_language": "",
        }

    def parse_intent(self, message: str) -> dict[str, Any]:
        fallback = self._fallback_intent(message)
        if not self.client:
            return fallback
        prompt = (
            "Return JSON only with keys: intent,state,city,duration_hours,interests,"
            f"origin,destination,translate_phrase,target_language. Message: {message}"
        )
        try:
            resp = self.client.chat.completions.create(
                model=settings.llm_model,
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )
            text = resp.choices[0].message.content or "{}"
            parsed = json.loads(text)
            return {**fallback, **parsed}
        except Exception:
            return fallback

    def complete(self, system: str, user: str) -> str:
        if not self.client:
            return "LLM unavailable in local mode."
        try:
            resp = self.client.chat.completions.create(
                model=settings.llm_model,
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
                temperature=0.4,
            )
            return resp.choices[0].message.content or ""
        except Exception:
            return "LLM request failed; showing data-only fallback."
