import type { Articles } from "../domain/articles.js";
import type { ArticlesPort } from "../port/articlesPort.js";

export class GetArticlesUseCase {
    private readonly port: ArticlesPort;

    constructor(port: ArticlesPort) {
        this.port = port;
    }

    execute = async (): Promise<Articles> =>
        await this.port.get()
}
