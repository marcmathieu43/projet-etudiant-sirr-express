import React from 'react';
import { Conversation } from '../types';

interface PARTIE2 {
  conversation: Conversation;
  formatDate: (isoDate: string | undefined | null) => string;
}

export function PARTIE2ConversationInfo({ conversation, formatDate }: PARTIE2) {
  return (
    <div>
      <div style={{ 
        padding: '0.75rem 1rem', 
        borderRadius: '8px', 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '0.5rem', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <span style={{ 
          fontStyle: 'italic', 
          color: '#555', 
          fontSize: '0.9rem', 
          width: 'fit-content' 
        }}>
          créée le {formatDate(conversation.date_creation)}
        </span>

        <span style={{ fontSize: '1rem', color: '#888' }}>•</span> 

        <span style={{ 
          fontStyle: 'italic', 
          color: '#555', 
          fontSize: '0.9rem', 
          width: 'fit-content' 
        }}>
          expire le {formatDate(conversation.date_expiration)}
        </span>
      </div>
      <div style={{ 
        padding: '0.75rem 1rem', 
        borderRadius: '8px', 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '0.5rem', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <span style={{ 
          color: '#555', 
          fontSize: '0.9rem', 
          width: 'fit-content', 
          padding: '0.75rem 1rem', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          {conversation?.nb_message ?? 0} messages
        </span> 
      </div>
    </div>
  );
}