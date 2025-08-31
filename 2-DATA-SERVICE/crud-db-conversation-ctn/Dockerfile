
FROM golang:1.21 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o crud-db-conversation-ctn

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/crud-db-conversation-ctn .

EXPOSE 50051

CMD ["./crud-db-conversation-ctn"]
