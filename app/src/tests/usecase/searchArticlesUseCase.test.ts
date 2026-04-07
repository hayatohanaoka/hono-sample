import { mock } from "vitest-mock-extended"
import type { Articles } from "../../main/domain/articles.js"
import type { ArticlesPort } from "../../main/port/articlesPort.js"
import { SearchArticleUseCase } from "../../main/usecase/searchArticleUseCase.js"
import { QueryParams } from "../../main/domain/queries.js"

describe("getArticlesUseCase", () => {
  test("記事の一覧を取得して返す", async () => {
    const expected = mock<Articles>()

    const queryParams = new QueryParams("test")
    const port = mock<ArticlesPort>()
    port.search.mockResolvedValue(expected)
    const searchArticlesUseCase = new SearchArticleUseCase(port)

    const actual = await searchArticlesUseCase.execute(queryParams)

    expect(actual).toEqual(expected)
    expect(port.search).toHaveBeenCalledOnce()
    expect(port.search).toHaveBeenCalledWith(queryParams)
  })
})
  