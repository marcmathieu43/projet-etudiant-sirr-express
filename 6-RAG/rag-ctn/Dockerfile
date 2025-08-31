# Utiliser une image Python légère
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Définir le PYTHONPATH pour les imports de modules
ENV PYTHONPATH=/app

# Copier les dépendances et les installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tous les fichiers de l'application
COPY . .

# Exposer le port gRPC
EXPOSE 50054

CMD ["python", "-u", "server.py"]
