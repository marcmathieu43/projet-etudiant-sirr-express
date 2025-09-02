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

	pb "message-ctn/proto/message"
	websocketpb "message-ctn/proto/websocket"
)

const (
	port        = ":50053"
	postgresURL = " "
)

type server struct {
	pb.UnimplementedGestionMessageServer
	db *sql.DB
}

func (s *server) PostMessage(ctx context.Context, requete *pb.PostMessageRequest) (*pb.PostMessageReply, error) {

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("erreur ouverture transaction: %v", err)
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	var replyTo any
	if requete.ReplyToElementId == "" {
		replyTo = nil
	} else {
		replyTo = requete.ReplyToElementId
	}

	var messageID string
	err = tx.QueryRowContext(ctx, `
        INSERT INTO elements_conv (
            conversation_id,
            content,
            nonce,
            tag_element,
            created_at,
            reply_to_element_id,
            lien
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `,
		requete.ConversationId,
		requete.Content,
		requete.Nonce,
		requete.TagElement,
		requete.CreatedAt,
		replyTo,
		requete.Lien, 
	).Scan(&messageID)
	if err != nil {
		return nil, fmt.Errorf("erreur insertion message: %v", err)
	}

	_, err = tx.ExecContext(ctx, `
        UPDATE conversations
        SET nb_message = nb_message + 1
        WHERE id = $1;
    `, requete.ConversationId)
	if err != nil {
		return nil, fmt.Errorf("erreur mise à jour nb_message: %v", err)
	}

	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("erreur commit transaction: %v", err)
	}

	go func() {
		conn, err := grpc.Dial("websocket-ctn:5001", grpc.WithInsecure())
		if err != nil {
			fmt.Println("erreur connexion websocket-ctn:", err)
			return
		}
		defer conn.Close()

		client := websocketpb.NewMessageReceiverClient(conn)

		var replyToElementId *string
		if requete.ReplyToElementId != "" {
			replyToElementId = &requete.ReplyToElementId
		} else {
			replyToElementId = nil
		}

		_, err = client.SendMessage(context.Background(), &websocketpb.SendMessageRequest{
			Id:               messageID,
			ConversationId:   requete.ConversationId,
			Content:          requete.Content,
			Nonce:            requete.Nonce,
			TagElement:       requete.TagElement,
			CreatedAt:        requete.CreatedAt,
			ReplyToElementId: replyToElementId,
			Lien:             &requete.Lien,
		})
		if err != nil {
			fmt.Println("ws marche pas:", err)
		}
	}()

	return &pb.PostMessageReply{
		Id:               messageID,
		ConversationId:   requete.ConversationId,
		Content:          requete.Content,
		Nonce:            requete.Nonce,
		TagElement:       requete.TagElement,
		CreatedAt:        requete.CreatedAt,
		ReplyToElementId: requete.ReplyToElementId,
		Lien:             requete.Lien, 
	}, nil
}


func (s *server) GetAllMessages(ctx context.Context, requete *pb.GetAllMessagesRequest) (*pb.GetAllMessagesReply, error) {
	const messagesRecuperes = `
        SELECT id, conversation_id, content, nonce, tag_element, created_at, lien 
        FROM elements_conv WHERE conversation_id = $1;
	`
	
	
	resultats, erreur := s.db.QueryContext(ctx, messagesRecuperes, requete.ConversationId)
	if erreur != nil {
		return nil, fmt.Errorf("erreur récupération conversation: %v", erreur)
	}
	defer resultats.Close()

	fmt.Println("résultats:", resultats)

	var messages []*pb.Message 

	for resultats.Next() {
		
		var m pb.Message
		

		resultats.Scan(
			&m.Id,
			&m.ConversationId,
			&m.Content,
			&m.Nonce,
			&m.TagElement,
			&m.CreatedAt,
			&m.Lien, 
		)
		

		messages = append(messages, &m)
		
	}

	if err := resultats.Err(); err != nil {
		return nil, fmt.Errorf("erreur finale lors de l'itération: %v", err)
	}

	

	return &pb.GetAllMessagesReply{
		Messages: messages,
	}, nil
}

func main() {
	db, err := sql.Open("postgres", postgresURL)
	if err != nil {
		log.Fatalf("PAS CONNECTÉ DB  %v", err)
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
	pb.RegisterGestionMessageServer(s, &server{db: db})
	reflection.Register(s)

	fmt.Println("2-DATA-SERVICE message-ctn écoute sur le ", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("erreur serveur: %v", err)
	}
}
