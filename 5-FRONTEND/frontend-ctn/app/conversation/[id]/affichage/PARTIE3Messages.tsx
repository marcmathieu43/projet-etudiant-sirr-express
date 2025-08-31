import React from 'react';

interface Message {
  id: string;
  conversation_id: string;
  content: string;
  nonce: string;
  tag_element: string;
  created_at: string;
  replyToElementId?: string;
  vues_message: number;
  lien?: string; 
  num: number;
}

interface AffichageMessages {
  messagesExtraitsDechiffres: Message[];
  formatDateMessage: (isoDate: string | undefined | null) => string;
}

export function PARTIE3Messages({
  messagesExtraitsDechiffres,
  formatDateMessage,
}: AffichageMessages) {
  return (
    <>
      {/* pour savoir si on affiche la date au dessus des messages si + de 2h */}
      
      {messagesExtraitsDechiffres.map((msg, index) => {
        const dateActuelle = new Date(msg.created_at);
        

        let timestampPrecedentMessage = null;
        if (index > 0) {
          const precedentMessage = messagesExtraitsDechiffres[index - 1];
          timestampPrecedentMessage = new Date(precedentMessage.created_at);
        }

        let montrerDate = false;
        if (!timestampPrecedentMessage) {
          montrerDate = true;
        } else {
          const deltaMs = dateActuelle.getTime() - timestampPrecedentMessage.getTime();
          montrerDate = deltaMs > 2 * 60 * 60 * 1000;
        }

        if (index > 0) {
          if (messagesExtraitsDechiffres[index - 1].lien !== msg.lien) {
            if (messagesExtraitsDechiffres[index - 1].num === 0) {
              msg.num = 1;
            } else {
              msg.num = 0;
            }
          } else {
            msg.num = messagesExtraitsDechiffres[index - 1].num;
          }
        } else {
          msg.num = 1;
        }


        {/*-------------------*/}

        return (
          <div style={{ margin: '.25rem' }} key={msg.id || index}>
            {montrerDate && (
              <span
                style={{
                  fontStyle: 'italic',
                  color: '#555',
                  fontSize: '0.9rem',
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  marginTop: '1rem',
                }}
              >
                {formatDateMessage(msg.created_at)}
              </span>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: msg.num % 2 === 0 ? 'flex-start' : 'flex-end',
                margin: '.25rem .75rem',
                marginTop:
                  index > 0 && msg.num !== messagesExtraitsDechiffres[index - 1].num
                    ? '1.5rem'
                    : '.25rem',
              }}
            >
              <div
                className="lexend-regular"
                style={{
                  backgroundColor:
                    msg.num % 2 === 0
                      ? 'rgba(79, 155, 145, 0.29)'
                      : 'rgba(105, 113, 126, 0.28)',
                  color: '#000',
                  padding: '0.5rem 2rem',
                  borderRadius:
                    msg.num % 2 === 0
                      ? '9999px 9999px 9999px 0'
                      : '9999px 0 9999px 9999px',
                  maxWidth: '80%'
                }}
              >
                {messagesExtraitsDechiffres[index]?.content || '...'}    
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
