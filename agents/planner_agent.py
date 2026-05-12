from __future__ import annotations

from math import atan2, cos, radians, sin, sqrt

from utils.helpers import load_json
from utils.llm_client import LLMClient


class PlannerAgent:
    def __init__(self, data_path: str = "data/places.json") -> None:
        self.db = load_json(data_path)
        self.llm = LLMClient()

    def get_places(self, state: str, city: str) -> list[dict]:
        return self.db.get(state, {}).get(city, [])

    def geo_lookup(self, lat: float, lng: float) -> dict:
        """Return nearest known place and its state/city context."""
        nearest = {"distance_km": 10**9}
        for state, cities in self.db.items():
            for city, places in cities.items():
                for place in places:
                    d = self._haversine_km(lat, lng, place["lat"], place["lng"])
                    if d < nearest["distance_km"]:
                        nearest = {
                            "state": state,
                            "city": city,
                            "place": place,
                            "distance_km": round(d, 2),
                        }
        return nearest

    def _haversine_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        r = 6371.0
        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)
        a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
        return r * 2 * atan2(sqrt(a), sqrt(1 - a))

    def plan_itinerary(self, state: str, city: str, duration_hours: int = 4, interests: list[str] | None = None) -> dict:
        places = self.get_places(state, city)
        if not places:
            return {"places": [], "llm_plan": f"No data for {city} yet."}
        interests = [i.lower() for i in (interests or [])]
        ranked = sorted(places, key=lambda p: sum(tag.lower() in interests for tag in p.get("tags", [])), reverse=True)
        selected, tmax, t = [], max(duration_hours, 1) * 60, 0
        for p in ranked:
            need = int(p.get("visit_duration_min", 60)) + 15
            if t + need <= tmax and len(selected) < 5:
                selected.append(p)
                t += need
        if not selected:
            selected = ranked[:2]
        names = [p["name"] for p in selected]
        plan = self.llm.complete("You are a concise travel planner for NE India", f"Arrange {names} into a {duration_hours}-hour itinerary in {city}.")
        return {"places": selected, "llm_plan": plan}
