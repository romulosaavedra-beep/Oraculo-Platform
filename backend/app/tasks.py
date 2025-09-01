'''
Celery tasks for the Oraculo backend.

This module defines the asynchronous tasks that will be executed by the Celery worker.
The main task is `process_document`, which handles the entire pipeline of
downloading, parsing, chunking, embedding, and storing a document.
'''

import os
import fitz  # PyMuPDF
import google.generativeai as genai
from supabase import create_client, Client
from dotenv import load_dotenv

from .celery_instance import celery_app

# The worker now handles loading the .env file, so we just need to ensure
# the environment is loaded when tasks are potentially run or imported elsewhere.
load_dotenv()


# --- Supabase & Gemini Initialization ---
# It's better to initialize clients inside the task to ensure that
# each task runs with its own fresh client instances, which is safer
# in a distributed environment.

def get_supabase_client() -> Client:
    '''Creates and returns a Supabase client instance.'''
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in environment variables.")
    return create_client(url, key)


def configure_gemini():
    '''Configures the Google Gemini API.'''
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY must be set in environment variables.")
    genai.configure(api_key=api_key)


# --- Text Processing Functions ---

def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> list[str]:
    '''Splits a long text into smaller chunks with a specified overlap.'''
    if not text:
        return []
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - chunk_overlap
        if start >= len(text):
            break
    return chunks


# --- Main Celery Task ---

@celery_app.task
def process_document(document_id: int):
    '''
    Celery task to process a single document.

    Args:
        document_id: The ID of the document to process from the 'documents' table.
    '''
    supabase = get_supabase_client()
    configure_gemini()

    try:
        # 1. Fetch the document record
        print(f"Processing document_id: {document_id}")
        doc_res = supabase.table('documents').select('*').eq('id', document_id).single().execute()
        if not doc_res.data:
            raise ValueError(f"Document with id {document_id} not found.")
        
        document = doc_res.data
        file_path = document.get('file_path')
        workspace_id = document.get('workspace_id')

        if not file_path or not workspace_id:
            raise ValueError("Document record is missing file_path or workspace_id.")

        # Update status to PROCESSING
        supabase.table('documents').update({'status': 'PROCESSING'}).eq('id', document_id).execute()

        # 2. Download the file from Supabase Storage
        print(f"Downloading file: {file_path}")
        file_content = supabase.storage.from_('workspaces_data').download(file_path)
        if not file_content:
            raise RuntimeError(f"Failed to download file from storage: {file_path}")

        # 3. Use pymupdf to extract text
        print("Extracting text from PDF...")
        pdf_document = fitz.open(stream=file_content, filetype="pdf")
        
        chunks_to_insert = []
        for page_num, page in enumerate(pdf_document):
            page_text = page.get_text()
            if not page_text.strip():
                continue

            # 4. Divide the text into chunks
            text_chunks = chunk_text(page_text)

            for chunk in text_chunks:
                # 5. Generate embedding for each chunk
                embedding_response = genai.embed_content(
                    model='models/text-embedding-004',
                    content=chunk,
                    task_type="RETRIEVAL_DOCUMENT",
                    title=f"Chunk from {document.get('name', 'document')}"
                )
                embedding = embedding_response['embedding']

                # Prepare data for insertion
                chunks_to_insert.append({
                    'document_id': document_id,
                    'workspace_id': workspace_id,
                    'content': chunk,
                    'embedding': embedding,
                    'metadata': {'page_number': page_num + 1}
                })
        
        pdf_document.close()

        # 6. Insert all chunks into the database
        if chunks_to_insert:
            print(f"Inserting {len(chunks_to_insert)} chunks into the database...")
            supabase.table('document_chunks').insert(chunks_to_insert).execute()

        # 7. Update document status to COMPLETED
        print("Processing complete. Updating status to COMPLETED.")
        supabase.table('documents').update({'status': 'COMPLETED'}).eq('id', document_id).execute()

    except Exception as e:
        print(f"Error processing document {document_id}: {e}")
        # Update document status to FAILED
        supabase.table('documents').update({'status': 'FAILED'}).eq('id', document_id).execute()
        # Re-raise the exception to let Celery know the task failed
        raise
