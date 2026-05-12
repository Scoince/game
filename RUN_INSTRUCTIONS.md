# Northeast Region Impact Agent — Run Instructions

## 1) Prerequisites

- Python 3.10+
- `pip`
- Optional keys for full features:
  - `OPENAI_API_KEY`
  - `TELEGRAM_BOT_TOKEN`
  - `GOOGLE_MAPS_API_KEY` (optional; route agent has fallback)

## 2) Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 3) Environment Variables

Create a `.env` file in project root:

```env
NVIDIA_API_KEY=your_nvidia_api_key
LLM_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_MODEL=deepseek-ai/deepseek-r1
# Alternative: LLM_MODEL=google/gemma-2-9b-it
OPENAI_API_KEY=your_openai_key
TELEGRAM_BOT_TOKEN=your_telegram_token
GOOGLE_MAPS_API_KEY=optional_maps_key
APP_HOST=0.0.0.0
APP_PORT=8000
```

## 4) Run FastAPI App

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Then open:
- Dashboard: `http://127.0.0.1:8000/`
- Health: `http://127.0.0.1:8000/health`

## 5) Test Chat API

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Plan a 4-hour cultural trip in Imphal with food","user_id":"demo"}'
```

## 6) Run Telegram Bot (Optional)

```bash
python bot.py
```

## 7) Run Demo Query Script

```bash
python tests/test_queries.py
```

## Notes

- If OpenAI key is missing, LLM features degrade gracefully with fallback text.
- If Maps key is missing/unavailable, route values are estimated but links are still generated.
- Some external websites may block iframe embedding due to security headers.

- `POST /geo/context` with `{ "lat": 24.8170, "lng": 93.9368 }` to get nearest known place + culture/safety context (useful for Manipur/Imphal geo lookups).
