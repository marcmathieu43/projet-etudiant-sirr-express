'use client';

import { useParams, useRouter } from 'next/navigation';
import { contexteTransmissionCle } from '../../../context/SecureContext';
import { useEffect, useRef } from 'react';

import { PARTIE1ConversationHeader } from './affichage/PARTIE1ConversationHeader';
import { PARTIE2ConversationInfo } from './affichage/PARTIE2ConversationInfo';
import { PARTIE3Messages } from './affichage/PARTIE3Messages';
import { PARTIE4InputClient} from './affichage/PARTIE4InputClient';

import { fontionsConversation } from './fonctions/fonctionsConversation';
import { formatDate, formatDateMessage } from './fonctions/fonctionsDate';

export default function ConversationPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { cleBrute } = contexteTransmissionCle();
  

  const {
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
    
    setAffichageReponseRag,
    affichageReponseRag
  } = fontionsConversation(id, cleBrute);

  useEffect(() => {
    document.body.style.overflow = 'auto'; 
  }, []);

  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
 {/*useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesDechiffres]); */}
  

  useEffect(() => {
    if (!cleBrute) {
      router.replace('/');
    }
  }, [cleBrute, router]);

  if (!cleBrute) return <p>Redirection...</p>;

  return (
    <div className="nata-sans-regular" style={{background: 'var(--background-cle)', width:'100%'}}>
      <PARTIE1ConversationHeader id={id} />

      {conversationCaracteristiques ? (
        <PARTIE2ConversationInfo 
          conversation={conversationCaracteristiques} 
          formatDate={formatDate} 
        />
      ) : (
        <div>Chargement des données...</div>
      )}

      <div style={{paddingBottom: '10rem', maxWidth: '50rem', margin:'auto', minHeight: '100vh'}}>
      <PARTIE3Messages 
        messagesExtraitsDechiffres={messagesDechiffres}
        formatDateMessage={formatDateMessage}
      />
      </div>

      <PARTIE4InputClient
        id={id}
        messageClient={messageClient}
        setMessageClient={setMessageClient}
        envoiMessageServeur={envoiMessageServeur}
        poserQuestion={poserQuestion}
        ragReponse={ragReponse}      
        ragMessages={ragMessages} 
        bulleInfoRag={bulleInfoRag}               
        setBulleInfoRag={setBulleInfoRag}  
        question={question}           
        setQuestion={setQuestion}
        questionDiv={questionDiv}
        setQuestionDiv={setQuestionDiv}
        loadingQuestion={loadingQuestion}
        setLoadingQuestion={setLoadingQuestion}
        affichageReponseRag={affichageReponseRag}
        setAffichageReponseRag={setAffichageReponseRag}
      />

    </div>
  );
}