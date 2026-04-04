import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import qiitaArticlesJson from './mappings/qiita.json' with { type: 'json' }
import zennArticlesJson from './mappings/zenn.json' with { type: 'json' }
import { QIITA_HOST, ZENN_HOST } from '../../../../hosts.js'

export const handlers = [
  http.get(`${QIITA_HOST}/api/v2/items?per_page=100`, () => {
    return HttpResponse.json(qiitaArticlesJson)
  }),
  http.get(`${ZENN_HOST}/api/articles?article_type=tech`, () => {
    return HttpResponse.json(zennArticlesJson)
  })
]

export const server = setupServer(...handlers)
