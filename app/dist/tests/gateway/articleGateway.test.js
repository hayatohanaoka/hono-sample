import { ArticlesGateway } from "../../main/gateway/articlesGateway.js";
import qiitaArticlesJson from "./qiita.json" with { type: "json" };
import zennArticlesJson from "./zenn.json" with { type: "json" };
describe("ArticlesGateway", () => {
    test("qiitaとZennから記事を取得し、ドメインオブジェクトに変換して返す", async () => {
        const expected = {
            "items": [
                {
                    title: "AI Agentについて、全てをお話します",
                    url: new URL("https://qiita.com/dummy/items/1"),
                },
                {
                    title: "クリーンアーキテクチャについて",
                    url: new URL("https://zenn.dev/dummy_pub/articles/dummy-article-slug1"),
                }
            ]
        };
        const mockQiitaDriver = {
            get: vi.fn().mockResolvedValue(qiitaArticlesJson),
        };
        const mockZennDriver = {
            get: vi.fn().mockResolvedValue(zennArticlesJson),
        };
        vi.mocked(Articles);
        const articlesGateway = new ArticlesGateway(mockQiitaDriver, mockZennDriver);
        const actual = await articlesGateway.get();
        expect(actual).toEqual(expected);
    });
});
