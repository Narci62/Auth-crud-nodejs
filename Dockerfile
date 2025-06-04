# Dockerfile
# Utilise une image Node.js officielle comme base
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances du projet
RUN npm install

# Copie le reste du code source de l'application
COPY . .

# Expose le port sur lequel l'application s'exécute
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]