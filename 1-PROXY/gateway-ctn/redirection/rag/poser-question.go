package rag

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"gateway-ctn/models"
	pb "gateway-ctn/proto/rag"
	utils "gateway-ctn/utils"

	"google.golang.org/grpc"
)

func PoserQuestion(w http.ResponseWriter, r *http.Request) {

	requete, token, err := utils.DecodePoserQuestion(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	connection, err := grpc.Dial("rag-ctn:50054", grpc.WithInsecure(), grpc.WithBlock(), grpc.WithTimeout(2*time.Second))
	if err != nil {
		http.Error(w, "pblm grpc: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer connection.Close()

	client := pb.NewTokenServiceClient(connection)

	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()

	grpcRequete := &pb.PoserQuestionRequest{
		Token:    token,
		Messages: conversionMessagesRagEnProto(requete.Messages),
		Question: requete.Question,
	}

	grpcReponse, err := client.PoserQuestion(ctx, grpcRequete)
	if err != nil {
		http.Error(w, "erreur grpc l.46"+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(grpcReponse); err != nil {
		http.Error(w, "erreur code json "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func conversionMessagesRagEnProto(msgs []models.Message) []*pb.Message {
	messagesProto := make([]*pb.Message, len(msgs))
	for i, m := range msgs {
		messagesProto[i] = &pb.Message{
			Id:      m.Id,
			Content: m.Content,
		}
	}
	return messagesProto
}
