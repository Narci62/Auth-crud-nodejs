const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');

let token;
let userId;
let itemId;

// Connexion à une base de données de test
beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Enregistrer un utilisateur de test et obtenir un token
    const res = await request(app)
        .post('/api/auth/register')
        .send({
            username: 'itemtestuser',
            email: 'itemtest@example.com',
            password: 'password123',
        });
    token = res.body.token;
    userId = res.body.user.id;
});

// Nettoyer la DB après chaque test (sauf l'utilisateur de test)
afterEach(async () => {
    await Item.deleteMany({});
});

// Déconnexion de la DB après tous les tests
afterAll(async () => {
    await User.deleteMany({}); // Nettoyer aussi l'utilisateur de test
    await mongoose.connection.close();
});

describe('Item API', () => {
    it('devrait ajouter un nouvel élément', async () => {
        const res = await request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Item',
                description: 'Description for test item',
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.name).toBe('Test Item');
        itemId = res.body.data._id; // Stocker l'ID pour les tests suivants
    });

    it('devrait obtenir tous les éléments pour l\'utilisateur authentifié', async () => {
        // Ajouter un élément avant de le récupérer
        await request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Another Item',
                description: 'Another description',
            });

        const res = await request(app)
            .get('/api/items')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0].owner).toBe(userId);
    });

    it('devrait obtenir un seul élément par ID', async () => {
        const newItemRes = await request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Single Item',
                description: 'Description for single item',
            });
        const newId = newItemRes.body.data._id;

        const res = await request(app)
            .get(`/api/items/${newId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Single Item');
    });

    it('devrait mettre à jour un élément', async () => {
        const newItemRes = await request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Item to Update',
                description: 'Original description',
            });
        const newId = newItemRes.body.data._id;

        const res = await request(app)
            .put(`/api/items/${newId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Item',
                description: 'New description',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Updated Item');
        expect(res.body.data.description).toBe('New description');
    });

    it('devrait supprimer un élément', async () => {
        const newItemRes = await request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Item to Delete',
                description: 'Description to be deleted',
            });
        const newId = newItemRes.body.data._id;

        const res = await request(app)
            .delete(`/api/items/${newId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Elément supprimé avec succès');

        // Vérifier que l'élément a bien été supprimé
        const getRes = await request(app)
            .get(`/api/items/${newId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(getRes.statusCode).toEqual(404);
    });

    it('ne devrait pas accéder aux routes protégées sans token', async () => {
        const res = await request(app)
            .get('/api/items');
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toContain('Non autorisé, pas de token');
    });
});