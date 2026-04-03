import { GetArticlesUseCase } from "./usecase/getArticlesUseCase.js";
import { ArticlesGateway } from "./gateway/articlesGateway.js";
const getArticlesGateway = new ArticlesGateway();
export const getArticlesUseCase = new GetArticlesUseCase(getArticlesGateway);
