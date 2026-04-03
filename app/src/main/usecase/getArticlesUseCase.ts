import type { Articles } from "../domain/articles.js";
import type { ArticlesPort } from "../port/articlesPort.js";

export class GetArticlesUseCase {
    private readonly port: ArticlesPort;

    constructor(port: ArticlesPort) {
        this.port = port;
    }

    async execute(): Promise<Articles> {
        return await this.port.get()
    }
}
