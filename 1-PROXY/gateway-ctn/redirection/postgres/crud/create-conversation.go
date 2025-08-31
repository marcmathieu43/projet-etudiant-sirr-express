package crud

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	pb1 "gateway-ctn/proto/autorisation"
	pb "gateway-ctn/proto/conversation"

	utils "gateway-ctn/utils"

	"google.golang.org/grpc"
)

func CreateConversation(w http.ResponseWriter, r *http.Request) {
	requete, token, err := utils.DecodeConversationRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ok, count, err := VerifieToken(token)
	if err != nil {
		fmt.Println("Erreur :", err)
		http.Error(w, "Erreur interne lors de la vérification du token", http.StatusInternalServerError)
		return
	}

	if !ok {

		http.Error(w, fmt.Sprintf("trop de requete pour cet user :", count), http.StatusForbidden)
		return
	}

	conn, err := grpc.Dial("crud-db-conversation-ctn:50051",
		grpc.WithInsecure(),
		grpc.WithBlock(),
		grpc.WithTimeout(2*time.Second))
	if err != nil {
		http.Error(w, "pblm envoi grpc "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	client := pb.NewGestionConversationClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	grpcResp, err := client.CreateConversation(ctx, &pb.CreateConversationRequest{
		DureeVie:             int32(requete.DureeVie),
		NbVuesMessageDefault: int32(requete.NbVuesMessageDefault),
	})
	if err != nil {
		http.Error(w, "pbm reception grpc "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(grpcResp)
}

func GetConversationById(w http.ResponseWriter, r *http.Request) {

	requete, _, err := utils.DecodeGetConversationRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	connection, err := grpc.Dial("crud-db-conversation-ctn:50051", grpc.WithInsecure(), grpc.WithBlock(), grpc.WithTimeout(2*time.Second))
	if err != nil {
		http.Error(w, " pbm envoi grpc "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer connection.Close()

	client := pb.NewGestionConversationClient(connection)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	grpcResp, err := client.GetConversationById(ctx, &pb.ConversationIdRequest{
		Id: requete.Id,
	})
	if err != nil {
		http.Error(w, "pbm reception grpc "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(grpcResp)
}

func VerifieToken(token string) (bool, int64, error) {

	conn, err := grpc.Dial("verification-token-ctn:50055", grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		return false, 0, fmt.Errorf("pblm grpc envoi verification-ctn %v", err)
	}
	defer conn.Close()

	client := pb1.NewAutorisationServiceClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	grpcResp, err := client.VerifieEtIncrementeToken(ctx, &pb1.VerifieTokenRequest{
		Token: token,
	})
	if err != nil {
		return false, 0, fmt.Errorf("pblm grpc reception verification ctn %v", err)
	}

	return grpcResp.Ok, grpcResp.NbCreation, nil
}
