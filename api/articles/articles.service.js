const Article = require("./articles.schema");

 class ArticleService {
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