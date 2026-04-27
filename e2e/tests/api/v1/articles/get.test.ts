import { describe, test, expect, beforeEach } from "vitest";
import { resetAllStubs, setUpStubs } from "../../../../src/setup-wiremock.js";

describe('GET /v1/articles', () => {

    beforeEach(async () => {
        await resetAllStubs();
        await setUpStubs(import.meta.filename);
    });

    test('qiitaとZennから、最新の記事を取得して返す', async () => {

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

    test('qiitaとZennから、typescriptに関する記事を取得して返す', async () => {
        const expected = {
            "articles": [
                {
                    title: "TypeScriptについて、全てをお話します",
                    url: "https://qiita.com/dummy/items/1"
                },
                {
                    title: "TypeScriptについての資料です",
                    url: `${process.env.ZENN_URL!!}/dummy_pub/articles/dummy-article-slug`
                }
            ]
        }

        console.log(`${process.env.BASE_URL!!}/api/v1/articles?q=typescript`);

        const response = await fetch(`${process.env.TARGET_URL!!}/api/v1/articles?q=typescript`);

        const actual = await response.json();

        expect(response.status).toBe(200);
        expect(actual).toEqual(expected);
    });
});
