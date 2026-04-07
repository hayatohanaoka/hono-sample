import type { Articles } from "../domain/articles.js";
import type { QueryParams } from "../domain/queries.js";
import type { ArticlesPort } from "../port/articlesPort.js";

export class SearchArticleUseCase {
    private readonly port: ArticlesPort;
    
    constructor(port: ArticlesPort) {
        this.port = port;
    }

    execute = async (queryParams: QueryParams): Promise<Articles> =>
        await this.port.search(queryParams)
}
