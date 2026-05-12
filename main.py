from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from orchestrator import Orchestrator

app = FastAPI(title="Northeast Region Impact Agent")
app.mount("/static", StaticFiles(directory="static"), name="static")
engine = Orchestrator()


class ChatRequest(BaseModel):
    message: str
    user_id: str = "anonymous"


class GeoRequest(BaseModel):
    lat: float
    lng: float


@app.get("/", response_class=HTMLResponse)
def root() -> str:
    return open("templates/index.html", "r", encoding="utf-8").read()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ne-region-impact-agent"}


@app.post("/chat")
def chat(req: ChatRequest) -> dict:
    return {"reply": engine.handle_message(req.message), "status": "ok"}


@app.post("/demo/trace")
def demo_trace(req: ChatRequest) -> dict:
    reply, trace = engine.process(req.message)
    return {"reply": reply, "trace": trace.__dict__, "status": "ok"}


@app.post("/geo/context")
def geo_context(req: GeoRequest) -> dict:
    return {"status": "ok", "data": engine.geo_context(req.lat, req.lng)}
