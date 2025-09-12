# backend/app/tasks.py
'''
Celery tasks for the Oraculo backend.
'''

import os
import fitz  # PyMuPDF
import google.generativeai as genai
from supabase import create_client, Client
from dotenv import load_dotenv

from .celery_instance import celery_app
from .core.config import settings # Importa as configurações centralizadas

load_dotenv()

# --- Supabase & Gemini Initialization ---

def get_supabase_client() -> Client:
    '''Creates and returns a Supabase client instance.'''
    # Usa as configurações do config.py para consistência
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

def configure_gemini():
    '''Configures the Google Gemini API.'''
    # Usa a variável de ambiente correta do config.py
    genai.configure(api_key=settings.ORACULO_GEMINI_API_KEY)

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
    return chunks

# --- Main Celery Task ---

@celery_app.task
def process_document(document_id: int):
    '''
    Celery task to process a single document.
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
        # CORREÇÃO 1: Extrai o user_id
        user_id = document.get('user_id')
        file_path = document.get('path')
        workspace_id = document.get('workspace_id')

        # CORREÇÃO 2: Adiciona user_id à verificação
        if not file_path or not workspace_id or not user_id:
            raise ValueError("Document record is missing path, workspace_id, or user_id.")

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
            
            text_chunks = chunk_text(page_text)

            for chunk in text_chunks:
                # Adiciona verificação de qualidade do chunk
                if len(chunk.strip()) > 10:
                    embedding_response = genai.embed_content(
                        model='models/text-embedding-004',
                        content=chunk,
                        task_type="RETRIEVAL_DOCUMENT",
                        title=f"Chunk from {document.get('name', 'document')}"
                    )
                    embedding = embedding_response['embedding']

                    # CORREÇÃO 3: Adiciona o user_id ao chunk
                    chunks_to_insert.append({
                        'document_id': document_id,
                        'workspace_id': workspace_id,
                        'user_id': user_id,
                        'content': chunk,
                        'embedding': embedding,
                        'metadata': {'page_number': page_num + 1}
                    })
        
        pdf_document.close()

        # 6. Insert all chunks in batches
        if chunks_to_insert:
            print(f"Inserting {len(chunks_to_insert)} chunks in batches...")
            batch_size = 20 # Tamanho do lote
            for i in range(0, len(chunks_to_insert), batch_size):
                batch = chunks_to_insert[i:i + batch_size]
                print(f"  Inserting batch {i//batch_size + 1}...")
                supabase.table('document_chunks').insert(batch).execute()

        # 7. Update document status to COMPLETED
        print("Processing complete. Updating status to COMPLETED.")
        supabase.table('documents').update({'status': 'COMPLETED'}).eq('id', document_id).execute()

    except Exception as e:
        print(f"Error processing document {document_id}: {e}")
        supabase.table('documents').update({'status': 'FAILED'}).eq('id', document_id).execute()
        raise