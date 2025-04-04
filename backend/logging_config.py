import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Read logging configurations from .env
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
LOG_FILE = os.getenv("LOG_FILE", "app.log")
LOG_FORMAT = os.getenv("LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s")

def setup_logger(name: str):
    """Creates a logger with the given name."""
    
    logger = logging.getLogger(name)
    logger.setLevel(LOG_LEVEL)

    # Create handlers
    file_handler = logging.FileHandler(LOG_FILE)
    stream_handler = logging.StreamHandler()

    # Set formatter
    formatter = logging.Formatter(LOG_FORMAT)
    file_handler.setFormatter(formatter)
    stream_handler.setFormatter(formatter)

    # Add handlers
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)

    return logger
