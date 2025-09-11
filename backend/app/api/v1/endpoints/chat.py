from fastapi import APIRouter, Depends, HTTPException
from app.schemas.chat_schemas import ChatRequest, ChatResponse
import google.generativeai as genai
from supabase import Client
from app.core.security import get_current_user
from app.api.deps.db import get_db
from app.core.config import settings

# Configura o Gemini
genai.configure(api_key=settings.ORACULO_GEMINI_API_KEY)

router = APIRouter()



# --- Endpoint ---


@router.post("/", response_model=ChatResponse)
def handle_chat(
    request: ChatRequest,
    db: Client = Depends(get_db),
    current_user_id: str = Depends(get_current_user)  # Garante a autenticação
):
    try:
        # 1. Gerar embedding para a pergunta
        question_embedding_response = genai.embed_content(
            model='models/text-embedding-004',
            content=request.question,
            task_type="RETRIEVAL_QUERY"
        )
        question_embedding = question_embedding_response['embedding']

        # 2. Buscar chunks relevantes no DB
        match_params = {
            'query_embedding': question_embedding,
            'p_workspace_id': request.workspace_id,
            'match_threshold': 0.2,
            'match_count': 5
        }
        matching_chunks_res = db.rpc(
            'match_document_chunks', match_params).execute()

        if not matching_chunks_res.data:
            return ChatResponse(answer="Desculpe, não encontrei informações relevantes nos documentos para responder a essa pergunta.")

        # 3. Construir o contexto e o prompt
        context_text = "\n\n".join([chunk['content']
                                   for chunk in matching_chunks_res.data])
        document_names = ", ".join(
            list(set([chunk['document_name'] for chunk in matching_chunks_res.data])))

        prompt = f"""
        Você é o Oráculo, um assistente de IA especialista em análise de documentos.
        Sua tarefa é responder à pergunta do usuário com base exclusivamente no contexto extraído dos seguintes documentos: {document_names}.
        Seja preciso, objetivo e sempre baseie sua resposta nos trechos de texto fornecidos.
        Se a informação não estiver no contexto, afirme claramente que não encontrou a resposta nos documentos analisados.

        **Contexto Extraído dos Documentos:**
        ---
        {context_text}
        ---

        **Pergunta do Usuário:**
        {request.question}

        **Sua Resposta:**
        """

        # 4. Gerar a resposta da IA
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)

        # 5. Salvar a conversa no banco de dados (usando as variáveis)
        messages_to_save = [
            {'role': 'user', 'content': request.question,
                'workspace_id': request.workspace_id, 'user_id': current_user_id},
            {'role': 'assistant', 'content': response.text,
                'workspace_id': request.workspace_id, 'user_id': current_user_id}
        ]
        db.table('chat_messages').insert(messages_to_save).execute()

        return ChatResponse(answer=response.text)

    except Exception as e:
        print(f"An error occurred during chat processing: {e}")
        raise HTTPException(
            status_code=500, detail="Ocorreu um erro ao processar sua pergunta.")
