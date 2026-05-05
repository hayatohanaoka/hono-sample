import type { Articles } from "../domain/articles.js";
import type { QueryParams } from "../domain/queries.js";

export interface ArticlesPort {
    get(): Promise<Articles>
    search(queryParams: QueryParams): Promise<Articles>
}
