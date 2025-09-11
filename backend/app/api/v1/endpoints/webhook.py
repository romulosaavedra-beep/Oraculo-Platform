
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, Any

from app.tasks import process_document

router = APIRouter()

class SupabaseWebhookPayload(BaseModel):
    type: str
    table: str
    record: Dict[str, Any]
    schema_name: str = Field(..., alias='schema')
    old_record: Dict[str, Any] | None = None


@router.post("/process-document", status_code=200)
async def handle_document_insert(payload: SupabaseWebhookPayload):
    """
    This endpoint is called by a Supabase webhook when a new row is inserted
    into the 'documents' table. It triggers the Celery task to process the document.
    """
    if payload.type == 'INSERT' and payload.table == 'documents':
        document_id = payload.record.get('id')
        
        if not document_id:
            raise HTTPException(status_code=400, detail="Document ID not found in webhook payload.")
            
        print(f"Webhook received for new document. Enqueuing processing for document_id: {document_id}")
        
        # Enqueue the Celery task
        process_document.delay(document_id)
        
        return {"message": "Document processing enqueued."}
        
    return {"message": "Webhook received, but no action taken."}
