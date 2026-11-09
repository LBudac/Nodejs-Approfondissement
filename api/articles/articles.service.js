const Article = require("./articles.schema");

 class ArticleService {
    // GET /api/users/:userId/articles
    // Renvoie les articles d'un utilisateur, avec leur auteur sans son mot de passe
    getByUser(userId) {
        return Article.find({ user: userId}).populate({
          path: "user",
          select: "-password"
        })
    }
    // POST /api/articles
    create(data) {
        const article = new Article(data);
        return article.save();
    }
    // PUT /api/articles/:id
    update(id, data) {
        return Article.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    // DELETE /api/articles/:id
    delete(id) {
        return Article.deleteOne({ _id: id });
    }
 }

 module.exports = new ArticleService();