import { GetArticlesUseCase } from "./usecase/getArticlesUseCase.js"
import { ArticlesGateway } from "./gateway/articlesGateway.js"
import { QiitaDriver, ZennDriver } from "./driver/driver.js"


const qiitaDriver = new QiitaDriver()
const zennDriver = new ZennDriver()
const getArticlesGateway = new ArticlesGateway(qiitaDriver, zennDriver)
export const getArticlesUseCase = new GetArticlesUseCase(getArticlesGateway)
