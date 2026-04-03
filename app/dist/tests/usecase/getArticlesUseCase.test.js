import { GetArticlesUseCase } from "../../main/usecase/getArticlesUseCase.js";
import { mock } from "vitest-mock-extended";
describe("getArticlesUseCase", () => {
    test("記事の一覧を取得して返す", async () => {
        const expected = mock();
        const port = mock();
        port.get.mockResolvedValue(expected);
        const getArticlesUseCase = new GetArticlesUseCase(port);
        const actual = await getArticlesUseCase.execute();
        expect(actual).toEqual(expected);
        expect(port.get).toHaveBeenCalledOnce();
    });
});
