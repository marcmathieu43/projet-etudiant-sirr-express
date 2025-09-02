package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"

	_ "github.com/lib/pq"
	"google.golang.org/grpc"

	"google.golang.org/grpc/reflection"

	pb "crud-db-conversation-ctn/proto"
)

const (
	port        = ":50051"
	postgresURL = " "
)

type server struct {
	pb.UnimplementedGestionConversationServer
	db *sql.DB
}

// création d une conversation avec ses parametres

func (s *server) CreateConversation(ctx context.Context, requete *pb.CreateConversationRequest) (*pb.CreateConversationReply, error) {

	requeteConversation := `
		INSERT INTO conversations (date_expiration, nb_vues_message_default)
		VALUES (NOW() + ($1 || ' days')::INTERVAL, $2)
		RETURNING id;
	`
	fmt.Println("Duree vie reçue (jours):", requete.DureeVie)
	var id string
	err := s.db.QueryRowContext(ctx, requeteConversation, requete.DureeVie, requete.NbVuesMessageDefault).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("erreur insertion conversation: %v", err)
	}

	return &pb.CreateConversationReply{Id: id}, nil
}

// récupérer une conversation pour l'affichage

func (s *server) GetConversationById(ctx context.Context, requete *pb.ConversationIdRequest) (*pb.ConversationIdResponse, error) {
	requeteRecup := `
        SELECT id, date_creation, nb_message, acces_occured, date_expiration, nb_vues_message_default FROM conversations WHERE id = $1
    `
	var conv pb.Conversation
	err := s.db.QueryRowContext(ctx, requeteRecup, requete.Id).Scan(
		&conv.Id,
		&conv.DateCreation,
		&conv.NbMessage,
		&conv.AccesOccured,
		&conv.DateExpiration,
		&conv.NbVuesMessageDefault,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("conversation non trouvée")
	}
	if err != nil {
		return nil, fmt.Errorf("erreur récupération conversation: %v", err)
	}
	return &pb.ConversationIdResponse{Conversation: &conv}, nil
}

func main() {
	db, err := sql.Open("postgres", postgresURL)
	if err != nil {
		log.Fatalf("PAS CONNECTÉ DB %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("ping %v", err)
	}

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("tcp %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterGestionConversationServer(s, &server{db: db})
	reflection.Register(s)

	fmt.Println("2-DATA-SERVICE crud-db-conversation-ctn", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("erreur serveur: %v", err)
	}
}
