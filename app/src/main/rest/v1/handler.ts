import { Hono } from "hono"
import { getArticlesUseCase } from "../../dependencies.js"
import type { Articles } from "../../domain/articles.js"

type ArticlesResponse = {
    "articles": ArticleResponse[]
}

type ArticleResponse = {
    title: string
    url: string
}

function toArticlesResponse(articles: Articles): ArticlesResponse {
    return {
        "articles": articles.items.map(item =>
            toArticleResponse(item.title, item.url)
        )
    }
}

function toArticleResponse(title: string, url: URL): ArticleResponse {
    return { title, url: url.toString() }
}


const v1 = new Hono()

v1.get('/systems/ping', (c) => {
    return c.text('pong')
})

v1.get('/articles', async (c) => {
    const articles = await getArticlesUseCase.execute()
    return c.json(
        toArticlesResponse(articles)
    )
})

export default v1
