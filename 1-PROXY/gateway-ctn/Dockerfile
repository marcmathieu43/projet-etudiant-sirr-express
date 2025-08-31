
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o gateway-ctn main.go

FROM alpine

WORKDIR /root/

COPY --from=builder /app/gateway-ctn .

EXPOSE 8080

CMD ["./gateway-ctn"]
