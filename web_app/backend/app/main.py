from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PredictionInput, PredictionOutput
from app.predictor import predictor

app = FastAPI(title="F&B Multi-Scenario Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "F&B Multi-Scenario Prediction API is running"}

@app.get("/options")
def get_options():
    return predictor.feature_options


@app.post("/predict", response_model=PredictionOutput)
def predict(payload: PredictionInput):
    try:
        return predictor.predict(payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(exc)}")