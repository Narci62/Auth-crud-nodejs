# Auth-crud-nodejs
API REST sécurisée avec Node.js pour la gestion des utilisateurs et des éléments. Authentification par JWT et tests automatisés avec Jest.

# 🔐 API Node.js - Authentification & Gestion d’Items

Une API RESTful développée avec **Node.js**, **Express** et **MongoDB**, permettant :

- ✅ L’enregistrement et la connexion sécurisée des utilisateurs avec JWT
- 📦 La création, la lecture, la mise à jour et la suppression d’items (CRUD)
- 🔐 La protection des routes via un middleware d’authentification
- 🧪 Des tests automatisés avec Jest et Supertest

---

## ⚙️ Technologies utilisées

- **Node.js**
- **Express.js**
- **MongoDB** avec **Mongoose**
- **bcryptjs** (hachage de mots de passe)
- **jsonwebtoken** (authentification)
- **express-validator** (validation)
- **dotenv** (variables d’environnement)
- **Jest & Supertest** (tests)

---

## 📁 Structure du projet
📦 project/
├── controllers/
│ ├── authController.js
│ └── itemController.js
├── middlewares/
│ └── protect.js
├── models/
│ ├── User.js
│ └── Item.js
├── routes/
│ ├── authRoutes.js
│ └── itemRoutes.js
├── tests/
│ ├── auth.test.js
│ └── item.test.js
├── .env
├── app.js
├── server.js
└── README.md


---

## 📦 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/Narci62/Auth-crud-nodejs.git
cd Auth-crud-nodejs
```

2. **Installer les dépendances**
```bash
npm install



