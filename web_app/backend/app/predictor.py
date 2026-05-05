import joblib
import numpy as np
from app.config import MODEL_PATH

SCENARIO_FEATURES = {
    "micro_demand": [
        "region",
        "month_num",
        "day_num",
        "drink_category",
        "store_location_type",
        "order_channel",
    ],
    "daily_volume": [
        "region",
        "month_num",
        "day_num",
        "order_channel",
    ],
    "channel_choice": [
        "customer_age_group",
        "is_rewards_member",
        "order_hour",
        "region",
    ],
}

class MultiScenarioPredictor:
    def __init__(self):
        bundle = joblib.load(MODEL_PATH)
        self.models = bundle["models"]
        self.encoders = bundle["encoders"]
        self.feature_options = bundle["feature_options"]
        self.channel_target_encoder = bundle["channel_target_encoder"]

    def encode_value(self, scenario, column, value):
        scenario_encoders = self.encoders.get(scenario, {})

        if column == "is_rewards_member":
            return (value in ["True", "TRUE", 1])

        if column in scenario_encoders:
            encoder = scenario_encoders[column]

            if isinstance(value, str):
                value = value.strip()

            if value not in encoder.classes_:
                raise ValueError(
                    f"Unknown value '{value}' for '{column}' in scenario '{scenario}'. "
                    f"Allowed: {list(encoder.classes_)}"
                )

            return int(encoder.transform([value])[0])

        return value

    def encode_input(self, scenario, data):
        row = []
        for col in SCENARIO_FEATURES[scenario]:
            encoded_value = self.encode_value(scenario, col, data[col])
            print(f"[{scenario}] {col}: raw={data[col]} | encoded={encoded_value}")
            row.append(encoded_value)
        return np.array([row])

    def build_response(self, scenario, prediction):
        if scenario == "micro_demand":
            value = round(float(prediction), 2)
            if value < 10:
                level = "Low"
                insight = "Prepare a small batch and keep normal staffing."
            elif value < 30:
                level = "Medium"
                insight = "Prepare a moderate amount of ingredients and watch incoming orders."
            else:
                level = "High"
                insight = "Increase ingredient prep and consider extra staffing during peak periods."

            return {
                "scenario": scenario,
                "prediction_label": f"Predicted item demand ({level})",
                "prediction_value": str(value),
                "insight": insight,
            }

        if scenario == "daily_volume":
            value = round(float(prediction), 2)
            if value < 40:
                insight = "Expected store traffic is manageable with standard staffing."
            elif value < 80:
                insight = "Plan for a busier day and ensure ingredient availability."
            else:
                insight = "High daily volume expected. Consider stronger staffing and stock planning."

            return {
                "scenario": scenario,
                "prediction_label": "Predicted daily sales volume",
                "prediction_value": str(value),
                "insight": insight,
            }

        decoded = self.channel_target_encoder.inverse_transform([int(prediction)])[0]
        insight = (
            f"This customer segment is most likely to use {decoded}. "
            "Use this to optimize promotions and channel-specific campaigns."
        )
        return {
            "scenario": scenario,
            "prediction_label": "Most likely ordering channel",
            "prediction_value": str(decoded),
            "insight": insight,
        }
    
    def predict(self, data):
        scenario = data["scenario"]
        features = self.encode_input(scenario, data)
        prediction = self.models[scenario].predict(features)[0]
        return self.build_response(scenario, prediction)


predictor = MultiScenarioPredictor()