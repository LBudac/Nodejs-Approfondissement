const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");

describe("tester API articles", () => {
    let token;
    // Identifiants au format ObjectId attendu par MongoDB je les ai générés avec https://rapidtoolset.com/fr/tool/random-mongodb-objectid-generator car j'avais besoin d'identifiants valides pour que mockingoose fonctionne correctement
    const USER_ID = "c5786a9bc52caa9bd8ffbc4d";
    const ARTICLE_ID = "f3ef1cdfbafbdaddeeadc8de";
    // Utilisateur fictif avec le rôle admin, requis pour modifier ou supprimer un article
    const ADMIN = {
        _id: USER_ID,
        name: "Testy",
        email: "testy@test.fr",
        password: "azertyuiop",
        role: "admin",
    };
    // Article fictif renvoyé à la place de la base de données
    const ARTICLE = {
        _id: ARTICLE_ID,
        title: "Le Titanic a coulé",
        content: "Le Titanic a coulé en percutant un iceberg, c'est une tragédie!!!",
        user: USER_ID,
    };
    
    // Exécuté avant chaque test : prépare le token et simule les réponses de MongoDB
    beforeEach(() => {
        // Token valide pour passer le middleware d'authentification
        token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
        // findById exécute un findOne : le middleware récupère ainsi l'admin
        mockingoose(User).toReturn(ADMIN, "findOne");
        // Réponse simulée pour article.save()
        mockingoose(Article).toReturn(ARTICLE, "save");
        // findByIdAndUpdate exécute un findOneAndUpdate
        mockingoose(Article).toReturn(ARTICLE, "findOneAndUpdate");
        // Réponse simulée pour Article.deleteOne()
        mockingoose(Article).toReturn({ deletedCount: 1 }, "deleteOne");
    });

    // POST /api/articles : la création doit renvoyer 201
    test("[Articles] Create", async () => {
        const res = await request(app)
            .post("/api/articles")
            .send({ title: "L'iceberg introspectif", content: "L'iceberg qui a fait sombrer le Titanic est il une métaphore de la vie?" })
            .set("x-access-token", token);
        expect(res.status).toBe(201);
    });

    // PUT /api/articles/:id : la modification par un admin doit renvoyer 200
    test("[Articles] Update", async () => {
        const res = await request(app)
            .put(`/api/articles/${ARTICLE_ID}`)
            .send({ title: "Le Titanic n'a pas coulé", content: "Une fake news traumatise les Etats-Unis" })
            .set("x-access-token", token);
        expect(res.status).toBe(200);
    });

    // DELETE /api/articles/:id : la suppression par un admin doit renvoyer 204 (sans contenu)
    test("[Articles] Delete", async () => {
        const res = await request(app)
            .delete(`/api/articles/${ARTICLE_ID}`)
            .set("x-access-token", token);
        expect(res.status).toBe(204);
    });
});