class ResponseAgent:
    def build_full_response(self, itinerary, routes, route_link, culture_tip, translations, safety_summary, contacts, city, state):
        lines = [f"🗺️ **Your {city}, {state} Travel Plan**", "", "📋 **Itinerary:**", itinerary.get("llm_plan", ""), "", "📍 **Places Details:**"]
        for i, p in enumerate(itinerary.get("places", []), 1):
            lines.append(f"📍 Stop {i}: {p['name']}\n   {p['description']}\n   ⏱ Duration: ~{p['visit_duration_min']} min | 🎟 Entry: {p['entry_fee']}")
            if i <= len(routes):
                r = routes[i-1]; lines.append(f"   🚗 → {r['to']}: {r['distance']}, {r['duration']}")
        lines += ["", f"🗺️ **Full Route Map:** {route_link}", "", f"🎭 **Cultural Tip:**\n{culture_tip}", "", "🗣️ **Useful Phrases:**"]
        lines += [f"• {t['english']} → **{t['local']}** ({t['language']})" for t in translations]
        lines += ["", f"🔔 **Safety Alerts:**\n{safety_summary}", "", "📞 **Emergency Contacts:**"]
        lines += [f"• {k.title()}: {v}" for k, v in contacts.items()]
        msg = "\n".join(lines)
        return msg[:4000] + ("... (message trimmed)" if len(msg) > 4000 else "")
