from __future__ import annotations

from urllib.parse import quote_plus


def maps_directions_link(*stops: str) -> str:
    encoded = "/".join(quote_plus(s) for s in stops if s)
    return f"https://www.google.com/maps/dir/{encoded}"


def estimate_route(origin: str, destination: str) -> dict:
    return {
        "origin": origin,
        "destination": destination,
        "distance": "~15 km (estimated)",
        "duration": "~30 mins (estimated)",
        "maps_link": maps_directions_link(origin, destination),
    }
