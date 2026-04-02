import type { Articles } from "../domain/articles.js";
import type { ArticlesPort } from "../port/articlesPort.js";

export class GetArticlesGateway implements ArticlesPort {
    getArticles(): Promise<Articles> {
        throw new Error("Method not implemented.");
    }
}
