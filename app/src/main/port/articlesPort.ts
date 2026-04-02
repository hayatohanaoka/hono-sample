import type { Articles } from "../domain/articles.js";

export abstract class ArticlesPort {
    abstract getArticles(): Promise<Articles>
}
