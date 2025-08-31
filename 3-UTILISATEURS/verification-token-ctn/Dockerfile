
FROM golang:1.21 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o verification-token-ctn

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/verification-token-ctn .

EXPOSE 50055

CMD ["./verification-token-ctn"]
