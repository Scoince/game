from __future__ import annotations

import os
from dataclasses import dataclass

try:
    from dotenv import load_dotenv
except Exception:
    def load_dotenv() -> None:  # type: ignore
        return None

load_dotenv()


@dataclass(frozen=True)
class Settings:
    # LLM provider config (NVIDIA NIM/OpenAI-compatible)
    nvidia_api_key: str = os.getenv("NVIDIA_API_KEY", "")
    llm_base_url: str = os.getenv("LLM_BASE_URL", "https://integrate.api.nvidia.com/v1")
    llm_model: str = os.getenv("LLM_MODEL", "deepseek-ai/deepseek-r1")

    # legacy compatibility
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    telegram_bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    google_maps_api_key: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    app_host: str = os.getenv("APP_HOST", "0.0.0.0")
    app_port: int = int(os.getenv("APP_PORT", "8000"))


settings = Settings()
