const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

// Connexion à une base de données de test
beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Nettoyer la DB après chaque test
afterEach(async () => {
    await User.deleteMany({});
});

// Déconnexion de la DB après tous les tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    it('devrait enregistrer un nouvel utilisateur', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.username).toBe('testuser');
    });

    it('ne devrait pas enregistrer un utilisateur avec un email existant', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser1',
                email: 'duplicate@example.com',
                password: 'password123',
            });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser2',
                email: 'duplicate@example.com',
                password: 'password456',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toContain('Un utilisateur avec cet email existe déjà');
    });

    it('devrait authentifier un utilisateur existant', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123',
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('login@example.com');
    });

    it('ne devrait pas authentifier avec un mot de passe incorrect', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'wrongpass',
                email: 'wrongpass@example.com',
                password: 'password123',
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrongpass@example.com',
                password: 'wrongpassword',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toContain('Email ou mot de passe invalide');
    });

});