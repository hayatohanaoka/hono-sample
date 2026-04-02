import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { GetArticlesUseCase } from "../../main/usecase/getArticlesUseCase.js";
describe('getArticlesUseCase', () => {
    beforeEach(() => {
    });
    test('記事の一覧を取得して返す', async () => {
        const expected = {
            "articles": [
                {
                    title: "AI Agentについて、全てをお話します",
                    url: "https://qiita.com/dummy/items/1"
                },
                {
                    title: "クリーンアーキテクチャについて",
                    url: "https://zenn.dev/dummy_pub/articles/dummy-article-slug1"
                }
            ]
        };
        const mockPort = {
            getArticles: jest.fn().mockResolvedValue(expected),
        };
        const getArticlesUseCase = new GetArticlesUseCase(mockPort);
        const actual = await getArticlesUseCase.execute();
        expect(actual).toEqual(expected);
    });
});
