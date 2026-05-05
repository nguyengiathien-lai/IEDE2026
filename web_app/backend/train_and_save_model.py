import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "starbucks_customer_ordering_patterns.csv"
OUTPUT_PATH = BASE_DIR / "model" / "model_bundle.pkl"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)


def fit_label_encoder(series):
    encoder = LabelEncoder()
    encoded = encoder.fit_transform(series.astype(str))
    return encoded, encoder


def encode_columns(df, columns):
    encoded_df = df.copy()
    encoders = {}

    for col in columns:
        if not pd.api.types.is_numeric_dtype(encoded_df[col]):
            encoded_df[col], encoders[col] = fit_label_encoder(encoded_df[col])

    return encoded_df, encoders


def main():
    df_raw = pd.read_csv(DATA_PATH)
    df_raw["order_date"] = pd.to_datetime(df_raw["order_date"])
    df_raw["month_num"] = df_raw["order_date"].dt.month
    df_raw["order_hour"] = pd.to_datetime(df_raw["order_time"], format="%H:%M").dt.hour

    day_map = {"Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 7}
    df_raw["day_num"] = df_raw["day_of_week"].map(day_map)

    # Scenario 1: Micro-demand
    s1_cols = [
        "region",
        "month_num",
        "day_num",
        "drink_category",
        "store_location_type",
        "order_channel",
    ]

    df_s1 = df_raw.groupby(s1_cols).size().reset_index(name="order_quantity")
    X1, enc_s1 = encode_columns(df_s1[s1_cols], s1_cols)
    y1 = df_s1["order_quantity"]
    X1_train, X1_test, y1_train, y1_test = train_test_split(X1, y1, test_size=0.2, random_state=42)
    model_s1 = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)
    model_s1.fit(X1_train, y1_train)
    print(f"Scenario 1 MAE: {mean_absolute_error(y1_test, model_s1.predict(X1_test)):.2f}")

    # Scenario 2: Daily volume
    s2_cols = ["region", "month_num", "day_num", "order_channel"]
    df_s2 = df_raw.groupby(s2_cols).size().reset_index(name="daily_volume")
    X2, enc_s2 = encode_columns(df_s2[s2_cols], s2_cols)
    y2 = df_s2["daily_volume"]
    X2_train, X2_test, y2_train, y2_test = train_test_split(X2, y2, test_size=0.2, random_state=42)
    model_s2 = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42)
    model_s2.fit(X2_train, y2_train)
    print(f"Scenario 2 R2: {r2_score(y2_test, model_s2.predict(X2_test)):.4f}")

    sample_check = df_s2[
        (df_s2["region"] == "Northeast") &
        (df_s2["month_num"] == 12) &
        (df_s2["day_num"] == 1) &
        (df_s2["order_channel"] == "Mobile App")
    ]

    print("=== SAMPLE CHECK ===")
    print(sample_check)

    row = []
    test_row = {
        "region": "Northeast",
        "month_num": 12,
        "day_num": 1,
        "order_channel": "Mobile App",
    }

    for col in s2_cols:
        value = test_row[col]
        if col in enc_s2:
            value = int(enc_s2[col].transform([value])[0])
        row.append(value)

    pred_test = model_s2.predict(np.array([row], dtype=float))[0]
    print("Manual Model 2 prediction:", pred_test)

    # Scenario 3: Channel choice
    s3_cols = ["customer_age_group", "is_rewards_member", "order_hour", "region"]
    X3_raw = df_raw[s3_cols].copy()
    X3, enc_s3 = encode_columns(X3_raw, s3_cols)
    y3_encoder = LabelEncoder()
    y3 = y3_encoder.fit_transform(df_raw["order_channel"].astype(str))

    X3_train, X3_test, y3_train, y3_test = train_test_split(X3, y3, test_size=0.2, random_state=42)
    model_s3 = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model_s3.fit(X3_train, y3_train)
    print(f"Scenario 3 Accuracy: {accuracy_score(y3_test, model_s3.predict(X3_test)):.4f}")

    # Merge encoders without duplicating same feature name
    encoders = {}
    for encoder_group in [enc_s1, enc_s2, enc_s3]:
        for key, value in encoder_group.items():
            if key not in encoders:
                encoders[key] = value

    feature_options = {
        "region": sorted(df_raw["region"].astype(str).unique().tolist()),
        "month_num": list(range(1, 13)),
        "day_num": list(range(1, 8)),
        "drink_category": sorted(df_raw["drink_category"].astype(str).unique().tolist()),
        "store_location_type": sorted(df_raw["store_location_type"].astype(str).unique().tolist()),
        "order_channel": sorted(df_raw["order_channel"].astype(str).unique().tolist()),
        "customer_age_group": sorted(df_raw["customer_age_group"].astype(str).unique().tolist()),
        "is_rewards_member": sorted(df_raw["is_rewards_member"].astype(str).unique().tolist()),
        "order_hour": sorted(df_raw["order_hour"].astype(int).unique().tolist()),
    }

    # joblib.dump(
    #     {
    #         "models": {
    #             "micro_demand": model_s1,
    #             "daily_volume": model_s2,
    #             "channel_choice": model_s3,
    #         },
    #         "encoders": encoders,
    #         "feature_options": feature_options,
    #         "channel_target_encoder": y3_encoder,
    #     },
    #     OUTPUT_PATH,
    # )

    joblib.dump(
    {
        "models": {
            "micro_demand": model_s1,
            "daily_volume": model_s2,
            "channel_choice": model_s3,
        },
        "encoders": {
            "micro_demand": enc_s1,
            "daily_volume": enc_s2,
            "channel_choice": enc_s3,
        },
        "feature_options": feature_options,
        "channel_target_encoder": y3_encoder,
    },
    OUTPUT_PATH,
)

    print(f"Saved multi-scenario model bundle to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()