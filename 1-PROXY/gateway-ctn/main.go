package main

import (
	"fmt"
	"log"
	"net/http"

	"gateway-ctn/redirection/postgres/crud"
	"gateway-ctn/redirection/postgres/message"

	"gateway-ctn/redirection/rag"
	"gateway-ctn/redirection/token"
)

func main() {
	http.HandleFunc("/create-conversation", crud.CreateConversation)
	http.HandleFunc("/get-conversation", crud.GetConversationById)

	http.HandleFunc("/post-message", message.PostMessage)
	http.HandleFunc("/get-all-messages", message.GetAllMessages)

	http.HandleFunc("/register-token", token.RegisterTokenUser)

	http.HandleFunc("/rag/poser-question", rag.PoserQuestion)

	fmt.Println("gateway-ctn 8080")
	log.Fatal(http.ListenAndServe("gateway-ctn:8080", nil))
}
