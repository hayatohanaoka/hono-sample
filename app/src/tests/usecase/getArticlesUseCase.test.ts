import type { Articles } from "../../main/domain/articles.js"
import type { ArticlesPort } from "../../main/port/articlesPort.js"
import { GetArticlesUseCase } from "../../main/usecase/getArticlesUseCase.js"

describe("getArticlesUseCase", () => {
  beforeEach(() => {})

  test("記事の一覧を取得して返す", async () => {
    const expected: Articles = {
      items: [
        {
          title: "AI Agentについて、全てをお話します",
          url: new URL("https://qiita.com/dummy/items/1"),
        },
        {
          title: "クリーンアーキテクチャについて",
          url: new URL("https://zenn.dev/dummy_pub/articles/dummy-article-slug1"),
        },
      ],
    }

    const mockPort = {
      getArticles: vi.fn<() => Promise<Articles>>().mockResolvedValue(expected),
    } as ArticlesPort

    const getArticlesUseCase = new GetArticlesUseCase(mockPort)

    const actual = await getArticlesUseCase.execute()
    expect(actual).toEqual(expected)
  })
})
