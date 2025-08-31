'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { desassembleTokenBase64 } from '../../modules/fonctionsCryptage';

type Etape2Components = {
  cleGlobale: string;
  chargement: boolean;
};

export default function Etape2RecuperationCle({ cleGlobale, chargement }: Etape2Components) {
  
  const router = useRouter();
  const [popupVisible, setPopupVisible] = useState(false);

  const accesConversation = () => {
    const resultat = desassembleTokenBase64(cleGlobale);
    const conversationId = resultat.id;
    

    router.push(`/conversation/${conversationId}`);
  };

  const copierCle = async () => {
    try {
      await navigator.clipboard.writeText(cleGlobale);
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 2000);
    } catch (err) {
      console.error("la clé ne s'est pas copiés :", err);
    }
  };

  return (
    <div className="nata-sans-regular" style={{ padding: '2rem', margin:'auto', maxWidth:'60rem', display:'grid' }}>
      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Voici votre clé secrète</h2>
          <span style={{ fontSize: '1rem', fontWeight: 'bold', fontStyle: 'italic' }}>
            Attention, cette clé secrète n'est visible qu'une seule fois. Il faut bien la noter.
          </span>
          <div
            style={{
              margin: '2.5rem 0',
              padding: '1rem',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              wordBreak: 'break-all', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{cleGlobale}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}
                aria-label="Clé secrète"
              >
                key
              </span>
              <button
                onClick={copierCle}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Copier la clé"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                  content_copy
                </span>
              </button>
            </div>
          </div>
          
          <button onClick={accesConversation} style={{padding:'.75rem', backgroundColor:'#8fc898', margin:'auto', borderRadius: '9999px', cursor: 'pointer', marginTop:'1rem', fontWeight:'bold' }}>
            Accéder à la conversation
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginLeft: '0.5rem' }}
              aria-label="Déverrouiller la conversation"
            >
              lock_open_right
            </span>
          </button>
          {popupVisible && (
            <div
              style={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                backgroundColor: '#60686c6e',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                zIndex: 1000,
                fontWeight: 'bold',
              }}
            >
              Clé copiée !
            </div>
          )}
        </>
      )}
    </div>
  );
}
