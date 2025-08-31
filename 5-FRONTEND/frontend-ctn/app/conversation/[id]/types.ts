
export interface Conversation {
  id: string;
  date_creation: string;
  date_expiration: string;
  nb_message: number;
  acces_occured: number;
  nb_vues_message_default: number;
}

export interface Message {
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

