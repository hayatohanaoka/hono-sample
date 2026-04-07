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

    search = (queryParams: QueryParams): Promise<Articles> => Promise.all([
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
    static toArticlesFromQiitaResponse = (qiitaResponse: any): Articles =>
        new Articles(
            qiitaResponse.map((articleResponse: any) =>
                ArticlesGateway.toArticleFromQiitaResponse(articleResponse),
            ),
        );

    static toArticleFromQiitaResponse = (qiitaResponse: any): Article =>
        new Article(qiitaResponse.title, new URL(qiitaResponse.url));


    // for zenn
    static toArticlesFromZennResponse = (zennResponse: any): Articles =>
        new Articles(
            zennResponse.map((articleResponse: any) =>
                ArticlesGateway.toArticleFromZennResponse(articleResponse),
            ),
        );

    static toArticleFromZennResponse = (zennResponse: any): Article =>
        new Article(zennResponse.title, new URL(`${ZENN_HOST}${zennResponse.path}`));
}
