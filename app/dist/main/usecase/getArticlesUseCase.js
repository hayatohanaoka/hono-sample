export class GetArticlesUseCase {
    port;
    constructor(port) {
        this.port = port;
    }
    async execute() {
        return await this.port.getArticles();
    }
}
