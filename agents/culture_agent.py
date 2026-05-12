from __future__ import annotations
from utils.helpers import load_json
from utils.llm_client import LLMClient


class CultureAgent:
    def __init__(self, data_path: str = "data/culture_tips.json") -> None:
        self.db = load_json(data_path)
        self.llm = LLMClient()

    def get_all_tips(self, state: str) -> dict:
        return self.db.get(state, {})

    def get_contextual_tip(self, state: str, city: str, places: list[str]) -> str:
        tips = self.get_all_tips(state)
        return self.llm.complete("You are a cultural guide.", f"State tips: {tips}. Places: {places}. Give one practical 2-3 sentence tip.")
