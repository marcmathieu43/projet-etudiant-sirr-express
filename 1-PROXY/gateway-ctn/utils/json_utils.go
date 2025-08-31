package utils

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"

	models "gateway-ctn/models"
)

func DecodeTokenRequest(r *http.Request) (*models.TokenRequest, error) {
	if r.Method != http.MethodPost {
		return nil, errors.New("méthode non autorisée")
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, errors.New("erreur lors de la lecture du body")
	}
	defer r.Body.Close()

	var req models.TokenRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, errors.New("JSON invalide")
	}

	return &req, nil
}

func DecodeConversationRequest(r *http.Request) (*models.ConversationRequest, string, error) {

	if r.Method != http.MethodPost {
		return nil, "", errors.New("méthode non autorisée")
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, "", errors.New("jeton manquant ou mal formaté")
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, "", errors.New("erreur lors de la lecture du body")
	}
	defer r.Body.Close()

	var req models.ConversationRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, "", errors.New("JSON invalide")
	}

	return &req, token, nil
}

func DecodeGetConversationRequest(r *http.Request) (*models.GetConversationRequest, string, error) {

	if r.Method != http.MethodPost {
		return nil, "", errors.New("méthode non autorisée")
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, "", errors.New("jeton manquant ou mal formaté")
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, "", errors.New("erreur lors de la lecture du body")
	}
	defer r.Body.Close()

	var req models.GetConversationRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, "", errors.New("JSON invalide")
	}

	return &req, token, nil
}

func DecodePostMessageRequest(r *http.Request) (*models.PostMessageRequest, string, error) {
	if r.Method != http.MethodPost {
		return nil, "", errors.New("méthode non autorisée")
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, "", errors.New("jeton manquant ou mal formaté")
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, "", errors.New("erreur lors de la lecture du body")
	}
	defer r.Body.Close()

	var req models.PostMessageRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, "", errors.New("JSON invalide")
	}

	return &req, token, nil
}

func DecodeGetAllMessagesRequest(r *http.Request) (*models.GetAllMessagesRequest, string, error) {

	if r.Method != http.MethodPost {
		return nil, "", errors.New("méthode non autorisée")
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, "", errors.New("jeton manquant ou mal formaté")
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, "", errors.New("erreur lors de la lecture du body")
	}
	defer r.Body.Close()

	var req models.GetAllMessagesRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, "", errors.New("JSON invalide")
	}

	return &req, token, nil
}

func DecodePoserQuestion(r *http.Request) (*models.PoserQuestionRequest, string, error) {

	if r.Method != http.MethodPost {
		return nil, "", errors.New("méthode non autorisée")
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, "", errors.New("jeton manquant ou mal formaté")
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, "", errors.New("erreur lors de la lecture du body")
	}
	defer r.Body.Close()

	var req models.PoserQuestionRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, "", errors.New("JSON invalide")
	}

	return &req, token, nil
}
