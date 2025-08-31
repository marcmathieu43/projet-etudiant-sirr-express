package token

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	pb "gateway-ctn/proto/token"
	utils "gateway-ctn/utils"

	"google.golang.org/grpc"
)

func RegisterTokenUser(w http.ResponseWriter, r *http.Request) {

	req, err := utils.DecodeTokenRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("token reçu"))

	connection, err := grpc.Dial("user-gestion-ctn:50052", grpc.WithInsecure(), grpc.WithBlock(), grpc.WithTimeout(2*time.Second))
	if err != nil {
		http.Error(w, "erreut grpc envoi "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer connection.Close()

	client := pb.NewTokenServiceClient(connection)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	grpcResp, err := client.RegisterToken(ctx, &pb.RegisterTokenRequest{
		Token: req.Token,
	})
	if err != nil {
		http.Error(w, "erreur grpc reception "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(grpcResp)
}
