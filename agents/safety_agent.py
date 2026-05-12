from __future__ import annotations
from utils.helpers import load_json, safe_lower


class SafetyAgent:
    ICON = {"high": "🔴", "medium": "🟡", "low": "🟢", "none": "✅"}
    def __init__(self) -> None:
        self.alerts = load_json("data/safety_alerts.json")
        self.contacts = load_json("data/emergency_contacts.json")

    def check_alerts(self, state: str, city: str) -> list[dict]:
        st, ct = safe_lower(state), safe_lower(city)
        return [a for a in self.alerts if a.get("active") and (safe_lower(a.get("state")) == st or ct in safe_lower(a.get("area")))]

    def get_safety_summary(self, state: str, city: str) -> str:
        rows = self.check_alerts(state, city)
        if not rows: return "✅ No active safety alerts"
        return "\n".join(f"{self.ICON.get(r['severity'],'⚠️')} {r['message']}" for r in rows)

    def get_emergency_contacts(self, city: str) -> dict:
        return self.contacts.get(city, {})
