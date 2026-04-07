import { ZENN_HOST } from "../articleSourceUrls.js";
import { Article, Articles } from "../domain/articles.js";
import type { QueryParams } from "../domain/queries.js";
import type { IDriver } from "../driver/driver.js";
import type { ArticlesPort } from "../port/articlesPort.js";

export class ArticlesGateway implements ArticlesPort {
    private readonly qiitaDriver: IDriver;
    private readonly zennDriver: IDriver;

    constructor(qiitaDriver: IDriver, zennDriver: IDriver) {
        this.qiitaDriver = qiitaDriver;
        this.zennDriver = zennDriver;
    }

    get = async (): Promise<Articles> =>
        await Promise.all([
            this.qiitaDriver.getArticles(),
            this.zennDriver.getArticles(),
        ]).then(([qiitaResponse, zennResponse]) =>
            ArticlesGateway.toArticlesFromResponse(qiitaResponse, zennResponse),
        );

    search = async (queryParams: QueryParams): Promise<Articles> =>
        await Promise.all([
            this.qiitaDriver.searchArticles(queryParams.searchQuery),
            this.zennDriver.searchArticles(queryParams.searchQuery),
        ]).then(([qiitaResponse, zennResponse]) =>
            ArticlesGateway.toArticlesFromResponse(qiitaResponse, zennResponse),
        );

    static toArticlesFromResponse = (
        qiitaResponse: any,
        zennResponse: any,
    ): Articles =>
        Articles.merge(
            ArticlesGateway.toArticlesFromQiitaResponse(qiitaResponse),
            ArticlesGateway.toArticlesFromZennResponse(zennResponse.articles),
        );

    // for qiita
    static toArticlesFromQiitaResponse = (articlesResponse: any): Articles =>
        new Articles(
            articlesResponse.map((articleResponse: any) =>
                ArticlesGateway.toArticleFromQiitaResponse(articleResponse),
            ),
        );

    static toArticleFromQiitaResponse = (articleResponse: any): Article =>
        new Article(articleResponse.title, new URL(articleResponse.url));

    // for zenn
    static toArticlesFromZennResponse = (articlesResponse: any): Articles =>
        new Articles(
            articlesResponse.map((articleResponse: any) =>
                ArticlesGateway.toArticleFromZennResponse(articleResponse),
            ),
        );

    static toArticleFromZennResponse = (articleResponse: any): Article =>
        new Article(articleResponse.title, new URL(`${ZENN_HOST}${articleResponse.path}`));
}
