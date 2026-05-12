from __future__ import annotations

from utils.helpers import load_json, safe_lower

try:
    from deep_translator import GoogleTranslator
except Exception:
    GoogleTranslator = None  # type: ignore


class TranslationAgent:
    MAP = {"meghalaya": "khasi", "shillong": "khasi", "manipur": "manipuri", "imphal": "manipuri", "assam": "assamese", "guwahati": "assamese", "nagaland": "nagamese", "kohima": "nagamese"}

    def __init__(self, data_path: str = "data/translations.json") -> None:
        self.db = load_json(data_path)

    def get_language_for_region(self, state_or_city: str) -> str:
        return self.MAP.get(safe_lower(state_or_city), "hindi")

    def get_phrase(self, english: str, lang: str) -> str | None:
        for row in self.db:
            if safe_lower(row["english"]) == safe_lower(english):
                return row.get(lang)
        return None

    def translate_essentials(self, state: str) -> list[dict]:
        lang = self.get_language_for_region(state)
        essentials = ["Hello", "Thank you", "Where is the nearest hospital?", "How much does this cost?", "I need help"]
        return [{"english": e, "local": self.get_phrase(e, lang) or e, "language": lang} for e in essentials]

    def translate_custom(self, text: str, target_lang_code: str = "hi") -> str:
        if not GoogleTranslator:
            return text
        try:
            return GoogleTranslator(source="auto", target=target_lang_code).translate(text)
        except Exception:
            return text
