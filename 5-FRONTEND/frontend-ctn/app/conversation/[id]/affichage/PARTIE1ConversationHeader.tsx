import React from 'react';

interface PARTIE1 {
  id: string;
}

export function PARTIE1ConversationHeader({ id }: PARTIE1) {
  return (
    <div style={{
      padding: '0.75rem 1rem', 
      
      width: '100vw'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <span>Conversation </span>
        <span style={{ 
          fontWeight: 'bold', 
          marginLeft: '0.5rem', 
          maxWidth: '100%', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap'
        }}>
          {id}
        </span>
      </div>
    </div>
  );
}