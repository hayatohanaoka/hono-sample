export class Articles {
    public readonly items: Article[]

    constructor(items: Article[]) {
        this.items = items
    }

    static merge = (left: Articles, right: Articles): Articles =>
        new Articles([...left.items, ...right.items])
}

export class Article {
    public readonly title: string
    public readonly url: URL

    constructor(title: string, url: URL) {
        this.title = title
        this.url = url
    }
}
