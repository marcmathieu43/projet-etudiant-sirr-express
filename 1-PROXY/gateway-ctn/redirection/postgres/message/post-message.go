package message

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	pb "gateway-ctn/proto/message"
	utils "gateway-ctn/utils"

	"google.golang.org/grpc"
)

func PostMessage(w http.ResponseWriter, r *http.Request) {

	req, _, err := utils.DecodePostMessageRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	conn, err := grpc.Dial("message-ctn:50053", grpc.WithInsecure(), grpc.WithBlock(), grpc.WithTimeout(2*time.Second))
	if err != nil {
		http.Error(w, "pbm envoi message ctn post message "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	client := pb.NewGestionMessageClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	grpcResp, err := client.PostMessage(ctx, &pb.PostMessageRequest{
		ConversationId:   req.ConversationId,
		Content:          req.Content,
		Nonce:            req.Nonce,
		TagElement:       req.TagElement,
		CreatedAt:        req.CreatedAt,
		ReplyToElementId: req.ReplyToElementId,
		Lien:             req.Lien,
	})

	if err != nil {
		http.Error(w, "pbm reception message ctn post message "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(grpcResp)
}

func GetAllMessages(w http.ResponseWriter, r *http.Request) {
	requete, _, err := utils.DecodeGetAllMessagesRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	

	conn, err := grpc.Dial(
		"message-ctn:50053",
		grpc.WithInsecure(),
		grpc.WithBlock(),
		grpc.WithTimeout(2*time.Second),
	)
	if err != nil {
		http.Error(w, "message ctn pbm grpc "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	client := pb.NewGestionMessageClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	grpcResp, err := client.GetAllMessages(ctx, &pb.GetAllMessagesRequest{
		ConversationId: requete.ConversationId,
	})
	if err != nil {
		http.Error(w, "message ctn pbm reception grpc "+err.Error(), http.StatusInternalServerError)
		return
	}

	

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(grpcResp); err != nil {
		http.Error(w, "erreur encodage json "+err.Error(), http.StatusInternalServerError)
		return
	}
}
