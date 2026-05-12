import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from orchestrator import Orchestrator


def run_demo_tests() -> None:
    engine = Orchestrator()
    queries = [
        "Plan a half-day trip in Shillong with local food and culture",
        "How to reach Cherrapunji from Shillong?",
        "Tell me about Manipur culture and customs",
        "How do I say thank you in Khasi?",
        "Any safety alerts for Meghalaya?",
    ]
    for q in queries:
        print("\nQ:", q)
        print(engine.handle_message(q)[:700])


if __name__ == "__main__":
    run_demo_tests()
