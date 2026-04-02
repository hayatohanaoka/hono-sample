import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import qiitaArticlesJson from './mappings/qiita.json' with { type: 'json' }
import zennArticlesJson from './mappings/zenn.json' with { type: 'json' }

export const handlers = [
  http.get('https://qiita.com/api/v2/items?per_page=100', () => {
    return HttpResponse.json(qiitaArticlesJson)
  }),
  http.get('https://zenn.dev/api/articles?article_type=tech', () => {
    return HttpResponse.json(zennArticlesJson)
  })
]

export const server = setupServer(...handlers)
