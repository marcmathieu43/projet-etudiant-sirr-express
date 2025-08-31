package models

type TokenRequest struct {
	Token string `json:"token"`
}

type ConversationRequest struct {
	DureeVie             int `json:"duree_vie"`
	NbVuesMessageDefault int `json:"nb_vues_message_default"`
}

type GetConversationRequest struct {
	Id string `json:"id"`
}

type PostMessageRequest struct {
	ConversationId   string `json:"conversation_id"`
	Content          string `json:"content"`
	Nonce            string `json:"nonce"`
	TagElement       string `json:"tag_element"`
	CreatedAt        string `json:"created_at"`
	ReplyToElementId string `json:"reply_to_element_id"`
	Lien             string `json:"lien"`
}

type GetAllMessagesRequest struct {
	ConversationId string `json:"conversation_id"`
}

type Message struct {
	Id      string `json:"id"`
	Content string `json:"content"`
}

type PoserQuestionRequest struct {
	ConversationId string    `json:"conversationId"`
	Messages       []Message `json:"messages"`
	Question       string    `json:"question"`
}

type AnalyseIaRequest struct {
	ConversationId string    `json:"conversationId"`
	Messages       []Message `json:"messages"`
}
