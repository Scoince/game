from __future__ import annotations

from utils.maps_client import estimate_route, maps_directions_link


class RouteAgent:
    def get_route(self, origin: str, destination: str) -> dict:
        return estimate_route(origin, destination)

    def get_route_summary(self, places: list[dict], city: str) -> list[dict]:
        out = []
        for i in range(len(places) - 1):
            o, d = f"{places[i]['name']} {city}", f"{places[i+1]['name']} {city}"
            r = self.get_route(o, d)
            out.append({"from": places[i]["name"], "to": places[i + 1]["name"], "distance": r["distance"], "duration": r["duration"]})
        return out

    def get_full_route_link(self, places: list[dict], city: str) -> str:
        return maps_directions_link(*[f"{p['name']} {city}" for p in places])
