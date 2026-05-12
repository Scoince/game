# Northeast Region Impact Agent

Multi-agent tourism assistant MVP for Northeast India.

## Run

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Web Demo

- Open `http://127.0.0.1:8000/` for the dashboard.
- The page includes iframe embeds for:
  - https://www.meiteimayek.com/#contact-us
  - https://models.ai4bharat.org/#/tts

> Note: If a site sends `X-Frame-Options`/`CSP frame-ancestors` restrictions, the browser may block embedding.

## API

- `POST /chat` with `{"message": "Plan a 4-hour trip in Imphal with food"}`
- `GET /health` for service status.

- `POST /demo/trace` for full orchestrator debug output (intent + per-agent outputs).

- `POST /geo/context` with `{ "lat": 24.8170, "lng": 93.9368 }` to get nearest known place + culture/safety context (useful for Manipur/Imphal geo lookups).
