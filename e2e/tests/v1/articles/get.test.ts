import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { postStub, resetStubs } from "../../../src/setup-wiremock.js";
import qiitaMapping from "../../../fixtures/v1/articles/get/mappings/qiita.json" with { type: "json" };
import zennMapping from "../../../fixtures/v1/articles/get/mappings/zenn.json" with { type: "json" };

describe('GET /v1/articles', () => {

    afterAll(async () => {
        await resetStubs(process.env.QIITA_URL!!);
        await resetStubs(process.env.ZENN_URL!!);
    });

    test('qiitaとZennから、最新の記事を取得して返す', async () => {
        await postStub(process.env.QIITA_URL!!, JSON.stringify(qiitaMapping));
        await postStub(process.env.ZENN_URL!!, JSON.stringify(zennMapping));

        const expected = {
            "articles": [
                {
                    title: "AI Agentについて、全てをお話します",
                    url: "https://qiita.com/dummy/items/1"
                },
                {
                    title: "MCPサーバーの作り方について、全てをお話します",
                    url: "https://qiita.com/dummy/items/2"
                },
                {
                    title: "E2E フィクスチャのセットアップ方法",
                    url: `${process.env.ZENN_URL!!}/dummy_pub/articles/dummy-article-slug`
                },
                {
                    title: "クリーンアーキテクチャについて",
                    url: `${process.env.ZENN_URL!!}/dummy_pub/articles/dummy-article-slug2`
                }
            ]
        }

        console.log(`${process.env.BASE_URL!!}/api/v1/articles`);

        const response = await fetch(`${process.env.TARGET_URL!!}/api/v1/articles`);

        const actual = await response.json();

        expect(response.status).toBe(200);
        expect(actual).toEqual(expected);
    });
});
