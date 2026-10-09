import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "nexus_sc.db"

class Settings:
    PROJECT_NAME: str = "NEXUS — AI Supply Chain Future Simulation & Resilience Engine"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
    SYNTHETIC_DATA_BANNER: str = "DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA"
    CURRENCY_SYMBOL: str = "₹"
    CURRENCY_CODE: str = "INR"
    DEFAULT_PLANNING_HORIZON_DAYS: int = 7
    RANDOM_SEED: int = 42

settings = Settings()
