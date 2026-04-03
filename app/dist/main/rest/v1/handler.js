import { Hono } from "hono";
import { getArticlesUseCase } from "../../dependencies.js";
function toArticlesResponse(articles) {
    return {
        "articles": articles.items.map(item => toArticleResponse(item.title, item.url))
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
    const articles = await getArticlesUseCase.execute();
    return c.json(toArticlesResponse(articles));
});
export default v1;
