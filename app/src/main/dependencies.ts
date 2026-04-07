import { GetArticlesUseCase } from "./usecase/getArticlesUseCase.js"
import { ArticlesGateway } from "./gateway/articlesGateway.js"
import { QiitaDriver, ZennDriver } from "./driver/driver.js"
import { SearchArticleUseCase } from "./usecase/searchArticleUseCase.js"


const qiitaDriver = new QiitaDriver()
const zennDriver = new ZennDriver()
const articlesGateway = new ArticlesGateway(qiitaDriver, zennDriver)
export const getArticlesUseCase = new GetArticlesUseCase(articlesGateway)

export const searchArticlesUseCase = new SearchArticleUseCase(articlesGateway)
