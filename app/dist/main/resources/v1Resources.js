import { Hono } from "hono";
import { getArticlesUseCase } from "../dependencies.js";
function toArticlesResponse(articles) {
    return {
        "articles": articles.map(article => toArticleResponse(article.title, article.url))
    };
}
function toArticleResponse(title, url) {
    return { title, url: url.toString() };
}
const v1 = new Hono();
v1.get('/systems/ping', (c) => {
    return c.text('pong');
});
v1.get('/articles', async (c) => {
    const response = await getArticlesUseCase().execute();
    return c.json(toArticlesResponse(response.articles));
});
export default v1;
