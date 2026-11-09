const articleService = require("./articles.service");
const ForbiddenError = require("../../errors/forbidden");

class ArticlesController {
    // POST /api/articles
    async create(req, res, next) {
        try {
            const article = await articleService.create(req.body);
            req.io.emit("article:create", article);
            res.status(201).json(article);
        } catch (err) {
            next(err);
        }
    }
    // PUT /api/articles/:id
    async update(req, res, next) {
        try {
            if (req.user.role !== "admin") {
                throw new ForbiddenError("Vous n'avez pas le droit de modifier un article");
            }
            const id = req.params.id;
            const data = req.body;
            const articleModified = await articleService.update(id, data);
            req.io.emit("article:update", articleModified);
            res.status(200).json(articleModified);
        } catch (err) {
            next(err);
        }
    }
    // DELETE /api/articles/:id
    async delete(req, res, next) {
        try {
            if (req.user.role !== "admin") {
                throw new ForbiddenError("Vous n'avez pas le droit de supprimer un article");
            }
            const id = req.params.id;
            await articleService.delete(id);
            req.io.emit("article:delete", { id });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ArticlesController();