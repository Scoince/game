from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from agents.culture_agent import CultureAgent
from agents.planner_agent import PlannerAgent
from agents.response_agent import ResponseAgent
from agents.route_agent import RouteAgent
from agents.safety_agent import SafetyAgent
from agents.translation_agent import TranslationAgent
from utils.llm_client import LLMClient


SUPPORTED_CITIES = {"Shillong", "Imphal", "Guwahati", "Kohima", "Cherrapunji"}
SUPPORTED_STATES = {"Meghalaya", "Manipur", "Assam", "Nagaland"}


@dataclass
class FlowTrace:
    intent: dict[str, Any] = field(default_factory=dict)
    planner: dict[str, Any] = field(default_factory=dict)
    route: dict[str, Any] = field(default_factory=dict)
    culture: dict[str, Any] = field(default_factory=dict)
    translation: dict[str, Any] = field(default_factory=dict)
    safety: dict[str, Any] = field(default_factory=dict)


class Orchestrator:
    def __init__(self) -> None:
        self.llm = LLMClient()
        self.planner = PlannerAgent()
        self.route = RouteAgent()
        self.culture = CultureAgent()
        self.translation = TranslationAgent()
        self.safety = SafetyAgent()
        self.response = ResponseAgent()

    def _normalize_region(self, intent: dict[str, Any]) -> tuple[str, str]:
        state = (intent.get("state") or "Meghalaya").title()
        city = (intent.get("city") or "Shillong").title()
        if state not in SUPPORTED_STATES:
            state = "Meghalaya"
        if city not in SUPPORTED_CITIES:
            city = "Shillong"
        return state, city

    def _general_help(self) -> str:
        return (
            "Try one of these: \n"
            "• Plan a 4-hour cultural trip in Imphal with food\n"
            "• How to reach Cherrapunji from Shillong?\n"
            "• Any safety alerts for Meghalaya?\n"
            "• Translate 'Thank you' to Khasi"
        )

    def process(self, message: str) -> tuple[str, FlowTrace]:
        trace = FlowTrace()
        intent = self.llm.parse_intent(message)
        trace.intent = intent
        state, city = self._normalize_region(intent)
        action = intent.get("intent", "general_query")

        if action == "general_query":
            return self._general_help(), trace

        itinerary = {"places": [], "llm_plan": ""}
        route_summaries: list[dict[str, Any]] = []
        route_link = ""
        culture_tip = ""
        translations: list[dict[str, Any]] = []
        safety_summary = ""
        contacts: dict[str, str] = {}

        if action in {"plan_trip", "get_route"}:
            itinerary = self.planner.plan_itinerary(state, city, int(intent.get("duration_hours", 4)), intent.get("interests", []))
            trace.planner = itinerary
            route_summaries = self.route.get_route_summary(itinerary.get("places", []), city)
            route_link = self.route.get_full_route_link(itinerary.get("places", []), city)
            trace.route = {"route_summaries": route_summaries, "route_link": route_link}

        if action in {"plan_trip", "culture_info"}:
            place_names = [p.get("name", "") for p in itinerary.get("places", [])]
            culture_tip = self.culture.get_contextual_tip(state, city, place_names)
            trace.culture = {"tip": culture_tip}

        if action in {"plan_trip", "translate"}:
            phrase = intent.get("translate_phrase") or ""
            if phrase:
                lang = (intent.get("target_language") or self.translation.get_language_for_region(state)).lower()
                local = self.translation.get_phrase(phrase, lang) or self.translation.translate_custom(phrase, "hi")
                translations = [{"english": phrase, "local": local, "language": lang}]
            else:
                translations = self.translation.translate_essentials(state)
            trace.translation = {"translations": translations}

        if action in {"plan_trip", "get_route", "safety_check"}:
            safety_summary = self.safety.get_safety_summary(state, city)
            contacts = self.safety.get_emergency_contacts(city)
            trace.safety = {"summary": safety_summary, "contacts": contacts}

        if action == "translate":
            # translation-only compact reply
            if not translations:
                translations = self.translation.translate_essentials(state)
            reply = "\n".join([f"• {t['english']} → {t['local']} ({t['language']})" for t in translations])
            return reply, trace

        reply = self.response.build_full_response(
            itinerary,
            route_summaries,
            route_link,
            culture_tip or "No culture note available.",
            translations,
            safety_summary or "✅ No active safety alerts",
            contacts,
            city,
            state,
        )
        return reply, trace


    def geo_context(self, lat: float, lng: float) -> dict[str, Any]:
        nearest = self.planner.geo_lookup(lat, lng)
        state = nearest.get("state", "Meghalaya")
        city = nearest.get("city", "Shillong")
        culture = self.culture.get_all_tips(state)
        safety = self.safety.get_safety_summary(state, city)
        contacts = self.safety.get_emergency_contacts(city)
        return {
            "nearest": nearest,
            "culture": culture,
            "safety": safety,
            "contacts": contacts,
        }
    def handle_message(self, message: str) -> str:
        reply, _ = self.process(message)
        return reply
