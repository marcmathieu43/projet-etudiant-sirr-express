# ws-server/Dockerfile
FROM golang:1.21-alpine

WORKDIR /app
COPY . .

RUN go mod tidy && go build -o server main.go

EXPOSE 5000
CMD ["./server"]
