import grpc
from concurrent import futures
import time
import faiss
import numpy as np

from mistralai import Mistral
from proto import poserQuestion_pb2, poserQuestion_pb2_grpc

from getpass import getpass
cle_api = " "
client = Mistral(api_key=cle_api)


messages_conversation = []
messages_embedding = []
index = None  


def transformation_messages_embedding(text):
    response = client.embeddings.create(
        model="mistral-embed",
        inputs=[text]
    )
    return np.array(response.data[0].embedding, dtype=np.float32)


def maj_index():
    global index
    if not messages_embedding:
        return
    d = len(messages_embedding[0])
    index = faiss.IndexFlatL2(d)
    index.add(np.array(messages_embedding))


def rechercher_messages_similaires(question, k=1, max_distance=1.0):
    

    if index is None or not messages_conversation:
        return []

    k = min(k, len(messages_conversation))
    q_emb = transformation_messages_embedding(question).reshape(1, -1)
    distances, indices = index.search(q_emb, k)

    messages_resultats = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx >= len(messages_conversation):
            continue 
        if dist <= max_distance:
            msg = messages_conversation[idx].copy()
            msg['distance'] = dist
            messages_resultats.append(msg)
            

            if idx < len(messages_conversation)-1:
                message_suivant = messages_conversation[idx+1].copy()
                message_suivant['distance'] = dist + 0.01
                messages_resultats.append(message_suivant)

                

    return messages_resultats  



def demande_reponse_mistral(question, context_messages):
    context_text = "\n".join([f"[{m['id']}] {m['content']}" for m in context_messages])
    prompt = f"""
                Tu es un assistant intelligent qui répond aux questions en se basant sur le contexte fourni.
                Voici le contexte :
                ---------------------
                {context_text}
                ---------------------
                En te basant sur les infos ci dessous, reponds a la question.
                Question: {question}
                Réponds de manière concise et précise.
                """

    response = client.chat.complete(
        model="mistral-large-latest",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


class TokenServiceServicer(poserQuestion_pb2_grpc.TokenServiceServicer):
    def PoserQuestion(self, request, context):
        
        id_deja_stockes = {m["id"] for m in messages_conversation}

        for msg in request.messages:
            if msg.id not in id_deja_stockes:
                messages_conversation.append({"id": msg.id, "content": msg.content})

                emb = transformation_messages_embedding(msg.content)
                messages_embedding.append(emb)

                id_deja_stockes.add(msg.id) 

        maj_index()

        question = request.question
        
        
        messages_similaires = rechercher_messages_similaires(question, k=1, max_distance=1.0)

        response_text = demande_reponse_mistral(question, messages_similaires)


        if ("impossible" in response_text.lower()):
        
            messages_similaires_tout = rechercher_messages_similaires(question, k=2, max_distance=1.0)
            messages_similaires = messages_similaires_tout[-2:]
            response_text = demande_reponse_mistral(question, messages_similaires)



        messages_recuperes_proto = [
            poserQuestion_pb2.Message(id=m['id'], content=m['content'])
            for m in messages_similaires
        ]

        return poserQuestion_pb2.PoserQuestionResponse(
            retrieved_messages=messages_recuperes_proto,
            reply=response_text
        )



def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    poserQuestion_pb2_grpc.add_TokenServiceServicer_to_server(TokenServiceServicer(), server)
    server.add_insecure_port('[::]:50054')
    server.start()
    print("6-RAG rag-ctn 50054")
    
    try:
        while True:
            time.sleep(800000000)
    except KeyboardInterrupt:
        server.stop(0)

serve()
