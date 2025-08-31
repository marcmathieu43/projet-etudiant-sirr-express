'use client'

import React, { useState } from 'react'
import Etape1Parametrage from './creation-conversation/Etape1Parametrage'
import Etape2RecuperationCle from './creation-conversation/Etape2RecuperationCle'

import { contexteTransmissionCle } from '../context/SecureContext';
import { useRouter } from 'next/navigation';
import { genererCle, base64VersCleBrute, assembleTokenBase64, desassembleTokenBase64  } from '../modules/fonctionsCryptage'

type Page = 'main' | 'conversation-parametres' | 'affichage-cle'

export default function PageAccueil() {
  const [page, setPage] = useState<Page>('main')

  const [dureeVie, setDureeVie] = useState<number>(1)
  const [nbVuesMessageDefault, setNbVuesMessageDefault] = useState<number>(2)

  const [chargement, setChargement] = useState<boolean>(false)
  const [idConversation, setIdConversation] = useState<string>('')
  const [cleAes, setCleAes] = useState<string>('')
  const [cleGlobale, setCleGlobale] = useState<string>('')

  const { setCleBrute, setCleBase64 } = contexteTransmissionCle();
  const router = useRouter();

  const [error, setError] = React.useState(false);
  

  const [inputValue, setInputValue] = useState('')

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  

  const retourPageAccueil = () => {
    setPage('main');
    document.body.style.overflow = 'auto'; 
  }

  const copierCle = async (type: 'email' | 'telephone') => {
    try {
      const texteACopier =
        type === 'email'
          ? 'marc.mathieu43@gmail.com'
          : '07 82 09 84 76';

      await navigator.clipboard.writeText(texteACopier);

      setPopupVisible(true);

      setPopupMessage(
        type === 'email' ? 'Email copié !' : 'Téléphone copié !'
      );

      setTimeout(() => {
        setPopupVisible(false);
      }, 1050);
    } catch (err) {
      console.error('Erreur lors de la copie : ', err);
    }
  };




  const generationCle = async () => {
    setChargement(true)
    try {
      const res = await fetch('/api/crud/create-conversation', {
        method: 'POST',
        body: JSON.stringify({ lifetime: dureeVie, views: nbVuesMessageDefault }),   
        headers: { 'Content-Type': 'application/json' },
      })
      console.log('duree vie PageACcueil : ', dureeVie)
      const data = await res.json()
      setIdConversation(data.id)

      const { cleBrute, cleBase64 } = await genererCle()
      setCleAes(cleBase64)

      setCleBase64(cleBase64);
      setCleBrute(cleBrute);

      const cleGlob = assembleTokenBase64(data.id, cleBase64)
      setCleGlobale(cleGlob)

      setPage('affichage-cle')
    } catch (err) {
      setIdConversation('Erreur lors de la requête')
    } finally {
      setChargement(false)
    }
  }


  const chargementConversation = (e: React.FormEvent | string, cleGlobaleArg?: string) => {
    if (typeof e !== 'string') e.preventDefault();

    const cle = typeof e === 'string' ? e : cleGlobaleArg ?? inputValue;
    if (!cle) return;

    try {
      const resultat = desassembleTokenBase64(cle);
      const id = resultat.id;
      const key = resultat.key;

      const cleBrute = base64VersCleBrute(key);
      
      setCleBrute(cleBrute);
      setCleBase64(key);

      setError(false);
      router.push(`/conversation/${id}`);
    } catch (err) {
      
      setError(true);
    }
  };


  

  return (
    <div style={{ overflowX: 'hidden', overflowY:'scroll', position: 'relative', width: '100vw' }}>
      <div
        style={{
          display: 'flex',
          width: '300vw',
          transform:
            page === 'main'
              ? 'translateX(0%)'
              : page === 'conversation-parametres'
              ? 'translateX(-100vw)'
              : 'translateX(-200vw)',
          transition: 'transform 0.4s ease-in-out'
        }}
      >
        
        <div style={{ width: '100vw' }}>
          <div style={{ backgroundColor: '#c1ffd6a8', padding: '2rem', maxWidth:'60rem', margin:'auto', borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
            
            <h2 className='lexend-bold' style={{fontWeight: 'bold', fontSize: '25px', marginBottom:'2rem'}}>Bienvenue sur mon projet - Marc MATHIEU</h2>
            <h4 className='lexend-bold'>Présentation :</h4>
            <p className='nata-sans-regular' style={{ marginTop: '.5rem' }}>
              Ce projet étudiant qui consiste en la création d'un système de messagerie sécurisé.
            </p>
            <p className="nata-sans-regular" style={{ marginTop: '.5rem' }}>
              Cette application s'appuie sur 2 objectifs pédagogiques :
            </p>
            <p className="nata-sans-regular" style={{ marginTop: '.5rem' }}>
              - développer une technologie <strong>RAG</strong> qui permet de <u>retrouver</u> une info de la conversation en communiquant les messages concernés et la réponse augmentée par une IA
            </p>
            <p className="nata-sans-regular" style={{ marginTop: '.5rem' }}>
              - construire une <strong>architecture distribuée</strong> en <u>microservices</u>
            </p>
          </div>


          <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <div 
              onClick={() => chargementConversation("OWUwOTFhMTQtMTg3ZS00YmRjLWJmMWUtNDU3ODYwNGE2NWYwOjpCUC8zWGlVRnlFbVpqcTBncDYydUloNTM4aFNqejZaR2pHVGFjYzA2UmlZPQ==")} 
              style={{
                display: 'flex',
                padding: '1rem 2rem',
                backgroundColor: '#a8d9d9b8',
                border: 'solid 1px #5f909bdb',
                borderRadius: '20px',
                margin: '1rem',
                maxWidth: '60rem',
                cursor: 'pointer'
              }}
            >
              <div className='hover'>
                <h4 className='lexend-bold'>1. RAG en action dans une conversation :</h4>
                <p className='nata-sans-regular' style={{ marginTop: '.5rem' }}>
                  Visualiser et essayer le fonctionnement du RAG dans une conversation type en posant une question
                </p>
              </div>
              <span 
                className="material-symbols-outlined" 
                style={{margin: 'auto', color: '#1b1b40', textDecoration: 'none'}}
              >
                arrow_forward_ios
              </span>
            </div>
            
            <div style={{display:'flex', flexDirection:'column', padding: '1rem 2rem 1rem 2rem', backgroundColor: 'rgba(140, 212, 247, 0.62)', border: 'solid 1px', borderColor: 'rgba(47, 104, 117, 0.86)', borderRadius: '20px', margin: '1rem', maxWidth:'60rem' }}>
              <h4 className='lexend-bold' style={{fontSize:'15px'}}>2. Création et consultation de conversation :</h4>
              <div style={{ margin: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setPage('conversation-parametres');  
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                    document.body.style.overflow = 'hidden'; 
                  }}
                  className='lexend-regular'
                  style={{
                    width: 'fit-content',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#5b6c7e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  Créer une conversation
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '1.5rem',
                      verticalAlign: 'middle',
                    }}
                    aria-label="Créer"
                  >
                    chevron_right
                  </span>
                </button>
              </div>

              <span className='nata-sans-regular' style={{textAlign:'center'}}>Ou bien débloquer une conversation en collant une <u>clé de conversation</u> :</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop:'2rem' }}>
                
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column', // pour afficher message d'erreur en dessous
                    gap: '0.25rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '0.5rem 0.5rem',
                    backgroundColor: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onPaste={(e) => {
                        const pastedText = e.clipboardData.getData('text');
                        if (pastedText) {
                          setInputValue(pastedText);
                          setTimeout(() => chargementConversation(pastedText), 0);
                        }
                      }}
                      placeholder="Coller votre clé secrète"
                      aria-label="Clé secrète"
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '1rem',
                        backgroundColor: 'transparent',
                      }}
                    />
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => chargementConversation(e, inputValue)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          chargementConversation(e, inputValue);
                        }
                      }}
                      className="material-symbols-outlined"
                      style={{
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        userSelect: 'none',
                        marginLeft: '0.5rem',
                        color: error ? 'red' : 'inherit',
                        transition: 'color 0.3s ease',
                      }}
                      aria-label="Valider la clé secrète"
                    >
                      key
                    </span>
                  </div>
                </div>
                {error && (
                  <p style={{ color: 'red', fontSize: '0.875rem', textAlign: 'center' }}>
                    La clé saisie ne marche pas.
                  </p>
                )}
              </div>
              
            </div>

            <a
              href="/svg/presentation-codes.svg"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                padding: '1rem 2rem',
                backgroundColor: 'rgba(198, 128, 230, 0.72)',
                border: 'solid 1px',
                borderColor: 'rgba(178, 17, 191, 0.86)',
                borderRadius: '20px',
                margin: '1rem',
                color: 'inherit',
                maxWidth:'60rem'
              }}
            >
              <div className='hover'>
                <h4 className="lexend-bold">3. Comment a été réalisé ce projet ?</h4>
                <p className="nata-sans-regular" style={{ marginTop: '.5rem' }}>
                  Voir l'architecture choisie et des explications détaillées sur la structure et le code de mon projet.
                </p>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ margin: 'auto', color: '#1b1b40', textDecoration: 'none' }}
              >
                arrow_forward_ios
              </span>
            </a>
          </div>

          <div className='lexend-regular' style={{ marginTop: '2rem', textAlign:'center', fontSize:'16px', color:'rgb(1, 2, 2)', maxWidth:'60rem', margin:'2rem auto 4rem auto', padding:'1rem', borderTop:'1px solid #aaa', display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'2rem' }}>
            <div style={{margin:'.5rem 0'}}><span style={{textDecoration: 'underline' }}>Me contacter :</span></div>
            <div style={{margin:'.5rem 0'}}>Email : 
              <span style={{fontStyle:'italic', fontWeight: 'bold'}}>  marc.mathieu43@gmail.com</span>
              <button
                onClick={() => copierCle('email')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Copier l'email"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginLeft: '1rem' }}>
                  content_copy
                </span>
              </button>
            </div>
            <div style={{margin:'.5rem 0'}}>Téléphone : 
              <span style={{fontStyle:'italic', fontWeight: 'bold'}}>  07 82 09 84 76</span>
              <button
                onClick={() => copierCle('telephone')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Copier le téléphone"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginLeft: '1rem' }}>
                  content_copy
                </span>
              </button>
            </div>
            {popupVisible && (
              <div
                style={{
                  position: 'fixed',
                  top: '83%',
                  left: '16%',
                  backgroundColor: '#60686c6e',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  zIndex: 1000,
                  fontWeight: 'bold',
                }}
              >
                {popupMessage}
              </div>
            )}
          </div>
        </div>


        <div style={{ width: '100vw' }}>
          <Etape1Parametrage
            RetourPageAccueil={retourPageAccueil}
            dureeVieDefault={dureeVie}
            dureeVieChoisie={setDureeVie}
            generationCle={generationCle}
          />
        </div>


        <div style={{ width: '100vw' }}>
          <Etape2RecuperationCle
            cleGlobale={cleGlobale}
            chargement={chargement}
          />
        </div>
      </div>
    </div>
  );

}
