import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent / "model" / "model_bundle.pkl"

bundle = joblib.load(MODEL_PATH)

model = bundle["models"]["daily_volume"]
encoders = bundle["encoders"]["daily_volume"]

sample = {
    "region": "Northeast",
    "month_num": 12,
    "day_num": 1,
    "order_channel": "Mobile App",
}

feature_order = ["region", "month_num", "day_num", "order_channel"]

row = []
for col in feature_order:
    value = sample[col]
    if col in encoders:
        print(f"{col} classes: {list(encoders[col].classes_)}")
        encoded = int(encoders[col].transform([value])[0])
        print(f"{col}: raw={value} -> encoded={encoded}")
        row.append(encoded)
    else:
        print(f"{col}: raw={value} -> numeric={value}")
        row.append(value)

X = np.array([row], dtype=float)
print("Final input row:", X)

pred = model.predict(X)[0]
print("Prediction:", pred)