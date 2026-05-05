# from pydantic import BaseModel, Field


# class PredictionInput(BaseModel):
#     region: str = Field(..., example="West")
#     month_num: int = Field(..., ge=1, le=12, example=7)
#     day_num: int = Field(..., ge=1, le=7, example=6)
#     drink_category: str = Field(..., example="Frappuccino")
#     store_location_type: str = Field(..., example="Drive-Thru")
#     order_channel: str = Field(..., example="Mobile App")


# class PredictionOutput(BaseModel):
#     predicted_demand: float
#     demand_level: str
#     recommendation: str

from typing import Literal, Optional
from pydantic import BaseModel, Field, model_validator


ScenarioType = Literal["micro_demand", "daily_volume", "channel_choice"]


class PredictionInput(BaseModel):
    scenario: ScenarioType

    # Scenario 1 + 2 shared
    region: Optional[str] = None
    month_num: Optional[int] = Field(default=None, ge=1, le=12)
    day_num: Optional[int] = Field(default=None, ge=1, le=7)
    order_channel: Optional[str] = None

    # Scenario 1 only
    drink_category: Optional[str] = None
    store_location_type: Optional[str] = None

    # Scenario 3 only
    customer_age_group: Optional[str] = None
    is_rewards_member: Optional[str] = None
    order_hour: Optional[int] = Field(default=None, ge=0, le=23)

    @model_validator(mode="after")
    def validate_by_scenario(self):
        required_fields = {
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
    
        missing = [
            field_name
            for field_name in required_fields[self.scenario]
            if getattr(self, field_name) in (None, "")
        ]

        if missing:
            raise ValueError(
                f"Missing required fields for scenario '{self.scenario}': {', '.join(missing)}"
            )

        return self


class PredictionOutput(BaseModel):
    scenario: ScenarioType
    prediction_label: str
    prediction_value: str
    insight: str