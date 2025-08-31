package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"strconv"
	"time"

	pb "verification-token-ctn/proto"

	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedAutorisationServiceServer
	redisClient *redis.Client
}

func (s *server) VerifieEtIncrementeToken(ctx context.Context, req *pb.VerifieTokenRequest) (*pb.VerifieTokenReponse, error) {
	token := req.GetToken()

	quotaGeneration, err := s.redisClient.Get(ctx, token).Result()
	if err != nil && err != redis.Nil {
		return nil, err
	}

	var generationIncremente int64
	if err == redis.Nil {
		generationIncremente = 1
	} else {
		current, convErr := strconv.ParseInt(quotaGeneration, 10, 64)
		if convErr != nil {
			current = 0
		}

		if current >= 15 {
			return &pb.VerifieTokenReponse{Ok: false, NbCreation: current}, nil
		}

		generationIncremente = current + 1
	}

	ttl, _ := s.redisClient.TTL(ctx, token).Result()
	var expire time.Duration
	if ttl > 0 {
		expire = ttl
	} else if ttl == -1 {
		expire = 24 * time.Hour
	} else {
		expire = 0
	}

	if err := s.redisClient.Set(ctx, token, generationIncremente, expire).Err(); err != nil {
		return nil, err
	}

	return &pb.VerifieTokenReponse{Ok: true, NbCreation: generationIncremente}, nil
}

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "redis-ctn:6379",
		DB:   0,
	})

	ctx := context.Background()
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Fatalf("pblm redis %v", err)
	}

	lis, err := net.Listen("tcp", ":50055")
	if err != nil {
		log.Fatalf("tcp %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterAutorisationServiceServer(s, &server{redisClient: rdb})

	fmt.Println("3-UTILISATEURS verification-token-ctn 50055")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Problème serveur : %v", err)
	}
}
