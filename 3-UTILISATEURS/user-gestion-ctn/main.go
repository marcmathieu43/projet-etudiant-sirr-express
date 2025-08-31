package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"time"

	pb "user-gestion-ctn/proto"

	"github.com/redis/go-redis/v9"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedTokenServiceServer
	redisClient *redis.Client
}

func (s *server) RegisterToken(ctx context.Context, req *pb.RegisterTokenRequest) (*pb.RegisterTokenResponse, error) {
	token := req.GetToken()

	err := s.redisClient.Set(ctx, token, "valid", 24*time.Hour).Err() // on met le token valide pour 24h
	if err != nil {
		log.Printf("pblm redis pour le token %v", err)
		return nil, err
	}

	return &pb.RegisterTokenResponse{
		Message: "token recu et mis dans la bdd redis",
	}, nil
}

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "redis-ctn:6379",
		DB:   0,
	})

	ctx := context.Background()
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("pblm connexion redis %v", err)
	}

	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("tcp %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterTokenServiceServer(s, &server{redisClient: rdb})

	fmt.Println("3-UTILISATEURS user-gestion-ctn 50052")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("pblm serveur %v", err)
	}
}
