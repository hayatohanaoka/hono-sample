import type { Articles } from "../domain/articles.js";
import type { QueryParams } from "../domain/queries.js";

export abstract class ArticlesPort {
    abstract get(): Promise<Articles>
    abstract search(queryParams: QueryParams): Promise<Articles>
}
