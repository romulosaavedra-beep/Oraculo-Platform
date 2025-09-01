from dotenv import load_dotenv

import os
import time
import select
import psycopg2
import psycopg2.extensions
# Import the Celery app instance from the new central location
from app.celery_instance import celery_app


def get_db_connection():
    """Establishes and returns a connection to the PostgreSQL database."""
    # Load environment variables from .env file in the backend directory
    dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    load_dotenv(dotenv_path=dotenv_path)

    try:
        # Connect using the DATABASE_URL environment variable
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        conn.set_isolation_level(
            psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        print("Database connection established successfully.")
        return conn
    except psycopg2.OperationalError as e:
        print(f"Error connecting to the database: {e}")
        # Retry connection after a delay
        time.sleep(10)
        raise


def listen_for_notifications():
    """Listens for notifications on a PostgreSQL channel and dispatches Celery tasks."""
    conn = get_db_connection()
    cursor = conn.cursor()

    channel_name = 'new_document_channel'
    cursor.execute(f"LISTEN {channel_name}")
    print(f"Waiting for notifications on channel: {channel_name}...")

    try:
        while True:
            # Use select to wait for notifications without blocking indefinitely
            if select.select([conn], [], [], 60) == ([], [], []):
                # print("Timeout: No notification received in the last 60 seconds. Still listening...")
                continue

            conn.poll()
            while conn.notifies:
                notification = conn.notifies.pop(0)
                print(
                    f"\nReceived notification: PID={notification.pid}, Channel='{notification.channel}'")

                try:
                    # The payload is the document_id
                    document_id = int(notification.payload)
                    print(
                        f"Extracted document_id: {document_id}. Dispatching task...")

                    # Dispatch the Celery task using the shared app instance
                    celery_app.send_task(
                        'app.tasks.process_document', args=[document_id])

                    print(
                        f"Task for document_id {document_id} dispatched successfully.")
                except (ValueError, TypeError) as e:
                    print(
                        f"Error processing notification payload '{notification.payload}': {e}")

    except KeyboardInterrupt:
        print("Listener stopped by user.")
    finally:
        print("Closing database connection.")
        cursor.close()
        conn.close()


if __name__ == "__main__":
    print("Starting database notification listener...")
    while True:
        try:
            listen_for_notifications()
        except (psycopg2.OperationalError, psycopg2.InterfaceError) as e:
            print(f"Connection lost: {e}. Reconnecting in 10 seconds...")
            time.sleep(10)
        except Exception as e:
            print(
                f"An unexpected error occurred: {e}. Restarting in 10 seconds...")
            time.sleep(10)
