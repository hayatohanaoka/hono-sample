import { GetArticlesUseCase } from "./usecase/getArticlesUseCase.js"
import { GetArticlesGateway } from "./gateway/getArticlesGateway.js"

const getArticlesGateway = new GetArticlesGateway()
export const getArticlesUseCase = new GetArticlesUseCase(getArticlesGateway)
