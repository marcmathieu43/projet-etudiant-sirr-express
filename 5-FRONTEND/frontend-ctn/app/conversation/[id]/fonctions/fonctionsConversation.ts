import { useState, useEffect } from 'react';
import { Conversation, Message } from '../types';
import { chiffrerTexte, genererNonce, dechiffrerTexte, base64VersCleBrute } from '../../../../modules/fonctionsCryptage';

export function fontionsConversation(id: string, cleBrute: Uint8Array | null) {
  const [conversationCaracteristiques, setConversationCaracteristiques] = useState<Conversation | null>(null);
  
  const [messageCaracteristiques, setMessageCaracteristiques] = useState<Message[]>([]);
  
  const [messagesWs, setMessagesWs] = useState<Message[]>([]);
  const [messagesDechiffres, setMessagesDechiffres] = useState<Message[]>([]);
  const [messageClient, setMessageClient] = useState<string>(''); 

  const [ragReponse, setRagReponse] = useState<string | null>(null);
  const [ragMessages, setRagMessages] = useState<{ id: string, content: string }[]>([]);


  const [bulleInfoRag, setBulleInfoRag] = useState(true);       
  const [questionDiv, setQuestionDiv] = useState(false);

  const [question, setQuestion] = useState("");

  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const [affichageReponseRag, setAffichageReponseRag] = useState(true); 




  const allMessages = [...messageCaracteristiques, ...messagesWs];

  
  useEffect(() => {
    const recuperationConversationCaracteristiques = async () => {
      if (!cleBrute) return;

      try {
        const res = await fetch('/api/crud/get-conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();
        
        setConversationCaracteristiques({
          id: data.conversation.id,
          date_creation: data.conversation.date_creation,
          date_expiration: data.conversation.date_expiration,
          nb_message: data.conversation.nb_message,
          acces_occured: data.conversation.acces_occured,
          nb_vues_message_default: data.conversation.nb_vues_message_default,
        });
      } catch (err) {
        console.error('la conv pas récupérée ', err);
      }
    };

    recuperationConversationCaracteristiques();
  }, [cleBrute, id]);

  
  useEffect(() => {
    const recuperationMessagesConversation = async () => {
      if (!cleBrute) return;

      try {
        const res = await fetch('/api/messages/get-all-messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversationId: id }),
        });

        const data = await res.json();

        if (!data.messages || data.messages.length === 0) return;

        

        const tableauMessages: Message[] = data.messages.map((msg: any) => ({
          id: msg.id,
          conversation_id: msg.conversation_id,
          content: msg.content,
          nonce: msg.nonce,
          tag_element: msg.tag_element,
          created_at: msg.created_at,
          vues_message: msg.vues_message,
          lien: msg.lien, 
        }));

        setMessageCaracteristiques(tableauMessages);
        
      } catch (err) {
        console.error('messages pas récupérés', err);
      }
    };

    recuperationMessagesConversation();
  }, [cleBrute, id]);

  
  useEffect(() => {
    const socket = new WebSocket(`wss://api.sirr.express/ws?user=${id}`);

    socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data);
        setMessagesWs((prev) => [...prev, data]);
      } catch (e) {
        console.error("connexion ws erreur", e, event.data);
      }
    };

    return () => socket.close();
  }, [id]);

  
  
  useEffect(() => {
    const dechiffrerTous = async () => {
      if (!cleBrute || allMessages.length === 0) return;

      try {
        const result = await Promise.all(
          allMessages.map(async (msg) => {
            try {
              if (!msg.content || !msg.nonce) throw new Error("non");

              const nonce = base64VersCleBrute(msg.nonce);

              const texteDechiffre = await dechiffrerTexte({
                texteChiffreBase64: msg.content,
                cleBrute,
                nonce,
              });

              return { ...msg, content: texteDechiffre };
            } catch (err) {
              console.warn("le message pas déchiffré:", err, msg);
              return { ...msg, content: "..." };
            }
          })
        );

        
        setMessagesDechiffres(result);

      } catch (err) {
        console.error("ça déchiffre pas", err);
        setMessagesDechiffres([]);
      }
    };

    dechiffrerTous();
  }, [allMessages, cleBrute]);


  
  const recupererCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const envoiMessageServeur = async () => {
    if (!messageClient.trim() || !cleBrute) return;

    const lien = recupererCookie('user_token');


    const tag_element = 'message';
    const { nonceBrut, nonceBase64 } = genererNonce();

    const texteChiffré = await chiffrerTexte({
      texteClair: messageClient,
      cleBrute: cleBrute,
      nonce: nonceBrut
    });

    try {

      
      const res = await fetch('/api/messages/post-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: id,
          content: texteChiffré,
          nonce: nonceBase64,
          tag_element: tag_element,
          created_at: new Date().toISOString(),
          lien: lien,
        }),
      });

      const data = await res.json();
      console.log('Message répondu:', data);

      
      await fetch('/api/cookies/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'dernierMessageUser',
          value: data.id
        }),
      });

      setMessageClient('');
    } catch (err) {
      console.error('erreur lors de l\'envoi du message:', err);
    }
  };


  const poserQuestion = async (q: string) => {
    if (!messagesDechiffres.length) return;

    try {
      const res = await fetch('/api/rag/poser-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: id,
          messages: messagesDechiffres.map((msg) => ({
            id: msg.id,
            content: msg.content,
          })),
          question: q, 
        }),
      });

      const data = await res.json();
      

      setRagMessages(data.retrieved_messages || []);
      setRagReponse(data.reply || null);

    } catch (err) {
      console.error('rag ne marche pas', err);
    }
  };



  return {
    conversationCaracteristiques,
    messagesDechiffres,
    messageClient,
    setMessageClient,
    envoiMessageServeur,
    poserQuestion,
    ragReponse,
    ragMessages,
    setBulleInfoRag,
    bulleInfoRag,
    setQuestion,
    question,
    setQuestionDiv,
    questionDiv,
    setLoadingQuestion,
    loadingQuestion,
    affichageReponseRag,
    setAffichageReponseRag
  };

}

