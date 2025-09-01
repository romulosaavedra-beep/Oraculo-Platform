# backend/app/worker.py
from .celery_instance import celery_app
import app.tasks
