import { Article, Articles } from "../../main/domain/articles.js"

describe("Articles", () => {
    describe("merge", () => {
        test("leftとrightをマージした新しいArticles返す", () => {
            const left = new Articles([
                new Article("test", new URL("https://qiita.com/dummy/items/1"))
            ])
            const right = new Articles([
                new Article("test2", new URL("https://zenn.dev/dummy/articles/dummy-article-slug"))
            ])

            const expected = new Articles([
                new Article("test", new URL("https://qiita.com/dummy/items/1")),
                new Article("test2", new URL("https://zenn.dev/dummy/articles/dummy-article-slug"))
            ])
            const actual = Articles.merge(left, right)
            
            expect(actual).toEqual(expected)
        })
    })
})
