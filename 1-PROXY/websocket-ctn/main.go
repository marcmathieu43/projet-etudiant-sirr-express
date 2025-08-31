package main

import (
	"context"
	"encoding/json"
	"log"
	"net"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"google.golang.org/grpc"

	pb "websocket-ctn/proto/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var clients = make(map[string]map[*websocket.Conn]bool)
var clientsMu sync.Mutex // on rend la connexion thread safe pour les clients

func connexionWs(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user")
	if user == "" {
		http.Error(w, "pas 'user' dans les parametres", http.StatusBadRequest)
		return
	}

	connection, erreur := upgrader.Upgrade(w, r, nil)
	if erreur != nil {
		log.Println("erreur", erreur)
		return
	}

	clientsMu.Lock()
	if clients[user] == nil {
		clients[user] = make(map[*websocket.Conn]bool)
	}
	clients[user][connection] = true
	clientsMu.Unlock()

	defer func() {
		clientsMu.Lock()
		delete(clients[user], connection)
		if len(clients[user]) == 0 {
			delete(clients, user)
		}
		clientsMu.Unlock()
		connection.Close()
	}()

	for {
		_, _, err := connection.ReadMessage()
		if err != nil {
			break
		}
	}
}

type websocketServer struct {
	pb.UnimplementedMessageReceiverServer
}

type WsMessage struct {
	Id               string  `json:"id"`
	ConversationId   string  `json:"conversation_id"`
	Content          string  `json:"content"`
	Nonce            string  `json:"nonce"`
	TagElement       string  `json:"tag_element"`
	CreatedAt        string  `json:"created_at"`
	ReplyToElementId *string `json:"replyToElementId,omitempty"`
	Lien             *string `json:"lien,omitempty"`
}

func (s *websocketServer) SendMessage(ctx context.Context, req *pb.SendMessageRequest) (*pb.SendMessageReply, error) {
	user := req.ConversationId

	msg := WsMessage{
		Id:               req.Id,
		ConversationId:   req.ConversationId,
		Content:          req.Content,
		Nonce:            req.Nonce,
		TagElement:       req.TagElement,
		CreatedAt:        req.CreatedAt,
		ReplyToElementId: req.ReplyToElementId,
		Lien:             req.Lien,
	}

	messageBytes, err := json.Marshal(msg)
	if err != nil {
		return &pb.SendMessageReply{Status: "erreur json"}, nil
	}

	clientsMu.Lock()
	clientsConnectes := clients[user]
	clientsMu.Unlock()

	for client := range clientsConnectes {
		err := client.WriteMessage(websocket.TextMessage, messageBytes)
		if err != nil {
			log.Printf("erreur %s : %v", user, err)
			clientsMu.Lock()
			delete(clients[user], client)
			if len(clients[user]) == 0 {
				delete(clients, user)
			}
			clientsMu.Unlock()
			client.Close()
		}
	}

	return &pb.SendMessageReply{Status: "ok"}, nil
}

func main() {

	go func() {
		http.HandleFunc("/ws", connexionWs)
		if err := http.ListenAndServe(":5000", nil); err != nil {
			log.Fatalf("pblm ws %v", err)
		}
	}()

	lis, err := net.Listen("tcp", ":5001")
	if err != nil {
		log.Fatalf("Erreur de démarrage gRPC: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterMessageReceiverServer(grpcServer, &websocketServer{})

	log.Println("1-PROXY websocket-ctn 5001")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("erreur grpc %v", err)
	}
}
