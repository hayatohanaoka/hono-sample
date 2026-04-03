import { mock } from "vitest-mock-extended"
import type { Articles } from "../../main/domain/articles.js"
import type { ArticlesPort } from "../../main/port/articlesPort.js"
import { GetArticlesUseCase } from "../../main/usecase/getArticlesUseCase.js"

describe("getArticlesUseCase", () => {
  test("記事の一覧を取得して返す", async () => {
    const expected = mock<Articles>()

    const port = mock<ArticlesPort>()
    port.get.mockResolvedValue(expected)
    const getArticlesUseCase = new GetArticlesUseCase(port)

    const actual = await getArticlesUseCase.execute()

    expect(actual).toEqual(expected)
    expect(port.get).toHaveBeenCalledOnce()
  })
})
  