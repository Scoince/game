import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from orchestrator import Orchestrator
from utils.llm_client import LLMClient


class TestProject(unittest.TestCase):
    def test_fallback_intent_detection(self):
        llm = LLMClient()
        intent = llm.parse_intent("Plan a 4 hour cultural trip in Imphal with food")
        self.assertEqual(intent["intent"], "plan_trip")
        self.assertEqual(intent["city"], "Imphal")
        self.assertGreaterEqual(intent["duration_hours"], 4)

    def test_geo_context_manipur(self):
        orch = Orchestrator()
        payload = orch.geo_context(24.8170, 93.9368)
        self.assertIn("nearest", payload)
        self.assertEqual(payload["nearest"]["state"], "Manipur")
        self.assertIn("culture", payload)


if __name__ == "__main__":
    unittest.main()
