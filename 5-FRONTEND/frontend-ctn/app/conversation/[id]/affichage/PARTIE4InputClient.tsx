import React from 'react';

interface InputClient {
  id: string;

  messageClient: string;
  setMessageClient: (message: string) => void;
  envoiMessageServeur: () => void;
  
  poserQuestion: (q: string) => Promise<void>; 
  ragReponse: string | null;
  ragMessages: { id: string; content: string }[];
  affichageReponseRag: boolean;
  setAffichageReponseRag: (value: boolean) => void;

  bulleInfoRag: boolean;
  setBulleInfoRag: (value: boolean) => void;

  questionDiv: boolean;
  setQuestionDiv: (value: boolean) => void;

  question: string;
  setQuestion: (q: string) => void;

  loadingQuestion: boolean;
  setLoadingQuestion: (value: boolean) => void;
}

export function PARTIE4InputClient({ 
  id,
  messageClient, 
  setMessageClient, 
  envoiMessageServeur, 
  poserQuestion, 
  ragReponse, 
  ragMessages, 
  bulleInfoRag, 
  setBulleInfoRag, 
  question, 
  setQuestion, 
  questionDiv, 
  setQuestionDiv, 
  loadingQuestion, 
  setLoadingQuestion, 
  affichageReponseRag, 
  setAffichageReponseRag 
}: InputClient) {

  const [loadingQuestionId, setLoadingQuestionId] = React.useState<string | null>(null);


  const keyDownEnvoiMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageClient.trim()) {
        envoiMessageServeur();
      }
    }
  };

  const clicEnvoiMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (messageClient.trim()) {
      envoiMessageServeur();
    }
  };

  const keyDownQuestionRAG = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (question.trim()) {
        clicQuestionRAG(question);
      }
    }
  };

  const clicQuestionRAG = async (q: string) => {
    if (!q.trim()) return;
    try {
      setLoadingQuestion(true);
      await poserQuestion(q);
      setQuestionDiv(false); 
      setAffichageReponseRag(true);
    } finally {
      setLoadingQuestion(false);
      setQuestion(""); 
    }
  };

  return (
    <div style={{
      position: 'fixed', 
      bottom: '.5rem', 
      left: '50%', 
      transform: 'translate(-52%, 0%)', 
      width: '85%',
      maxWidth: '50rem'
    }}>
      {affichageReponseRag && ragReponse && (
        <div
          onClick={() => setAffichageReponseRag(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            margin: '2rem auto'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} 
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "1.5rem",
              maxWidth: "600px",
              width: "90%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setAffichageReponseRag(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <button
              onClick={() => {
                setAffichageReponseRag(false);
                setBulleInfoRag(true);
              }}
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "transparent",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '1.5rem',
                  verticalAlign: 'middle',
                  marginRight: '.5rem',
                  padding: '.15rem 1rem',
                  borderRadius: '30px',
                  border: '1px solid',
                }}
                aria-label="retour"
              >
                arrow_back
              </span>
            </button>

            <h4 
              className='lexend-bold' 
              style={{
                fontSize:'15px', 
                textAlign:'center', 
                marginBottom:'1rem',
                marginTop: '2rem',
              }}
            >
              Messages retrouvés : 
            </h4>
            <ul>
              {(ragReponse.toLowerCase().includes("impossible") || ragReponse.toLowerCase().includes("ne peux pas répondre")) ? (
                <li>
                  <div style={{
                    backgroundColor: 'rgba(105, 113, 126, 0.28)',
                    color: '#000',
                    padding: '0.5rem 2rem',
                    borderRadius: '9999px 9999px 9999px 0',
                    maxWidth: '94%',
                    textAlign: 'center',
                  }}>
                    Aucun message retrouvé
                  </div>
                </li>
              ) : (
                ragMessages.map((msg) => (
                  <li key={msg.id} style={{ marginBottom: "0.5rem" }}>
                    <div style={{
                      backgroundColor: 'rgba(105, 113, 126, 0.28)',
                      color: '#000',
                      padding: '0.5rem 2rem',
                      borderRadius: '9999px 9999px 9999px 0',
                      maxWidth: '94%',
                    }}>
                      {msg.content}
                    </div>
                  </li>
                ))
              )}
            </ul>

            <h4 
              className='lexend-bold' 
              style={{
                fontSize:'15px', 
                textAlign:'center', 
                marginTop:'1.5rem'
              }}
            >
              Réponse augmentée par LLM :
            </h4>
            <div style={{ 
              marginTop: "1rem", 
              padding: "1rem", 
              backgroundColor: "#e0ffe0", 
              borderRadius: "8px" 
            }}>
              <p>{ragReponse}</p>
            </div>
          </div>
        </div>
      )}


      <div style={{
        display:'flex', 
        justifyContent:'space-evenly', 
        maxWidth: '25rem', 
        margin: 'auto'
      }}>
        {bulleInfoRag && (
          <div style={{
            position: 'absolute',
            bottom: '12rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            maxWidth: '300px',
            zIndex: 999,
            textAlign: 'center',
            width: '100%'
          }}>
            
            <div style={{
              position: 'absolute',
              top: id === "9e091a14-187e-4bdc-bf1e-4578604a65f0" ? '98%' : '92%',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '16px',
              height: '16px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #ccc',
              zIndex: -1
            }} />

            <button 
              onClick={() => setBulleInfoRag(false)} 
              style={{
                position: 'absolute',
                top: '0.3rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              aria-label="Fermer l'aide"
            >
              ×
            </button>

            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Essaye <strong>RAG</strong> en demandant une information à retrouver dans la conversation.
            </p>

            <div style={{ marginTop: '0.5rem', textAlign: 'left' }}>
              {id === "9e091a14-187e-4bdc-bf1e-4578604a65f0" && [
                "Quelles sont les plaques d'immatriculation des camions ?",
                "À quelle heure arrivent les camions ?",
                "Combien de palettes de parpaings vont être livrées ?",
                "Quel est le prix de cette livraison ?"
              ].map((q, idx) => (
                <div 
                  key={idx} 
                  style={{ display: 'flex', alignItems: 'center', margin: '1rem', flexDirection: 'row-reverse' }}
                >
                  <button 
                    type="button"
                    onClick={async () => {
                      setLoadingQuestionId(q);   
                      await clicQuestionRAG(q);
                      setLoadingQuestionId(null);
                      setBulleInfoRag(false);
                    }}
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '1.3rem',
                      marginLeft: '.75rem',
                      color: loadingQuestionId === q ? 'rgb(115 144 169)' : '#2d5757',
                      cursor: loadingQuestionId === q ? 'not-allowed' : 'pointer',
                      border: 'none',
                      background: 'transparent'
                    }}
                  >
                    {loadingQuestionId === q ? (
                      <span className="loading-spinner" style={{marginBottom:'.2rem'}}/>
                    ) : (
                      "send"
                    )}
                  </button>
                  <span style={{fontStyle:'italic'}}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}





        {questionDiv && (
          <div style={{
            position: 'absolute',
            bottom: '12rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgb(209 223 218 / 97%)',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            width: '100%',
            zIndex: 999,
            textAlign: 'center'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '16px',
              height: '16px',
              backgroundColor: 'rgb(209 223 218 / 97%)',
              borderLeft: '1px solid #ccc',
              borderBottom: '1px solid #ccc',
              zIndex: -1 
            }} />

            <div style={{display:'flex'}}> 
              <button 
                onClick={() => setQuestionDiv(false)} 
                style={{
                  position: 'absolute',
                  top: '0.6rem',
                  right: '0.5rem',
                  background: 'none',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: '#404742'
                }}
                aria-label="Fermer l'aide"
              >
                ×
              </button>
              <div style={{ 
                margin: '1rem auto', 
                borderRadius: '9999px', 
                backgroundColor: 'rgba(77, 96, 91, 0.34)', 
                padding: '.25rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                width: '88%'
              }}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={keyDownQuestionRAG}
                  placeholder="où seront les clés du camion ?"
                  style={{ 
                    padding: '0.5rem', 
                    width: '85%', 
                    marginRight: '1rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none'
                  }}
                />
                <button 
                  type="button"
                  onClick={() => clicQuestionRAG(question)}
                  disabled={!question.trim() || loadingQuestion}
                  className="material-symbols-outlined"
                  style={{ 
                    fontSize: '2rem',
                    marginRight: '1rem',
                    color: question.trim() ? '#2d5757' : 'rgb(115 144 169)',
                    cursor: question.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  {loadingQuestion ? (
                    <span className="loading-spinner" style={{marginBottom:'.4rem'}}/>
                  ) : (
                    "send"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setBulleInfoRag(false);
            setQuestionDiv(true);
            setAffichageReponseRag(false);
          }}
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: 'rgb(158, 253, 173)', 
            borderRadius: '9999px', 
            cursor: 'pointer',
            border: '1px solid',
            fontWeight: 'bold',
            color: '#1a9730',
            width: 'fit-content'
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '1.5rem',
              verticalAlign: 'middle',
              marginRight: '.5rem'
            }}
            aria-label="ia"
          >
            network_intelligence
          </span>
          Retrouver une info
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setBulleInfoRag(false);
            setBulleInfoRag(true);
          }}
          style={{ 
            fontSize: '2rem',
            verticalAlign: 'middle',
            color: messageClient.trim() ? '#2d5757' : 'rgb(115 144 169)',
            cursor: 'pointer',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '1.5rem',
              verticalAlign: 'middle',
              marginBottom: '.5rem',
              color : '#2e3c3c',
            }}
            aria-label="info"
          >
            help
          </span>
        </button>
      </div>

      <div style={{ 
        margin: '1rem 0.75rem', 
        borderRadius: '9999px', 
        backgroundColor: 'rgb(143 185 197)', 
        padding: '.25rem 1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' ,
        width: '100%'
      }}>
        <input
          type="text"
          value={messageClient}
          onChange={(e) => setMessageClient(e.target.value)}
          onKeyDown={keyDownEnvoiMessage} 
          placeholder="Entrer un message "
          style={{ 
            padding: '0.5rem', 
            width: '85%', 
            marginRight: '1rem',
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none'
          }}
        />
        <button 
          type="button"
          onClick={clicEnvoiMessage}
          disabled={!messageClient.trim()}
          className="material-symbols-outlined"
          style={{ 
            fontSize: '2rem',
            verticalAlign: 'middle',
            color: messageClient.trim() ? '#2d5757' : 'rgb(115 144 169)',
            cursor: messageClient.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          send
        </button>
      </div>
    </div>
  );
}