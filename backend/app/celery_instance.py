# backend/app/celery_instance.py
from celery import Celery
import os
from dotenv import load_dotenv
load_dotenv()


# Define a instância centralizada da aplicação Celery
celery_app = Celery(
    'oraculo_worker',
    broker=os.getenv('CELERY_BROKER_URL'),
    backend=os.getenv('CELERY_RESULT_BACKEND'),
)

# Configurações opcionais do Celery
celery_app.conf.update(
    task_track_started=True,
    broker_connection_retry_on_startup=True,
)
