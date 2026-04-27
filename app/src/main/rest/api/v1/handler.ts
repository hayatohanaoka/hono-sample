import { Hono } from "hono"
import { getArticlesUseCase, searchArticlesUseCase } from "../../../dependencies.js"
import type { Articles } from "../../../domain/articles.js"
import { QueryParams } from "../../../domain/queries.js"

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


const v1Handler = new Hono()

v1Handler.get('/articles', async (c) => {
    const q = c.req.query('q')
    const articles = q
        ? await searchArticlesUseCase.execute(new QueryParams(q))
        : await getArticlesUseCase.execute()
    return c.json(toArticlesResponse(articles))
})

export default v1Handler
