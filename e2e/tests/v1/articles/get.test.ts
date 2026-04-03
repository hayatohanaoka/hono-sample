import { describe, test, expect } from "vitest";

describe('GET /v1/articles', () => {
    test('qiitaとZennから、最新の記事を取得して返す', async () => {
        const expected = JSON.stringify({
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
                    url: "https://zenn.dev/dummy_pub/articles/dummy-article-slug"
                },
                {
                    title: "クリーンアーキテクチャについて",
                    url: "https://zenn.dev/dummy_pub/articles/dummy-article-slug2"
                }
            ]
        })

        const response = await fetch('http://localhost:13000/api/v1/articles')

        const actual = await response.json();
        
        expect(response.status).toBe(200);
        expect(actual).toEqual(expected);
    })
})
