import os
from celery import Celery
from dotenv import load_dotenv

# Load environment variables from the .env file in the backend directory
# This ensures that the worker can access environment variables when run from the project root.
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Define the Celery application instance
# The first argument is the name of the current module, used for naming tasks.
# The `include` argument is a list of modules to import when the worker starts.
celery_app = Celery(
    'oraculo_worker',
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"),
    include=['app.tasks']
)

# Optional Celery configuration
celery_app.conf.update(
    task_track_started=True,
    broker_connection_retry_on_startup=True,
)

if __name__ == '__main__':
    # This allows running the worker directly for development
    # Command: python -m app.worker worker --loglevel=info
    celery_app.start()
