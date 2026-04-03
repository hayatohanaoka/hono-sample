import { afterEach, vi } from "vitest"
import { mock } from "vitest-mock-extended"
import { Article, Articles } from "../../main/domain/articles.js"
import type { IDriver } from "../../main/driver/driver.js"
import { ArticlesGateway } from "../../main/gateway/articlesGateway.js"

describe("ArticlesGateway", () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe("get", () => {
        test("qiitaとZennから記事を取得し、Articlesに変換して返す", async () => {
            const expected = new Articles([
                new Article("AI Agentについて、全てをお話します", new URL("https://qiita.com/dummy/items/1")),
                new Article("MCPサーバーの作り方について、全てをお話します", new URL("https://qiita.com/dummy/items/2")),
                new Article("E2E フィクスチャのセットアップ方法", new URL("https://zenn.dev/dummy_pub/articles/dummy-article-slug")),
                new Article("クリーンアーキテクチャについて", new URL("https://zenn.dev/dummy_pub/articles/dummy-article-slug2")),
            ])

            const mockQiitaDriver = mock<IDriver>()
            const mockQiitaResponse = mock<any>()
            mockQiitaDriver.getArticles.mockResolvedValue(mockQiitaResponse)

            const mockZennDriver = mock<IDriver>()
            const mockZennResponse = mock<any>()
            mockZennDriver.getArticles.mockResolvedValue(mockZennResponse)

            const articlesGateway = new ArticlesGateway(mockQiitaDriver, mockZennDriver)

            const toArticlesSpy = vi
                .spyOn(ArticlesGateway, "toArticlesFromResponse")
                .mockResolvedValue(expected)

            const actual = await articlesGateway.get()

            expect(actual).toEqual(expected)

            expect(toArticlesSpy).toHaveBeenCalledWith(mockQiitaResponse, mockZennResponse)
            expect(toArticlesSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe("toArticlesFromResponse", () => {
        test("qiitaResponseとzennResponseを受け取って、Articlesに変換して返す", () => {
            const expected = mock<Articles>()

            const mockQiitaArticles = mock<Articles>()
            const mockZennArticles = mock<Articles>()
            const toArticlesFromQiitaResponseSpy = vi
            .spyOn(ArticlesGateway, "toArticlesFromQiitaResponse")
            .mockReturnValue(mockQiitaArticles)
            const toArticlesFromZennResponseSpy = vi
            .spyOn(ArticlesGateway, "toArticlesFromZennResponse")
            .mockReturnValue(mockZennArticles)
            const mergeSpy = vi
            .spyOn(Articles, "merge")
            .mockReturnValue(expected)
            
            const mockQiitaResponse = mock<any>()
            const mockZennResponse = mock<any>()
            mockZennResponse.articles = mock<any>()
            const actual = ArticlesGateway
                .toArticlesFromResponse(mockQiitaResponse, mockZennResponse)

            expect(actual).toEqual(expected)

            expect(toArticlesFromQiitaResponseSpy).toHaveBeenCalledWith(mockQiitaResponse)
            expect(toArticlesFromZennResponseSpy).toHaveBeenCalledWith(mockZennResponse.articles)
            expect(mergeSpy).toHaveBeenCalledWith(mockQiitaArticles, mockZennArticles)

            expect(toArticlesFromQiitaResponseSpy).toHaveBeenCalledTimes(1)
            expect(toArticlesFromZennResponseSpy).toHaveBeenCalledTimes(1)
            expect(mergeSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe("for qiita articles", () => {
        describe("toArticlesFromQiitaResponse", () => {
            test("qiitaResponseを受け取って、Articlesに変換して返す", () => {
                const mockArticle = mock<Article>()
                const expected = new Articles([
                    mockArticle, mockArticle
                ])
    
                const mockQiitaArticle1 = mock<any>()
                const mockQiitaArticle2 = mock<any>()
                const mockQiitaResponse = [mockQiitaArticle1, mockQiitaArticle2]
    
                const toArticleFromQiitaResponseSpy = vi
                    . spyOn(ArticlesGateway, "toArticleFromQiitaResponse")
                    .mockReturnValue(mockArticle)
    
                const actual = ArticlesGateway.toArticlesFromQiitaResponse(mockQiitaResponse)
    
                expect(actual).toEqual(expected)
    
                expect(toArticleFromQiitaResponseSpy).toHaveBeenCalledWith(mockQiitaArticle1)
                expect(toArticleFromQiitaResponseSpy).toHaveBeenCalledWith(mockQiitaArticle2)
                expect(toArticleFromQiitaResponseSpy).toHaveBeenCalledTimes(2)
            })
        })
    
        describe("toArticleFromQiitaResponse", () => {
            test("単一のqiitaResponseを受け取って、Articleに変換して返す", () => {
                const expected = new Article("test", new URL("https://qiita.com/dummy/items/1"))
    
                const mockQiitaResponse = mock<any>()
                mockQiitaResponse.title = "test"
                mockQiitaResponse.url = "https://qiita.com/dummy/items/1"
    
                const actual = ArticlesGateway.toArticleFromQiitaResponse(mockQiitaResponse)
    
                expect(actual).toEqual(expected)
            })
        })
    })

    describe("for zenn articles", () => {
        describe("toArticlesFromZennResponse", () => {
            test("zennResponseを受け取って、Articlesに変換して返す", () => {
                const mockArticle = mock<Article>()
                const expected = new Articles([
                    mockArticle, mockArticle
                ])
    
                const mockZennArticle1 = mock<any>()
                const mockZennArticle2 = mock<any>()
                const mockZennResponse = [mockZennArticle1, mockZennArticle2]
    
                const toArticleFromZennResponseSpy = vi
                    . spyOn(ArticlesGateway, "toArticleFromZennResponse")
                    .mockReturnValue(mockArticle)
    
                const actual = ArticlesGateway.toArticlesFromZennResponse(mockZennResponse)
    
                expect(actual).toEqual(expected)
    
                expect(toArticleFromZennResponseSpy).toHaveBeenCalledWith(mockZennArticle1)
                expect(toArticleFromZennResponseSpy).toHaveBeenCalledWith(mockZennArticle2)
                expect(toArticleFromZennResponseSpy).toHaveBeenCalledTimes(2)
            })
        })
    
        describe("toArticleFromZennResponse", () => {
            test("単一のqiitaResponseを受け取って、Articleに変換して返す", () => {
                const expected = new Article("test", new URL("https://zenn.dev/dummy/articles/dummy-article-slug"))
    
                const mockZennResponse = mock<any>()
                mockZennResponse.title = "test"
                mockZennResponse.path = "/dummy/articles/dummy-article-slug"
    
                const actual = ArticlesGateway.toArticleFromZennResponse(mockZennResponse)
    
                expect(actual).toEqual(expected)
            })
        })
    })

})
